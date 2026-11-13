"""OCR derivatives only; never rewrites original PDF files."""
import json, subprocess, tempfile, concurrent.futures, os, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'text_ocr';OUT.mkdir(exist_ok=True)
records=json.loads((ROOT/'metadata/downloads.json').read_text())
chosen=[r for r in records if r.get('path','').endswith('.pdf') and any(x in r['url'] for x in ['datafiles.chinhphu.vn','maa.gov.vn/uploads/document/odv5o4','vkist.mst.gov.vn/vkist-media/'])]
if len(sys.argv)>1:chosen=[r for r in chosen if Path(r['path']).stem in sys.argv[1:]]
env=dict(os.environ,OMP_THREAD_LIMIT='1')

def run_page(args):
    file,page=args; key=file.stem
    target=OUT/f'{key}-p{page:03d}.txt'
    if target.exists():return str(target)
    with tempfile.TemporaryDirectory(prefix='hust-ocr-') as tmp:
        prefix=Path(tmp)/'page'
        subprocess.run(['pdftoppm','-f',str(page),'-l',str(page),'-scale-to', '2400','-singlefile','-png',str(file),str(prefix)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
        r=subprocess.run(['tesseract',str(prefix)+'.png','stdout',*(['--tessdata-dir',os.environ['HUST_TESSDATA_DIR']] if os.environ.get('HUST_TESSDATA_DIR') else []),'-l','vie','--psm','3'],check=True,capture_output=True,text=True,env=env)
        target.write_text(r.stdout)
    return str(target)

jobs=[(ROOT/r['path'],i) for r in chosen for i in range(1,r['pages']+1)]
print('OCR pages',len(jobs),'documents',len(chosen),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for n,result in enumerate(pool.map(run_page,jobs),1):
        if n%10==0:print('Completed',n,'/',len(jobs),flush=True)
results=json.loads((ROOT/'metadata/ocr-results.json').read_text()) if (ROOT/'metadata/ocr-results.json').exists() else []
for r in chosen:
    key=Path(r['path']).stem; path=OUT/f'{key}.txt'
    pages=[OUT/f'{key}-p{i:03d}.txt' for i in range(1,r['pages']+1)]
    path.write_text('\n\n'.join(f'--- PDF PAGE {i+1} / OCR, MUST CHECK ORIGINAL ---\n'+p.read_text() for i,p in enumerate(pages)))
    results=[x for x in results if x['original_path']!=r['path']]
    results.append({'original_path':r['path'],'original_sha256':r['sha256'],'pages':len(pages),'ocr_path':str(path.relative_to(ROOT)),'method':'tesseract vie, --psm 3, scale-to 2400px','verification':'unreviewed_ocr_not_authoritative_quote'})
(ROOT/'metadata/ocr-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print('OCR finished',len(results),flush=True)
