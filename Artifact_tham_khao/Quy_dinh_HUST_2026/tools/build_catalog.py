"""Build auditable local indexes. Counts files, never claims policy completeness."""
import csv,json,hashlib,html,re,datetime,zipfile
from pathlib import Path
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
records=json.loads((ROOT/'metadata/downloads.json').read_text())
by_url={r['url']:r for r in records}
ocr_path=ROOT/'metadata/ocr-results.json'
ocrs=json.loads(ocr_path.read_text()) if ocr_path.exists() else []
ocr_by_path={r['original_path']:r for r in ocrs}
labels={l['url']:l['label'] for r in records for l in r.get('links',[]) if l['label']}
national={
 '216453':('TT 39/2025/TT-BKHCN','T3/T6','2025-11-30','2026-01-01','Kinh phí nhiệm vụ; điều 17, 44–45'),
 '215664':('NĐ 267/2025/NĐ-CP','T1/T3/T4/T6','2025-10-14','2025-10-14','Chương trình/nhiệm vụ; nguồn ngân sách'),
 '190008':('TT 40/2017/TT-BTC','T6','2017-04-28','2017-07-01','Đọc cùng TT 12/2025; không dùng bản chưa sửa'),
 '216439':('TT 140/2025/TT-BTC','T6/T10','2025-12-30','2026-02-14','Điều 11.4 chuyển tiếp; thay TT 102/2012 từ hiệu lực'),
 '215774':('TT 100/2025/TT-BTC','T10','2025-10-28','2025-10-28','Kinh phí đào tạo/bồi dưỡng, kiểm đối tượng/nguồn'),
 '217673':('NĐ 125/2026/NĐ-CP','T1/T3/T4','2026-04-06','2026-04-06','Hoạt động KHCN trong cơ sở GDĐH'),
 '211832':('TT 15/2024/TT-BGDĐT','T1/T3/T4','2024-11-20','2025-01-05','Đề tài cấp Bộ; không thay nguồn cấp Đại học'),
 '214603':('Luật 93/2025/QH15','T1/T3/T4/T6','2025-06-27','2025-10-01','Đọc điều khoản chuyển tiếp, không mặc định mọi khoản cùng mốc'),
 '207323':('TT 03/2023/TT-BTC','T1/T3/T6','2023-01-10','2023-02-26','Nhánh nguồn/chuyển tiếp; chưa kết luận áp dụng chung 2026'),
 '211150':('TT 65/2024/TT-BTC','T1/T3/T6','2024-09-05','2024-10-25','Sửa khoản 1 điều 2 TT 03/2023'),
 '218393':('TT 44/2026/TT-BGDĐT','T1/T3/T4','2026-06-09','2026-07-25','Nhánh chương trình KHCN; đọc chuyển tiếp'),
 '203662':('TT 54/2021/TT-BTC','T6 có điều kiện','2021-07-06','2021-08-25','Sửa khoản 4 điều 35 TT 71/2018; nhánh tổ chức/tiếp khách'),
}
files=[]; failures=[]; canonical={}
for r in records:
    if r.get('error'):failures.append({'url':r['url'],'error':r['error']})
    if not r.get('path','').startswith('originals/'):continue
    path=ROOT/r['path']; data=path.read_bytes()
    if hashlib.sha256(data).hexdigest()!=r['sha256']:raise ValueError('Hash mismatch '+r['path'])
    if path.suffix=='.pdf':PdfReader(path)
    elif path.suffix=='.docx':
        with zipfile.ZipFile(path) as z:
            if 'word/document.xml' not in z.namelist():raise ValueError('Invalid DOCX')
    parent=by_url.get(r.get('parent_url'),{})
    title=r.get('attachment_label') or labels.get(r['url']) or parent.get('title') or Path(r['url']).name
    group='Thông báo/biểu mẫu nhánh cấp Bộ và chương trình';cards='T1; T3/T4 nếu đúng loại nhiệm vụ'
    number=issued=effective=None;note='Chưa xác minh điều kiện áp dụng, quyền dùng và phiên bản hiện hành'
    for docid,values in national.items():
        if 'docid='+docid in (r.get('parent_url') or ''):
            number,cards,issued,effective,note=values;title=number+' — '+(parent.get('title') or '')
            group='Nguồn Nhà nước phụ thuộc';break
    if 'odv5o4ymtvtv5jf' in r['url']:
        title='TT 12/2025/TT-BTC — sửa đổi công tác phí, hội nghị';number='12/2025/TT-BTC';issued='2025-03-19';effective='2025-05-04';cards='T6';group='Nguồn Nhà nước phụ thuộc';note=r['quality_note']
    if path.stem=='8af731c80794b0':
        title='TT 71/2018/TT-BTC — hội nghị quốc tế/tiếp khách';number='71/2018/TT-BTC';cards='T6 có điều kiện';group='Nguồn Nhà nước phụ thuộc';note='Trang đăng lại VKIST ghi mốc hiệu lực khác Công báo (10/08 so với 01/11/2018); cần kiểm bản gốc trước sử dụng';issued='2018-08-10';effective=None
    if path.stem in ['e1a0fa9c5796e5','f01249ac2cfd3a','b2c433f8dc3247']:
        group='HUST: bằng chứng dẫn chiếu số hiệu';cards='Nguồn chung';note='Chỉ dùng trang 1 đối chiếu số hiệu; không thay bản gốc các quy chế được dẫn'
        title={'e1a0fa9c5796e5':'QĐ 2102/2026 về học bổng NCS — bằng chứng dẫn chiếu 1616', 'f01249ac2cfd3a':'QĐ 3040/2026 về Ban biên tập — bằng chứng dẫn chiếu 1606/1616', 'b2c433f8dc3247':'QĐ 658/2026 công khai ngân sách — bằng chứng dẫn chiếu NQ 04/40'}[path.stem]
    dup=canonical.get(r['sha256']);canonical.setdefault(r['sha256'],r['path'])
    ocr=ocr_by_path.get(r['path'])
    item={'id':path.stem,'title':title,'group':group,'cards':cards,'document_number':number,'issued_date':issued,'declared_effective_from':effective,'effective_to':None,'date_evidence':'Official landing page' if effective else None,'current_applicability':'not_fully_verified','source_status':'unverified_original','owner_confirmation':None,'publication_permission':'not_assessed','url':r['url'],'landing_url':r.get('parent_url'),'retrieved_at':r['retrieved_at'],'path':r['path'],'sha256':r['sha256'],'bytes':r['bytes'],'pages':r.get('pages'),'duplicate_of':dup,'text_path':r.get('text_path'),'ocr_path':ocr.get('ocr_path') if ocr else None,'ocr_status':'unreviewed_derivative' if ocr else None,'note':note}
    files.append(item)
(ROOT/'metadata/catalog.json').write_text(json.dumps(files,ensure_ascii=False,indent=2))
keys=['id','title','group','cards','document_number','issued_date','declared_effective_from','current_applicability','source_status','publication_permission','landing_url','url','retrieved_at','path','pages','bytes','sha256','duplicate_of','text_path','ocr_path','note']
with (ROOT/'DANH_MUC_TEP.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.DictWriter(f,fieldnames=keys,extrasaction='ignore');w.writeheader();w.writerows(files)
stats={'generated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'downloaded_file_records':len(files),'distinct_file_hashes':len(canonical),'pdf_downloads':sum(x['path'].endswith('.pdf') for x in files),'docx_downloads':sum(x['path'].endswith('.docx') for x in files),'archive_downloads':sum(x['path'].endswith('.rar') for x in files),'page_or_index_records':sum(x.get('path','').startswith('pages/') for x in records),'failed_download_records':len(failures),'ocr_documents':len(ocrs),'ocr_pages':sum(x['pages'] for x in ocrs),'hust_core_regulations_2026_obtained':0,'collection_complete':False,'reason':'H01/H03/H04 and other required HUST sources in coverage matrix remain missing'}
(ROOT/'metadata/stats.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2))
(ROOT/'metadata/failures.json').write_text(json.dumps(failures,ensure_ascii=False,indent=2))
lines=['# Danh mục tệp đã tải','',f"Cập nhật {stats['generated_at']}. {len(files)} lượt tải tệp, {len(canonical)} nội dung khác nhau theo SHA-256. Đây **không phải** số quy chế HUST đã đủ.",'','Bản gốc ở `originals/`; bản trích và OCR là dữ liệu tìm kiếm chưa soát toàn văn. Mốc hiệu lực ở bảng chỉ là mốc được nguồn công bố, chưa chứng minh văn bản đủ áp dụng cho một tình huống HUST. Xem ma trận nguồn còn thiếu trước khi dùng.','']
for group in sorted({f['group'] for f in files}):
    lines+=['## '+group,'','| Tài liệu | Thẻ | Tệp và bản chữ | Phạm vi/kiểm chứng |','|---|---|---|---|']
    for f in files:
        if f['group']!=group:continue
        links=f"[Tệp]({f['path']}) · [Nguồn]({f['landing_url'] or f['url']})"
        if f['ocr_path']:links+=f" · [OCR]({f['ocr_path']})"
        elif f['text_path']:links+=f" · [Trích]({f['text_path']})"
        note=f['note']+(f"; bản trùng {f['duplicate_of']}" if f['duplicate_of'] else '')
        lines.append(f"| {f['title'].replace('|','/')} | {f['cards']} | {links} | {note} |")
(ROOT/'DANH_MUC_TEP.md').write_text('\n'.join(lines)+'\n')
rows=''.join('<tr><td>'+html.escape(f['group'])+'</td><td>'+html.escape(f['title'])+'</td><td>'+html.escape(f['cards'])+'</td><td><a href="'+html.escape(f['path'])+'">Mở tệp</a> · <a href="'+html.escape(f['landing_url'] or f['url'])+'">Nguồn</a></td><td>'+html.escape(f['note'])+'</td></tr>' for f in files)
page='''<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Kho nguồn HUST</title><style>body{font:16px/1.6 system-ui;max-width:1500px;margin:40px auto;padding:0 24px;color:#252c28}h1{color:#92283d}input{font:inherit;padding:12px;width:90%;max-width:700px}table{border-collapse:collapse;width:100%;margin-top:24px}td,th{padding:12px;text-align:left;border-bottom:1px solid #ddd;vertical-align:top}a{color:#8b253a}.notice{background:#f6f1e8;padding:18px}th{background:#eaf0e8}</style><h1>Kho nguồn tư vấn HUST</h1><p class="notice">Chưa đủ bộ quy chế gốc HUST năm 2026. Các tệp dưới đây là kết quả thu thập, cần kiểm chứng phạm vi/phiên bản trước khi dùng cho chatbot. Kho này chỉ nằm trên máy, chưa đưa lên website demo.</p><p><a href="MA_TRAN_NGUON_CAN_CO.md">Ma trận nguồn còn thiếu</a> · <a href="DANH_MUC_TEP.csv">Danh mục CSV</a> · <a href="PHAM_VI_VA_NGUYEN_TAC.md">Phạm vi và nguyên tắc</a></p><input id="q" type="search" placeholder="Lọc theo tên, số hiệu, T1/T3/T4/T6/T10…" aria-label="Lọc tài liệu"><table><thead><tr><th>Nhóm</th><th>Tài liệu</th><th>Thẻ</th><th>Mở</th><th>Ghi chú</th></tr></thead><tbody>'''+rows+'''</tbody></table><script>document.querySelector('#q').addEventListener('input',e=>{let q=e.target.value.toLocaleLowerCase('vi');document.querySelectorAll('tbody tr').forEach(r=>r.hidden=!r.textContent.toLocaleLowerCase('vi').includes(q))})</script></html>'''
page=page.replace('<p><a href="MA_TRAN_NGUON_CAN_CO.md">', '<p><a href="DANH_MUC_BO_SUNG.md">Danh mục bổ sung 10 nhóm</a> · <a href="BO_CA_THOI_GIAN.md">Ca thời gian</a> · <a href="HUONG_DAN_CAP_NHAT_NGUON.md">Cập nhật và chốt kho</a> · <a href="MA_TRAN_NGUON_CAN_CO.md">')
(ROOT/'index.html').write_text(page)
print(json.dumps(stats,ensure_ascii=False,indent=2))
