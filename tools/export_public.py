#!/usr/bin/env python3
"""Export a reviewed public snapshot; never edits the source workspace or its Git history."""
from pathlib import Path
from urllib.parse import unquote, quote
from datetime import datetime, timezone
import argparse, hashlib, json, os, re, shutil, subprocess, sys, unicodedata

ROOT_REPORT='output/latex/Bao_cao_giua_ky_LaTeX_theo_mau_DA1'
BLOCK_PARTS={'.git','node_modules','.next','.vercel','artifacts','test-results','playwright-report','__pycache__','.pytest_cache','originals','text','text_ocr','pages','unpacked','received','backups','Du_phong_theo_doi','Bao_cao_DA_1'}
BLOCK_SUFFIXES={'.xlsx','.xls','.docx','.doc','.zip','.rar','.gz','.aux','.toc','.out','.fls','.fdb_latexmk','.bcf','.bbl','.blg','.run.xml','.xdv','.synctex.gz','.log','.pyc','.tsbuildinfo','.pem','.key'}
SAFE_PDFS={'output/pdf/Danh_muc_tai_lieu_can_bo_sung.pdf','output/pdf/De_nghi_cung_cap_FAQ_va_vuong_mac_thuc_te.pdf'}
KEY_PATTERN=re.compile(r'AIza[\w-]{25,}|(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{25,}|\b(?:sk-proj-|sk-ant-|vcp_)[A-Za-z0-9_-]{25,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----')
LOCAL_PATH=re.compile(r'/Users/[^/\s\"\'<>]+')
PHONE=re.compile(r'(?<![\w])(?:\+84|0)[ .-]?[35789](?:[ .-]?\d){8}(?![\w])')


def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def nfc(text):return unicodedata.normalize('NFC',text)
def plain(text):return ''.join(c for c in unicodedata.normalize('NFD',text) if unicodedata.category(c)!='Mn')

def identity(source):
    config=source/ROOT_REPORT/'config/thong_tin.tex'
    text=config.read_text() if config.is_file() else ''
    fields={k:v for k,v in re.findall(r'\\newcommand\{\\(HoTenSinhVien|MaSoSinhVien|EmailSinhVien)\}\{([^}]*)\}',text)}
    names=[]
    name=fields.get('HoTenSinhVien','').strip()
    if name and name!='Sinh viên':
        names.extend([name,plain(name),''.join(plain(name).split())])
        if len(name.split())>=2:names.append(''.join(plain(name).split()[-2:]))
    emails=[fields.get('EmailSinhVien','').strip()]
    try:emails.append(subprocess.check_output(['git','config','user.email'],cwd=source,text=True,stderr=subprocess.DEVNULL).strip())
    except subprocess.CalledProcessError:pass
    return {'names':sorted(set(filter(None,names)),key=len,reverse=True),'student_id':fields.get('MaSoSinhVien','').strip(),'emails':list(filter(lambda x:x and x!='student@example.invalid',set(emails)))}

def scrub(text,who,source):
    for value in who['names']:
        for form in {value,nfc(value),unicodedata.normalize('NFD',value)}:text=re.sub(re.escape(form),'Sinh viên' if ' ' in value else 'Student',text,flags=re.I)
    if who['student_id'] and who['student_id']!='00000000':text=text.replace(who['student_id'],'00000000')
    for email in who['emails']:text=re.sub(re.escape(email),'student@example.invalid',text,flags=re.I)
    for root in {str(source),nfc(str(source)),unicodedata.normalize('NFD',str(source))}:text=text.replace(root,'${PROJECT_ROOT}')
    text=LOCAL_PATH.sub('${HOME}',text)
    text=re.sub(r'/(?:private/)?var/folders/[^\s\"\'<>]+','${TMPDIR}',text)
    text=re.sub(r'/(?:private/)?tmp(?=/|\b)','${TMPDIR}',text)
    text=PHONE.sub('[Số điện thoại đã ẩn]',text)
    return text

def exclusion(path):
    if any(x in BLOCK_PARTS for x in path.parts):return 'private_or_generated_directory'
    if path.parts[0]=='metadata':return 'local_migration_metadata'
    if path.as_posix()=='Artifact_tham_khao/Quy_dinh_HUST_2026/index.html':return 'generated_catalog_for_private_downloads'
    if path.name=='AGENTS.md':return 'withdrawn_agent_instructions'
    if path.name=='.DS_Store' or path.name.startswith('~$'):return 'temporary_file'
    if path.name.startswith('.env') and path.name!='.env.example':return 'secret_configuration'
    if any(path.name.endswith(s) for s in BLOCK_SUFFIXES):return 'binary_private_or_regenerable'
    if path.suffix.lower()=='.pdf' and path.as_posix() not in SAFE_PDFS:return 'compiled_report_or_external_pdf'
    return None

def rewrite_links(text,rel,source,available):
    # Markdown links only. Keep external references; turn omitted local files into explicit local-only notes.
    def link(match):
        label,target=match.group(1),match.group(2);wrapped=target.startswith('<') and target.endswith('>')
        if wrapped:target=target[1:-1]
        if re.match(r'^(?:https?://|mailto:|#|app://|plugin://|codex://)',target):return match.group(0)
        part,mark,fragment=target.partition('#');part=unquote(part)
        if not part:return match.group(0)
        absolute=Path(part)
        if absolute.is_absolute():
            try:key=str(absolute.relative_to(source))
            except ValueError:return label+' (tệp tại máy, không kèm bản công khai)'
        elif part.startswith('${'):
            return label+' (đường dẫn cục bộ, không kèm bản công khai)'
        else:key=os.path.normpath(str(rel.parent/part))
        if key in available:
            result=os.path.relpath(key,str(rel.parent));result+=('#'+fragment) if mark else ''
            return '['+label+']('+('<'+result+'>' if ' ' in result else result)+')'
        return label+' (tệp cục bộ/không kèm bản công khai)'
    return re.sub(r'\[([^\]\n]+)\]\((<[^>\n]+>|[^)\n]+)\)',link,text)

def public_readme():
    return '''# HUST Procedural Assistant — Đồ án 2

Chatbot tư vấn theo tình huống về thủ tục khoa học–công nghệ, tài chính và nhân sự tại Đại học Bách khoa Hà Nội.

## Trạng thái

Phạm vi đề tài: đăng ký nhiệm vụ (T1), điều chỉnh/gia hạn (T3), nghiệm thu (T4), hội thảo/công tác (T6), cử đi đào tạo/nghiên cứu (T10). Nguyên mẫu hiện triển khai T6 với nguồn mẫu tự tạo; chưa xác nhận độ đúng nghiệp vụ HUST.

Đã có hỏi bổ sung, đối chiếu điều kiện, cập nhật dữ kiện, tìm lịch sử, sửa/rút dữ kiện, dẫn nguồn và giao diện sáng/tối. Mô hình trích dữ kiện/diễn đạt; máy chủ quản lý nguồn và kết luận. Khi có narrative hợp lệ, kết luận engine nằm trong mục mở rộng “Điều kiện và căn cứ”.

Bản công khai trên [Vercel](https://hust-t6-demo.vercel.app) hiện dùng fixture. Gemini từng được thử trên Preview; **chưa đạt kiểm chứng để phát hành công khai**. Vòng 13/11 có hai timeout với Gemini 3.8 Flash; không chuyển chúng thành ca đạt. Tài liệu và FAQ mới đang chờ, gói nguồn thật chưa kích hoạt.

## Chạy ứng dụng

Cần Node.js 22.x và npm. Tại thư mục gốc:

```sh
cd demo-hust
npm ci
npm run dev
```

Mở http://127.0.0.1:3000. Mặc định `fixture`, không cần key hoặc API trả phí. Để chạy bản tối ưu: `npm run build`, rồi `npm start`. Muốn thử provider khác, tự tạo `.env.local` từ `.env.example` và điền cấu hình máy chủ. Không commit key, bật billing hoặc coi ChatGPT Plus là API credits.

```sh
npm run typecheck
npm test
npm run build
```

Các kiểm thử mã dùng mock khi cần, không gọi model thật. Playwright cần Chrome và một ứng dụng đang chạy; `PLAYWRIGHT_BASE_URL` chọn đúng URL. Không chạy lại các bộ hội thoại model chỉ để thay điểm lịch sử.

## Các phần của project

| Nội dung | Điểm bắt đầu |
|---|---|
| Ứng dụng và kiểm thử | [demo-hust](demo-hust/README.md) |
| Phạm vi và đặc tả | [Requirement](Artifact_De_tai_chinh/00_REQUIREMENTS_CHATBOT_THU_TUC_HUST.md) |
| Tiến độ hiện tại | [Nhật ký demo](demo-hust/docs/TIEN_DO_DEMO.md) |
| Phần chuẩn bị trước tài liệu mới | [Tổng hợp 13–18/11](Artifact_De_tai_chinh/Tuan_7/KET_QUA_13_18_11.md) |
| Nhận tài liệu/FAQ | [Hướng dẫn](Artifact_De_tai_chinh/Tuan_7/README.md) |
| Source báo cáo hoàn chỉnh | [main.tex](output/latex/Bao_cao_giua_ky_LaTeX_theo_mau_DA1/main.tex) |
| Source báo cáo tuần 4 | [main.tex](Artifact_De_tai_chinh/Bao_cao_tien_do_02_LaTeX/main.tex) |
| Source báo cáo tuần 5 | [main.tex](Artifact_De_tai_chinh/Bao_cao_tuan_5_LaTeX/main.tex) |
| Source báo cáo tuần 6 | [main.tex](Artifact_De_tai_chinh/Bao_cao_tuan_6_LaTeX/main.tex) |
| Danh mục tài liệu cần bổ sung | [Tài liệu](Artifact_De_tai_chinh/De_nghi_du_lieu_2026-11-13/Danh_muc_tai_lieu_can_bo_sung.md) · [FAQ](Artifact_De_tai_chinh/De_nghi_du_lieu_2026-11-13/De_nghi_cung_cap_FAQ_va_vuong_mac_thuc_te.md) |
| Kiểm chứng bản công khai | [PUBLIC_VERIFICATION.json](PUBLIC_VERIFICATION.json) |

## Biên dịch báo cáo

Source công khai dùng thông tin sinh viên mẫu; bản gốc riêng tại máy không thay đổi. Cài MacTeX/TeX Live có latexmk; chạy `Bien_dich.command` trong đúng thư mục báo cáo. Báo cáo hoàn chỉnh dùng pdfLaTeX/Biber; tuần 5–6 dùng XeLaTeX. PDF sinh ra không được Git theo dõi. Những báo cáo đề xuất/tuần 4 chỉ có `main.tex` thì dùng `latexmk -xelatex main.tex` theo khai báo TEX trong source. Không coi báo cáo đề xuất cũ là phạm vi sản phẩm hiện hành.

## Dữ liệu và bằng chứng

Chỉ nguồn mẫu được đóng gói trong ứng dụng. Danh mục, metadata và ca thử không chứng minh văn bản có hiệu lực hoặc được phép công bố. Bản gốc, OCR, tài liệu thầy chưa rõ quyền sử dụng, dữ liệu nhận riêng tư, PDF/Excel có định danh và artifact nặng được giữ ngoài repo. Các công cụ kiểm toàn vẹn kho nguồn cần các bản gốc riêng; việc chúng không có trong repo công khai không được ghi thành “đủ dữ liệu”.

Bằng chứng lịch sử đã chọn nằm trong `demo-hust/docs/evidence/week6`; bản tổng hợp 13/11 nằm trong `demo-hust/docs/evidence/week7`. Giữ nguyên lỗi và phân biệt kiểm kỹ thuật với xác nhận nghiệp vụ. Một số đường dẫn artifact lịch sử chỉ tồn tại tại máy và được ghi rõ, không phải liên kết tải công khai.

## Cập nhật bản công khai

Đây là snapshot có lịch sử Git mới, không mang lịch sử repo cũ hoặc cấu hình Vercel. Workspace riêng vẫn là nguồn làm việc chính. Xem [hướng dẫn đồng bộ](PUBLIC_EXPORT.md) và công cụ `tools/export_public.py`. Việc đẩy GitHub không tự triển khai website.
'''

def curated_evidence(source,out,who):
    base=source/'demo-hust/artifacts/week7-2026-11-13'
    mapping={'verification.json':'summary.json','replay/final/legacy.json':'replay-legacy.json','replay/final/heldout.json':'replay-heldout.json','gemini-smoke/week7-development-gemini.json':'gemini-smoke.json'}
    result={};dest=out/'demo-hust/docs/evidence/week7';dest.mkdir(parents=True,exist_ok=True)
    for original,name in mapping.items():
        file=base/original
        if not file.is_file():continue
        value=scrub(file.read_text(),who,source);json.loads(value)
        if KEY_PATTERN.search(value):raise ValueError('Secret found in curated evidence; stop')
        target=dest/name;target.write_text(value);result[str(target.relative_to(out))]=sha(target)
    readme=dest/'README.md';readme.write_text('Tuyển chọn bằng chứng kỹ thuật ngày 13/11/2026.\n\nsummary.json ghi lần kiểm trong workspace riêng: 168 unit, 3 Python, 36 API và 16 browser trên Preview fixture v1. Các ca narrative trình duyệt dùng mock. Không quy các số này thành xác nhận nghiệp vụ hoặc số đo mới của bản xuất công khai.\n\nreplay-legacy.json và replay-heldout.json phát lại đầu vào/diễn đạt đã lưu, không gọi model mới và không sửa điểm lịch sử. Bộ từng giữ riêng đã được xem nên chỉ dùng hồi quy.\n\ngemini-smoke.json ghi hai yêu cầu thật qua Vercel với Gemini 3.8 Flash bị timeout; hai lượt phụ thuộc không chạy. Tám hội thoại phát triển chưa chạy. Không có kết quả model thành công trong vòng này.\n\nBằng chứng đầy đủ, ảnh và artifact nặng giữ tại máy. Không có key, token Automation, tài liệu HUST thật hoặc hồ sơ cá nhân trong bộ này. PUBLIC_VERIFICATION.json ở gốc ghi kiểm tra riêng của bản xuất GitHub.\n')
    result[str(readme.relative_to(out))]=sha(readme)
    return result


def export(source,out,apply=False):
    source=source.resolve();out=out.resolve()
    if source==out or out.is_relative_to(source):raise ValueError('Output must be separate from the original workspace')
    who=identity(source)
    paths=subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard','-z'],cwd=source).decode().split('\0')
    selected={};omitted=[]
    for value in sorted(set(filter(None,paths))):
        rel=Path(value);file=source/rel
        if not file.is_file():continue # Respect user deletions.
        reason=exclusion(rel)
        if reason:omitted.append({'path':scrub(value,who,source),'reason':reason});continue
        if file.is_symlink() and not file.resolve().is_relative_to(source):omitted.append({'path':scrub(value,who,source),'reason':'symlink_outside_workspace'});continue
        clean=Path(scrub(value,who,source));selected[value]=clean
    available={p.as_posix() for p in selected.values()}
    if len(available)!=len(selected):raise ValueError('Sanitized paths collide')
    if not apply:return {'apply':False,'files':len(selected),'excluded':len(omitted)}
    previous={}
    if out.exists() and any(out.iterdir()):
        if not (out/'.git').is_dir():raise ValueError('Output exists and is not a public repository; do not overwrite')
        if subprocess.check_output(['git','status','--porcelain'],cwd=out,text=True).strip():raise ValueError('Public working tree is dirty; commit or review its edits first')
        previous=json.loads((out/'PUBLIC_EXPORT.json').read_text())
    out.mkdir(parents=True,exist_ok=True);results={}
    for value,clean in selected.items():
        original=source/value;target=out/clean;target.parent.mkdir(parents=True,exist_ok=True)
        try:text=original.read_text()
        except UnicodeError:
            if original.suffix.lower()!='.pdf':raise ValueError('Unreviewed binary '+str(clean))
            # Two student-authored request PDFs; validate text/metadata without publishing extracted text.
            from pypdf import PdfReader
            reader=PdfReader(original);body='\n'.join(p.extract_text() or '' for p in reader.pages)+str(reader.metadata)
            if scrub(body,who,source)!=body or KEY_PATTERN.search(body):raise ValueError('Binary requires redaction; omit it: '+str(clean))
            shutil.copyfile(original,target)
        else:
            if clean.suffix=='.md':
                text=rewrite_links(text,clean,source,available)
                text=text.replace('demo-hust/AGENTS.md','demo-hust/README.md').replace('`AGENTS.md`','`README.md`')
            text=scrub(text,who,source)
            if clean.name=='.env.example':text=re.sub(r'^([A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*=).*$',r'\1',text,flags=re.M)
            # Retain fixture/runtime behavior; public material can reference private files only as unavailable.
            if clean.name=='AGENTS.md':raise AssertionError('Withdrawn agent instructions cannot enter export')
            if clean.as_posix()=='Artifact_tham_khao/Quy_dinh_HUST_2026/tools/ocr_sources.py':
                text=text.replace("'--tessdata-dir','${TMPDIR}/hust-ocr-tessdata',", "*(['--tessdata-dir',os.environ['HUST_TESSDATA_DIR']] if os.environ.get('HUST_TESSDATA_DIR') else []),")
            target.write_text(text)
        target.chmod(original.stat().st_mode & 0o777);results[clean.as_posix()]=sha(target)
    (out/'README.md').write_text(public_readme());results['README.md']=sha(out/'README.md')
    additions='''\n# Public export: generated reports and local receipts stay private.\n*.pdf\n!output/pdf/Danh_muc_tai_lieu_can_bo_sung.pdf\n!output/pdf/De_nghi_cung_cap_FAQ_va_vuong_mac_thuc_te.pdf\n*.xlsx\n*.xls\n*.docx\n*.doc\n**/received/\n**/text/\n**/text_ocr/\n**/originals/\n**/unpacked/\n**/.receive.lock\n/public-check-artifacts/\n'''
    ig=out/'.gitignore';ig.write_text(ig.read_text()+additions);results['.gitignore']=sha(ig)
    # Attach current public digests; historical digests and results are preserved.
    mf=out/'demo-hust/docs/source-manifest.json';value=json.loads(mf.read_text())
    for item in value.get('sources',[]):
        path=item.get('path_from_workspace');target=out/path if path else None
        item['public_export']={'included':bool(target and target.is_file()),'sha256':sha(target) if target and target.is_file() else None,'note':'Public copy may anonymize student details; original digest above identifies the private design reference.'}
    value['public_export']={'history':'fresh_snapshot','originals_and_private_data_included':False}
    mf.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n');results[str(mf.relative_to(out))]=sha(mf)
    # Keep the generator needed to repeat exactly the same filtering.
    tools=out/'tools';tools.mkdir(exist_ok=True);script=tools/'export_public.py';
    if Path(__file__).resolve()!=script.resolve():shutil.copyfile(Path(__file__).resolve(),script)
    results['tools/export_public.py']=sha(script)
    tests=Path(__file__).resolve().with_name('test_export_public.py')
    if tests.is_file():
        dest=tools/'test_export_public.py'
        if tests!=dest.resolve():shutil.copyfile(tests,dest)
        results['tools/test_export_public.py']=sha(dest)
    doc=out/'PUBLIC_EXPORT.md';doc.write_text('''# Đồng bộ bản công khai\n\nWorkspace riêng giữ nguyên source và dữ liệu cá nhân. Repo này là bản xuất đã lọc, không tự kết nối Vercel.\n\n1. Sửa và kiểm tra trong workspace riêng.\n2. Bảo đảm repo công khai không có thay đổi chưa commit. Chạy từ repo này: `python3 tools/export_public.py --source "/đường/dẫn/workspace-riêng" --output .` để xem trước, thêm `--apply` mới cập nhật. Công cụ cần Python 3.9+ và pypdf nếu giữ hai PDF đề nghị dữ liệu.\n3. Kiểm README, liên kết, định danh, bí mật, danh sách tệp và các hash source sau khi xuất. Chạy lại typecheck/test/build khi source ứng dụng thay đổi. Không gọi model để kiểm thao tác đồng bộ Git.\n4. Tạo commit và push `main` sau khi rà diff. Không dùng `git add` hoặc push từ workspace riêng để thay cho bước lọc. Không force-push.\n\nBộ xuất mặc định loại bản gốc/OCR/receipt, tài liệu thầy, tệp môi trường thật, cấu hình Vercel, cache, lịch sử Git cũ, PDF báo cáo, Excel và chỉ dẫn AGENTS đã được rút. Source báo cáo thay thông tin sinh viên bằng dữ liệu mẫu; số liệu kiểm thử lịch sử giữ nguyên. Hai PDF yêu cầu tài liệu/FAQ chỉ kèm khi kiểm tra không có định danh hoặc secret.\n\n`PUBLIC_EXPORT.json` mô tả bản xuất và tệp loại theo lý do. `PUBLIC_VERIFICATION.json` ghi lần kiểm thực tế trước phát hành; khi cập nhật mới phải kiểm lại trước khi sử dụng kết quả đó. Không tự thêm giấy phép mã nguồn/tài liệu khi chưa có yêu cầu của chủ dự án.\n''');results['PUBLIC_EXPORT.md']=sha(doc)
    results.update(curated_evidence(source,out,who))
    generated={'PUBLIC_EXPORT.json','PUBLIC_VERIFICATION.json','tools/export_public.py','tools/test_export_public.py','PUBLIC_EXPORT.md'}
    # Remove only files recorded by our own prior export; never restore a deleted source file.
    for path in previous.get('files',{}):
        if path not in results and path not in generated:
            stale=(out/path).resolve()
            if stale.is_relative_to(out) and stale.is_file():stale.unlink()
    manifest={'schemaVersion':1,'exportedAt':datetime.now(timezone.utc).isoformat(),'sourceRole':'private_working_copy','history':'fresh_snapshot','containsOriginalGitHistory':False,'containsPersonalStudentDetails':False,'containsPrivateOriginalDocuments':False,'files':results,'excluded':omitted,'verification':'See PUBLIC_VERIFICATION.json; it refers to the last measured export.'}
    (out/'PUBLIC_EXPORT.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    return {'apply':True,'files':len(results),'excluded':len(omitted)}

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--source',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--apply',action='store_true');a=p.parse_args()
    try:print(json.dumps(export(a.source,a.output,a.apply),ensure_ascii=False))
    except Exception as e:print('Export stopped: '+str(e),file=sys.stderr);sys.exit(2)
