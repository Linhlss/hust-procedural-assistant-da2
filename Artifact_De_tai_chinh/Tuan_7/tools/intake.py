#!/usr/bin/env python3
"""Receive explicitly supplied documents. No network, OCR, inference or automatic approval."""
from pathlib import Path
from datetime import date, datetime, timezone
import argparse, hashlib, json, shutil, sys, tempfile

ALLOWED={'.pdf','.docx','.xlsx','.doc','.xls','.txt','.md','.csv','.zip','.rar','.png','.jpg','.jpeg'}
SCOPES={'T1','T3','T4','T6','T10'}

def digest(path):
    h=hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda:stream.read(1024*1024),b''): h.update(block)
    return h.hexdigest()

def load_register(root):
    p=root/'register.json'
    return json.loads(p.read_text()) if p.exists() else {'schemaVersion':1,'sources':[]}

def atomic_json(path,data):
    with tempfile.NamedTemporaryFile('w',encoding='utf-8',dir=path.parent,delete=False) as out:
        json.dump(data,out,ensure_ascii=False,indent=2);out.write('\n');temporary=Path(out.name)
    temporary.replace(path)

def _receive_unlocked(root,files,origin,kind='unclassified',scopes=(),requests=(),apply=False):
    if not origin.strip(): raise ValueError('Cần ghi xuất xứ được cung cấp')
    if not set(scopes)<=SCOPES: raise ValueError('Sai phạm vi thủ tục')
    if not set(requests)<={'D'+str(i).zfill(2) for i in range(1,16)}|{'FAQ'}: raise ValueError('Sai mã yêu cầu trong hai PDF')
    records=load_register(root);by_hash={r['sha256']:r for r in records['sources']}
    planned=[];now=datetime.now(timezone.utc).isoformat()
    for value in files:
        p=Path(value).resolve()
        if not p.is_file() or p.suffix.lower() not in ALLOWED: raise ValueError('Không phải tệp tài liệu được hỗ trợ: '+p.name)
        sha=digest(p);existing=by_hash.get(sha)
        if existing:
            existing['receipts'].append({'originalName':p.name,'origin':origin,'receivedAt':now})
            existing['scopes']=sorted(set(existing['scopes'])|set(scopes))
            existing['requestIds']=sorted(set(existing['requestIds'])|set(requests))
        else:
            name=sha[:16]+'__'+p.name
            existing={'id':'SRC-'+sha[:16],'sha256':sha,'originalPath':'originals/'+name,'bytes':p.stat().st_size,
                'kind':kind,'scopes':sorted(set(scopes)),'requestIds':sorted(set(requests)),
                'receipts':[{'originalName':p.name,'origin':origin,'receivedAt':now}],
                'sourceStatus':'unverified_original','issuedDate':None,'effectiveFrom':None,'effectiveTo':None,
                'replaces':[],'transitionEvidence':None,'contentOwnerConfirmation':None,
                'permissions':{k:{'state':'unknown','evidence':None} for k in ['research','quotation','model','public']},
                'reviewNotes':[]}
            records['sources'].append(existing);by_hash[sha]=existing
        planned.append({'file':p,'record':existing})
    if not apply:
        return {'applied':False,'files':len(planned),'uniqueSourcesAfterReceive':len(records['sources']),'sourceIds':[p['record']['id'] for p in planned]}
    root.mkdir(parents=True,exist_ok=True)
    created=[]
    try:
        for entry in planned:
            record=entry['record'];target=(root/record['originalPath']).resolve()
            if not target.is_relative_to(root.resolve()):raise ValueError('Đường dẫn ra ngoài kho nhận')
            target.parent.mkdir(parents=True,exist_ok=True)
            if target.exists():
                if digest(target)!=record['sha256']: raise ValueError('Bản lưu gốc đã đổi: '+target.name)
            else:
                shutil.copyfile(entry['file'],target);created.append(target)
            if digest(target)!=record['sha256']: raise ValueError('Sai mã băm bản sao')
        atomic_json(root/'register.json',records)
    except BaseException:
        for p in created:p.unlink(missing_ok=True)
        raise
    return {'applied':True,'files':len(planned),'uniqueSources':len(records['sources']),'sourceIds':[p['record']['id'] for p in planned]}

def receive(root,files,origin,kind='unclassified',scopes=(),requests=(),apply=False):
    if not apply:return _receive_unlocked(root,files,origin,kind,scopes,requests,False)
    root.mkdir(parents=True,exist_ok=True)
    lock=root/'.receive.lock'
    with lock.open('x') as stream:stream.write('intake')
    try:return _receive_unlocked(root,files,origin,kind,scopes,requests,True)
    finally:lock.unlink(missing_ok=True)

def check(root):
    register=load_register(root);issues=[];ids=set();hashes=set()
    for r in register['sources']:
        if r['id'] in ids or r['sha256'] in hashes:issues.append('Trùng mã/nội dung trong sổ: '+r['id'])
        ids.add(r['id']);hashes.add(r['sha256'])
        p=(root/r['originalPath']).resolve()
        if not p.is_relative_to(root.resolve()):issues.append('Đường dẫn ra ngoài kho nhận: '+r['id']);continue
        if not p.is_file() or digest(p)!=r['sha256']:issues.append('Thiếu hoặc sai bản gốc: '+r['id'])
        for field in ['issuedDate','effectiveFrom','effectiveTo']:
            if r.get(field) is not None:
                try:date.fromisoformat(r[field])
                except (TypeError,ValueError):issues.append('Ngày không hợp lệ: '+r['id']+'/'+field)
        if r.get('effectiveFrom') and r.get('effectiveTo') and r['effectiveFrom']>r['effectiveTo']:issues.append('Khoảng hiệu lực bị đảo: '+r['id'])
        for use,v in r['permissions'].items():
            if v['state'] not in {'unknown','allowed','denied'}:issues.append('Trạng thái quyền không hợp lệ: '+r['id']+'/'+use)
            if v['state']!='unknown' and not v['evidence']:issues.append('Quyền thiếu bằng chứng: '+r['id']+'/'+use)
    return {'sourceCount':len(register['sources']),'valid':not issues,'issues':issues,'businessValidationComplete':False}

def check_faq(path):
    value=json.loads(Path(path).read_text());issues=[];groups={};ids=set()
    for r in value['records']:
        if r['id'] in ids:issues.append('Trùng mã FAQ: '+r['id'])
        ids.add(r['id'])
        if not r.get('question','').strip():issues.append('Thiếu câu hỏi: '+r['id'])
        if r.get('card') not in SCOPES|{'out_of_scope','unclassified'}:issues.append('Sai phạm vi: '+r['id'])
        if r.get('origin') not in {'real','expert_constructed','synthetic','unknown'}:issues.append('Thiếu phân biệt nguồn câu hỏi: '+r['id'])
        split=r.get('split','unassigned')
        if split not in {'unassigned','development','heldout'}:issues.append('Sai split: '+r['id'])
        group=r.get('caseGroup')
        if not group:issues.append('Thiếu nhóm tình huống gốc: '+r['id'])
        else:groups.setdefault(group,set()).add(split)
        if r.get('answerStatus')=='confirmed' and (not r.get('answer') or not r.get('confirmationEvidence')):issues.append('Đáp án xác nhận thiếu bằng chứng: '+r['id'])
        if r.get('frequency','unknown')!='unknown' and not r.get('frequencyEvidence'):issues.append('Tần suất thiếu căn cứ/nhận xét: '+r['id'])
    for group,splits in groups.items():
        if 'development' in splits and 'heldout' in splits:issues.append('Lẫn tình huống gốc giữa phát triển và đánh giá: '+group)
    return {'valid':not issues,'records':len(value['records']),'issues':issues,'modelCalls':0}

def main():
    p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]/'received')
    sub=p.add_subparsers(dest='command',required=True)
    r=sub.add_parser('receive');r.add_argument('files',nargs='+');r.add_argument('--origin',required=True);r.add_argument('--kind',choices=['unclassified','document','guide','form','faq','explanation'],default='unclassified')
    r.add_argument('--scope',action='append',default=[]);r.add_argument('--request',action='append',default=[]);r.add_argument('--apply',action='store_true',help='Không có cờ này thì chỉ xem trước')
    sub.add_parser('check');f=sub.add_parser('faq-check');f.add_argument('file')
    a=p.parse_args()
    try:
        result=receive(a.root,a.files,a.origin,a.kind,a.scope,a.request,a.apply) if a.command=='receive' else check_faq(a.file) if a.command=='faq-check' else check(a.root)
        print(json.dumps(result,ensure_ascii=False,indent=2))
        if result.get('valid') is False:sys.exit(2)
    except (ValueError,KeyError,OSError) as error:
        print(json.dumps({'valid':False,'error':str(error)},ensure_ascii=False));sys.exit(2)
if __name__=='__main__':main()
