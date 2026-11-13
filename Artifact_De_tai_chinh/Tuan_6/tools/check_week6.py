"""Read-only audit of the week-6 request and candidate-source handoff.

This validates provenance and pending states; it never certifies policy answers.
"""
from __future__ import annotations

import csv
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote,urlparse

WEEK = Path(__file__).resolve().parents[1]
ROOT = WEEK.parents[1]
CORPUS = ROOT / 'Artifact_tham_khao/Quy_dinh_HUST_2026'


def read(path):
    return json.loads(path.read_text())


def audit():
    errors = []

    def check(value, message):
        if not value:
            errors.append(message)

    requests = read(WEEK / 'request-register.json')
    ledger = read(WEEK / 't6-condition-register.json')
    plan = read(CORPUS / 'metadata/coverage-plan.json')
    register = {item['id']: item for item in read(CORPUS / 'metadata/source-register.json')['sources']}
    temporal = {item['id']: item for item in read(CORPUS / 'metadata/temporal-cases.json')['cases']}
    request_ids = {item['id'] for item in requests['requests']}
    condition_ids = {item['id'] for item in ledger['conditions']}
    pointer_ids = {item['id'] for item in ledger['evidence_pointers']}
    check(requests['initial_review_as_of'] == ledger['initial_review_as_of'] == plan['scope']['initial_review_as_of'] == '2026-11-07', 'Mốc rà soát không thống nhất')
    check(requests['final_collection_frozen_at'] is None and ledger['final_collection_frozen_at'] is None, 'Không được đồng nhất mốc rà soát với ngày chốt kho cuối')
    check(requests['student_cohort_default_filter'] is False, 'Không được dùng khóa sinh viên làm bộ lọc mặc định')
    check(len(request_ids) == len(requests['requests']), 'Trùng mã yêu cầu')
    check(len(condition_ids) == len(ledger['conditions']), 'Trùng mã điều kiện')
    refs = {ref for item in requests['requests'] for ref in item['coverage_refs']}
    expected_refs = {item['id'] for group in plan['groups'] for item in group['requirements']}
    check(expected_refs <= refs, 'Phiếu chưa dẫn hết các mục bổ sung: ' + ', '.join(sorted(expected_refs - refs)))
    check({'H01', 'H03', 'H04'} <= refs, 'Thiếu ba bộ gốc nền tảng trong phiếu')
    for item in requests['requests']:
        check(set(item['cards']) <= {'T1','T3','T4','T6','T10'}, f"{item['id']}: mã thủ tục không hợp lệ")
        check(bool(item['requested_period'] and item['owner_role'] and item['already_available'] and item['needed']), f"{item['id']}: thiếu mốc, đầu mối hoặc phần đã có/còn thiếu")
        check(item['status'] == 'draft_not_sent' and item['sent_at'] is None and not item['received_source_ids'], f"{item['id']}: cần cập nhật sổ nguồn/tiếp nhận trước khi đổi trạng thái phiếu")
    with (WEEK / 'DANH_MUC_XIN_DU_LIEU.csv').open(encoding='utf-8-sig', newline='') as stream:
        csv_rows = list(csv.DictReader(stream))
    check([item['Mã'] for item in csv_rows] == [item['id'] for item in requests['requests']], 'CSV không khớp thứ tự/mã sổ yêu cầu')
    for source in ledger['available_originals']:
        original = register.get(source['id'])
        check(bool(original and original['sha256'] == source['sha256']), f"{source['id']}: không khớp sổ nguồn")
        for relative in source['paths']:
            path = CORPUS / relative
            check(path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() == source['sha256'], f"{source['id']}: sai/thiếu bản tải")
        check(source['verified_effective_from'] is None and source['source_status'] == 'unverified_original', f"{source['id']}: chưa có quy trình xác nhận để nâng trạng thái trong sổ tuần 6")
    for pointer in ledger['evidence_pointers']:
        path = CORPUS / pointer['ocr_path_from_corpus']
        text = path.read_text()
        check(hashlib.sha256(path.read_bytes()).hexdigest() == pointer['ocr_sha256'], f"{pointer['id']}: OCR đã đổi")
        check(pointer['source_id'] in register, f"{pointer['id']}: nguồn không tồn tại")
        check(pointer['ocr_excerpt'] in text, f"{pointer['id']}: đoạn OCR không tồn tại")
        offset = text.find(pointer['heading'])
        markers = list(re.finditer(r'--- PDF PAGE (\d+)', text[:offset]))
        check(bool(markers and int(markers[-1].group(1)) == pointer['pdf_page']), f"{pointer['id']}: sai trang PDF ứng viên")
        check(pointer['reviewed_quote'] is None and pointer['verification'] == 'ocr_candidate_not_checked_against_original', f"{pointer['id']}: chưa có bằng chứng kiểm ảnh gốc")
    for item in ledger['conditions']:
        check(set(item['evidence_pointer_ids']) <= pointer_ids and set(item['request_ids']) <= request_ids, f"{item['id']}: liên kết nguồn/yêu cầu không tồn tại")
        check(item['status'] == 'candidate_pending_original_and_review' and item['rule_expression'] is None and item['verified_policy_answer'] is None and item['owner_confirmation'] is None and not item['runtime_enabled'], f"{item['id']}: không được biến ứng viên thành điều kiện đã duyệt")
    expected_cases = {cid for cid, item in temporal.items() if item['card'] == 'T6'}
    check({item['id'] for item in ledger['temporal_cases']} == expected_cases, 'Không khớp các ca T6 trong bộ thời gian gốc')
    for item in ledger['temporal_cases']:
        original = temporal.get(item['id'], {})
        check(original.get('prompt') == item['prompt'] and original.get('expected_behavior') == item['expected_behavior'], f"{item['id']}: thay nội dung ca gốc")
        check(set(item['condition_ids']) <= condition_ids, f"{item['id']}: điều kiện không tồn tại")
        check(item['expected_policy_answer'] is None and item['owner_confirmation'] is None and item['business_execution_status'] == 'not_run', f"{item['id']}: chưa có căn cứ để báo đạt nghiệp vụ")
    check(not ledger['business_validation_complete'] and not ledger['runtime_policy_modified'], 'Không được báo đã hoàn thành nghiệp vụ hoặc đã thay nguồn mẫu')
    links = 0
    for path in WEEK.glob('*.md'):
        for match in re.finditer(r'\[[^\]]+\]\((?:<([^>]+)>|([^\)]+))\)', path.read_text()):
            target = match.group(1) or match.group(2)
            parsed = urlparse(target)
            if parsed.scheme or target.startswith('#'):
                continue
            links += 1
            check((path.parent / unquote(parsed.path)).exists(), f'{path.name}: liên kết hỏng {target}')
    return {'structurally_valid': not errors, 'errors': errors, 'requests': len(request_ids),
            'candidate_conditions': len(condition_ids), 'ocr_candidate_pointers': len(pointer_ids),
            't6_cases_prepared': len(expected_cases), 'verified_business_answers': 0,
            'business_cases_executed': 0, 'markdown_links_checked': links,
            'initial_review_as_of': requests['initial_review_as_of']}


if __name__ == '__main__':
    result = audit()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result['structurally_valid'] else 1)
