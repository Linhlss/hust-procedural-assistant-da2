"""Public-source collection. Never logs into HUST or publishes collected files."""
import sys, json, hashlib, datetime, urllib.request, urllib.parse, re, time
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'metadata' / 'downloads.json'

def fetch(url, parent=None):
    import fcntl
    with (ROOT/'metadata'/'collection.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        return _fetch(url,parent)

def _fetch(url, parent=None):
    records = json.loads(INDEX.read_text()) if INDEX.exists() else []
    cached = next((r for r in records if r['url']==url and r.get('path')), None)
    if cached:
        return cached
    record = {'url':url,'parent_url':parent,'retrieved_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        req=urllib.request.Request(url, headers={'User-Agent':'HUST-Research-Source-Survey/1.0 (academic local collection)'})
        with urllib.request.urlopen(req,timeout=35) as response:
            data=response.read(40*1024*1024+1)
            if len(data)>40*1024*1024: raise ValueError('File exceeds 40MB collection limit')
            record.update(status=response.status,final_url=response.url,content_type=response.headers.get('Content-Type',''),content_disposition=response.headers.get('Content-Disposition'))
        key=hashlib.sha256(url.encode()).hexdigest()[:14]
        ispdf=data.startswith(b'%PDF')
        ext='.pdf' if ispdf else Path(urllib.parse.unquote(urllib.parse.urlparse(record['final_url']).path)).suffix.lower()
        if data.startswith(b'PK\x03\x04'):
            import zipfile,io
            with zipfile.ZipFile(io.BytesIO(data)) as z:
                names=z.namelist()
                ext='.docx' if 'word/document.xml' in names else '.xlsx' if 'xl/workbook.xml' in names else '.zip'
        elif data.startswith(b'Rar!'):ext='.rar'
        elif data.startswith(bytes.fromhex('d0cf11e0a1b11ae1')):ext='.doc'
        if ext not in ['.pdf','.docx','.doc','.xlsx','.xls','.zip','.rar']: ext='.html'
        folder='pages' if ext=='.html' else 'originals'
        file=ROOT/folder/(key+ext); file.write_bytes(data)
        record.update(path=str(file.relative_to(ROOT)),sha256=hashlib.sha256(data).hexdigest(),bytes=len(data),source_status='unverified_original',publication_permission='not_assessed',effective_from=None,effective_to=None,owner_confirmation=None)
        if ext=='.html':
            soup=BeautifulSoup(data,'xml' if 'xml' in record['content_type'] else 'html.parser')
            record['title']=soup.title.get_text(' ',strip=True) if soup.title else None
            record['links']=[{'label':a.get_text(' ',strip=True),'url':urllib.parse.urljoin(record['final_url'],a['href'])} for a in soup.select('a[href]')]
            for s in soup(['script','style','nav','header','footer']):s.decompose()
            text=soup.get_text('\n',strip=True)
        elif ext=='.pdf':
            from pypdf import PdfReader
            pdf=PdfReader(file); record['pages']=len(pdf.pages)
            text='\n\n'.join(f'--- PDF PAGE {i+1} ---\n'+(p.extract_text() or '') for i,p in enumerate(pdf.pages))
            record['text_characters']=len(text)
        elif ext=='.docx':
            import zipfile,xml.etree.ElementTree as ET
            with zipfile.ZipFile(file) as z: root=ET.fromstring(z.read('word/document.xml'))
            text='\n'.join(''.join(p.itertext()) for p in root.findall('.//{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'))
        else: text=''
        if text:
            (ROOT/'text'/(key+'.txt')).write_text(text)
            record['text_path']='text/'+key+'.txt'
    except Exception as e:record['error']=str(e)
    records=[r for r in records if r['url']!=url]+[record]
    INDEX.write_text(json.dumps(records,ensure_ascii=False,indent=2))
    return record

if __name__=='__main__':
    for url in sys.argv[1:]:
        r=fetch(url)
        print(json.dumps({k:v for k,v in r.items() if k!='links'},ensure_ascii=False))
        if 'links' in r:
            for link in r['links']:
                if re.search(r'quy.ch|quy.định|văn.bản|tài.nguyên|khcn|tckt|tccb|tcns|tài.chính|nhân.sự|\.pdf|\.doc|download|sitemap',link['label']+' '+link['url'],re.I):print(json.dumps(link,ensure_ascii=False))
        time.sleep(.6)
