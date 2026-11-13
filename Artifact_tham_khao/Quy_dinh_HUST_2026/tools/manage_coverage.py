"""Validate the local collection plan; never equate file counts with coverage.

Run without flags to refresh human-readable tracking files and audit JSON.
--check performs a read-only validation. --require-complete exits 2 for an
otherwise valid collection whose source/content/release work is still open.
"""
import argparse
import csv
import datetime as dt
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CARDS = {"T1", "T3", "T4", "T6", "T10"}


def read(name):
    return json.loads((ROOT / "metadata" / name).read_text())


def confirmed(value):
    return isinstance(value, dict) and all(value.get(k) for k in ("who", "when", "evidence"))


def sync_sources():
    """Append downloaded content without overwriting previous review decisions."""
    register = read("source-register.json")
    by_hash = {s["sha256"]: s for s in register["sources"]}
    for row in read("catalog.json"):
        if row["sha256"] not in by_hash:
            source = {"id": "SRC-" + row["sha256"][:16], "sha256": row["sha256"],
                      "title": row["title"], "catalog_ids": [], "paths": [], "urls": [],
                      "declared_document_number": row.get("document_number"),
                      "declared_issued_date": row.get("issued_date"),
                      "declared_effective_from": row.get("declared_effective_from"),
                      "declared_date_evidence": row.get("date_evidence"),
                      "verified_issued_date": None, "verified_effective_from": None,
                      "verified_effective_to": None, "temporal_evidence": [], "amends": [],
                      "replaces": [], "transitional_rules": [], "issuer_confirmation": None,
                      "applicability": {"task_types": [], "unit_ids": [], "subjects": [], "verification": "not_verified"},
                      "source_status": "unverified_original", "content_owner_confirmation": None,
                      "publication_permission": "not_assessed", "publication_permission_evidence": None,
                      "notes": [row["note"]]}
            register["sources"].append(source)
            by_hash[row["sha256"]] = source
        source = by_hash[row["sha256"]]
        for key, value in (("catalog_ids", row["id"]), ("paths", row["path"]), ("urls", row["url"])):
            if value not in source[key]:
                source[key].append(value)
    (ROOT / "metadata/source-register.json").write_text(json.dumps(register, ensure_ascii=False, indent=2) + "\n")


def audit(plan, register, cases, review, downloads):
    errors, pending = [], []
    sources = register["sources"]
    source_by_id = {s["id"]: s for s in sources}
    if len(source_by_id) != len(sources):
        errors.append("Trùng định danh nguồn")
    hashes = [s["sha256"] for s in sources]
    if len(set(hashes)) != len(hashes):
        errors.append("Bản trùng nội dung chưa gộp trong sổ nguồn")
    catalog = read("catalog.json")
    if set(hashes) != {x["sha256"] for x in catalog}:
        errors.append("Sổ nguồn chưa khớp toàn bộ nội dung trong danh mục đã tải")
    catalog_by_id = {x["id"]: x for x in catalog}
    for s in sources:
        for cid in s["catalog_ids"]:
            if cid not in catalog_by_id or catalog_by_id[cid]["sha256"] != s["sha256"]:
                errors.append(f"{s['id']}: tham chiếu danh mục không khớp")
        for field in ("verified_issued_date", "verified_effective_from", "verified_effective_to"):
            if s.get(field):
                try:
                    dt.date.fromisoformat(s[field])
                except (TypeError, ValueError):
                    errors.append(f"{s['id']}: ngày không hợp lệ ở {field}")
        start, end = s.get("verified_effective_from"), s.get("verified_effective_to")
        if start and end and start > end:
            errors.append(f"{s['id']}: khoảng hiệu lực ngược")
        if s["source_status"] not in {"unverified_original", "verified_original"}:
            errors.append(f"{s['id']}: trạng thái nguồn không hợp lệ")
        if s["source_status"] == "verified_original":
            if not (confirmed(s.get("content_owner_confirmation")) and s.get("temporal_evidence")
                    and s.get("issuer_confirmation") and s["applicability"]["verification"] == "verified"):
                errors.append(f"{s['id']}: gắn đã xác minh nhưng thiếu căn cứ/chủ nội dung/phạm vi")
        if s["publication_permission"] not in {"not_assessed", "research_only", "internal_only", "public_excerpt", "public_full", "denied"}:
            errors.append(f"{s['id']}: trạng thái quyền dùng không hợp lệ")
        if s["publication_permission"] != "not_assessed" and not s.get("publication_permission_evidence"):
            errors.append(f"{s['id']}: quyền dùng chưa có bằng chứng")
    file_count = 0
    for r in downloads:
        if not r.get("path"):
            continue
        p = ROOT / r["path"]
        if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest() != r["sha256"]:
            errors.append(f"Sai/thiếu tệp tải: {r['path']}")
        file_count += 1

    used_sources = set()

    def check_evidence(evidence, context, require_verified=True):
        if not evidence:
            errors.append(f"{context}: thiếu bằng chứng điều/trang")
        for e in evidence:
            source = source_by_id.get(e.get("source_id")) if isinstance(e, dict) else None
            if not source:
                errors.append(f"{context}: nguồn bằng chứng không tồn tại")
            elif require_verified and source["source_status"] != "verified_original":
                errors.append(f"{context}: dùng nguồn chưa xác minh để đóng nội dung")
            if source:
                used_sources.add(source["id"])
            if not isinstance(e, dict) or not e.get("locator") or not e.get("claim"):
                errors.append(f"{context}: thiếu vị trí/ý được nguồn hỗ trợ")

    if set(plan["scope"]["cards"]) != CARDS:
        errors.append("Phạm vi thẻ khác năm nhóm đã chốt")
    if not confirmed(plan["scope"].get("unit_scope_confirmation")):
        pending.append("Danh mục đơn vị áp dụng chưa được chủ nội dung xác nhận")
    requirements = [r for g in plan["groups"] for r in g["requirements"]]
    req_ids = [r["id"] for r in requirements]
    if len(req_ids) != len(set(req_ids)) or len({g["id"] for g in plan["groups"]}) != 10:
        errors.append("Nhóm/yêu cầu trùng hoặc thiếu trong danh mục 10 nhóm")
    for g in plan["groups"]:
        if not set(g["cards"]).issubset(CARDS):
            errors.append(f"{g['id']}: thẻ ngoài phạm vi")
        for r in g["requirements"]:
            status = r["status"]
            if status not in {"open", "covered", "not_applicable_confirmed"}:
                errors.append(f"{r['id']}: trạng thái không hợp lệ")
            if status == "open":
                pending.append(r["id"] + ": " + r["title"])
            elif not confirmed(r["owner_confirmation"]):
                errors.append(f"{r['id']}: đóng yêu cầu khi chưa được xác nhận")
            if status == "covered":
                check_evidence(r["evidence"], r["id"])
                if not r["references_reviewed"] or not r["conditions"]:
                    errors.append(f"{r['id']}: chưa lần dẫn chiếu/ánh xạ điều kiện")
                for c in r["conditions"]:
                    check_evidence(c.get("evidence", []), r["id"] + ":điều kiện")
            elif status == "not_applicable_confirmed" and not r["not_applicable_reason"]:
                errors.append(f"{r['id']}: thiếu lý do không áp dụng")
    for c in plan["core_dependencies"]:
        if c["status"] == "missing_original":
            pending.append(c["id"] + ": thiếu bản gốc nền tảng (không tính lại vào 10 nhóm)")
        elif c["status"] == "received_unverified":
            pending.append(c["id"] + ": đã nhận nhưng chưa xác minh nguồn nền tảng")
            if not c["source_ids"] or any(sid not in source_by_id for sid in c["source_ids"]):
                errors.append(c["id"] + ": bản đã nhận thiếu/sai liên kết nguồn")
        elif c["status"] != "verified" or not c["source_ids"]:
            errors.append(f"{c['id']}: trạng thái nguồn nền tảng không hợp lệ")
        elif any(sid not in source_by_id or source_by_id[sid]["source_status"] != "verified_original"
                 for sid in c["source_ids"]):
            errors.append(f"{c['id']}: nguồn nền tảng chưa xác minh")
    ids = [c["id"] for c in cases["cases"]]
    if len(ids) != len(set(ids)) or {c["card"] for c in cases["cases"]} != CARDS:
        errors.append("Bộ ca trùng hoặc chưa phủ năm nhóm")
    for c in cases["cases"]:
        if c["execution_status"] not in {"not_run", "passed", "failed"}:
            errors.append(f"{c['id']}: trạng thái chạy không hợp lệ")
        if c["execution_status"] != "passed":
            pending.append(c["id"] + ": chưa đạt kiểm tra nghiệp vụ")
        else:
            if not (c["expected_policy_answer"] and confirmed(c["owner_confirmation"]) and c["last_result"]):
                errors.append(f"{c['id']}: báo đạt nhưng thiếu đáp án/chủ nội dung/kết quả")
            if not c["source_ids"] or any(s not in source_by_id for s in c["source_ids"]):
                errors.append(f"{c['id']}: thiếu/sai nguồn cho ca")
            check_evidence(c["clause_evidence"], c["id"])
    for item in review["clarifications"]:
        if item["status"] != "confirmed":
            pending.append(item["id"] + ": cần xác nhận hoặc xác lập điểm dừng có căn cứ")
        elif not (item["answer"] and confirmed(item["owner_confirmation"])):
            errors.append(item["id"] + ": xác nhận chưa có đáp án/chủ nội dung")
        else:
            check_evidence(item["clause_evidence"], item["id"])
    release = plan["release"]
    intended_use = release.get("intended_use", "public_demo")
    permissions = {"public_demo": {"public_excerpt", "public_full"},
                   "internal_research": {"research_only", "internal_only", "public_excerpt", "public_full"}}
    if intended_use not in permissions:
        errors.append("Mục đích dùng của bản chốt chưa hợp lệ")
    for k in ("owner_confirmation", "scope_confirmation"):
        if not confirmed(release.get(k)):
            pending.append("Chốt kho: " + k)
    for k in ("references_reviewed", "temporal_cases_reviewed", "policy_cases_executed", "publication_reviewed"):
        if release.get(k) is not True:
            pending.append("Chốt kho: " + k)
    for sid in used_sources:
        if source_by_id[sid]["publication_permission"] not in permissions.get(intended_use, set()):
            pending.append(sid + ": chưa có quyền dùng phù hợp mục đích của bản chốt")
    inventory = {"plan": {k: v for k, v in plan.items() if k != "release"}, "register": register,
                 "cases": cases, "review": review,
                 "downloads": [(r.get("url"), r.get("sha256")) for r in downloads]}
    fingerprint = hashlib.sha256(json.dumps(inventory, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    if release["state"] != "frozen":
        pending.append("Kho đang làm việc, chưa đóng phiên bản nghiệm thu")
    elif not release.get("frozen_at") or release.get("inventory_sha256") != fingerprint:
        errors.append("Bản chốt không khớp kho hiện tại hoặc thiếu ngày chốt")
    return {"checked_at": dt.datetime.now(dt.timezone.utc).isoformat(), "structurally_valid": not errors,
            "collection_complete": not errors and not pending, "errors": errors, "pending": pending,
            "inventory_sha256": fingerprint, "downloaded_files_and_pages_checked": file_count,
            "additional_groups": len(plan["groups"]), "additional_requirements": len(requirements),
            "requirements_closed": sum(r["status"] != "open" for r in requirements),
            "distinct_source_contents": len(sources), "temporal_cases": len(ids),
            "policy_cases_passed": sum(c["execution_status"] == "passed" for c in cases["cases"])}


def write_tracking(plan, cases, result):
    rows = []
    lines = ["# Danh mục bổ sung để hoàn thành phạm vi chatbot", "",
             "Phạm vi đã chốt ngày 02/11/2026: T1/T3/T4/T6/T10 và nhánh phụ thuộc. "
             "Sở hữu trí tuệ/hợp tác chưa cam kết. Đây là danh mục triển khai nội dung, không phải quy định HUST.", "",
             "**Không tính lại tệp đã có hoặc ba bản gốc nền tảng H01/H03/H04.** "
             "Ba bản đó vẫn là phụ thuộc bắt buộc. Một tệp đủ phụ lục có thể đáp ứng nhiều yêu cầu; không xin trùng.", "",
             "**Hiện chưa đủ nguồn.** 10 nhóm / 21 yêu cầu bổ sung; số lượng nhóm không phải số tệp. "
             "Trạng thái đóng chỉ hợp lệ khi có căn cứ và xác nhận, không suy từ có PDF.", "",
             "## Cần lúc nào?", "",
             "Thu nguồn hiện hành trước khi hoàn thiện nội dung tương ứng. Kiểm phụ lục ngay khi nhận ba bản gốc. "
             "Nguồn lịch sử thu theo nhiệm vụ đang thực hiện, nghĩa vụ kéo dài và giấy tờ tồn đọng; "
             "không cần gom mọi phiên bản cũ ngay bây giờ. Trước nghiệm thu, mọi ca lịch sử trong phạm vi phải đủ nguồn.", ""]
    for g in plan["groups"]:
        lines += [f"## {g['id']} — {g['title']}", "",
                  f"**Nội dung:** {', '.join(g['cards'])}. **Đầu mối cần xác nhận:** {g['owner_to_contact']}. "
                  f"**Cần trước:** {g['needed_by']}.", "",
                  "| Mã | Cần bổ sung / tiêu chí đủ | Khi nào cần | Trạng thái |",
                  "|---|---|---|---|"]
        for r in g["requirements"]:
            status = {"open": "Chưa đủ căn cứ", "covered": "Đã đối chiếu và xác nhận", "not_applicable_confirmed": "Không áp dụng, có xác nhận"}.get(r["status"], r["status"])
            lines.append(f"| {r['id']} | **{r['title']}**. {r['acceptance']} | {r['trigger']} | {status} |")
            rows.append({"Mã": r["id"], "Nhóm": g["title"], "Thẻ": ";".join(g["cards"]),
                         "Cần tìm": r["title"], "Tiêu chí đủ": r["acceptance"], "Điều kiện": r["trigger"],
                         "Cần trước": g["needed_by"], "Đầu mối": g["owner_to_contact"], "Trạng thái": status,
                         "Bằng chứng": json.dumps(r["evidence"], ensure_ascii=False),
                         "Xác nhận": json.dumps(r["owner_confirmation"], ensure_ascii=False)})
        lines.append("")
    lines += ["## Dữ liệu ngoài văn bản", "",
              "- Sổ nguồn: nguồn gốc, ngày ban hành/hiệu lực đã công bố và đã xác minh tách riêng, bản sửa đổi, chuyển tiếp, đối tượng, đơn vị và điều/trang.",
              "- Xác nhận chủ nội dung, đầu mối, quyền dùng để nghiên cứu/trích đoạn/công bố; không tự suy quyền từ URL công khai.",
              "- Giải thích nghiệp vụ có căn cứ, tách ý kiến chuyên viên khỏi văn bản; không tự tạo quy tắc khi nguồn mơ hồ.",
              "- Bộ ca hỏi đáp và đổi dữ kiện, đáp án và nguồn được xác nhận. 28 ca thời gian hiện chỉ là thiết kế, chưa chạy nghiệp vụ.", "",
              "## Điều kiện đóng việc thu thập", "",
              "Đủ ba nguồn nền tảng; đóng 21 yêu cầu bằng bằng chứng hoặc xác nhận không áp dụng; "
              "xác nhận danh mục đơn vị/loại nhiệm vụ; ánh xạ mỗi điều kiện tới đoạn nguồn; lần hết dẫn chiếu ảnh hưởng; "
              "đủ nguồn chuyển tiếp cho ca có phụ thuộc; ca nghiệp vụ đạt và chủ nội dung duyệt; "
              "kiểm quyền dùng, chốt ngày và dấu kiểm kho. Nhánh thiếu nguồn vẫn chưa hoàn thành dù bot biết dừng.", "",
              "Nguồn ban hành sau ngày chốt kho được theo dõi như cập nhật duy trì. Giấy tờ nằm chờ lâu không tự quyết định dùng bản cũ.", "",
              "## Tệp theo dõi", "",
              "- [Bảng CSV](DANH_MUC_BO_SUNG.csv) / [Dữ liệu trạng thái](metadata/coverage-plan.json).",
              "- [Sổ xác minh nguồn](metadata/source-register.json) / [Đầu mối và điểm cần giải thích](metadata/content-review.json).",
              "- [Bộ ca thời gian](BO_CA_THOI_GIAN.md) / [Dữ liệu ca](metadata/temporal-cases.json).",
              "- [Kiểm tra tiến độ](metadata/coverage-audit.json) / [Ma trận nguồn H01–H17](MA_TRAN_NGUON_CAN_CO.md).", ""]
    (ROOT / "DANH_MUC_BO_SUNG.md").write_text("\n".join(lines))
    with (ROOT / "DANH_MUC_BO_SUNG.csv").open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    lines = ["# Bộ ca kiểm tra thời gian và chuyển tiếp", "",
             "28 ca giả định để thiết kế hành vi. **Chưa chạy với nguồn thật, chưa có đáp án nghiệp vụ được duyệt.** "
             "Không dùng chúng làm bằng chứng tư vấn đúng chính sách HUST.", "",
             "Mỗi ca trước khi chạy cần bổ sung dữ kiện/ngày cụ thể từ nguồn đã kiểm, đoạn căn cứ, đáp án, "
             "xác nhận chủ nội dung và kết quả thực chạy. Ngày hỏi không mặc định là ngày hoạt động. "
             "Thử ca ngay trước/đúng/sau mốc với ngày hiệu lực thực đã xác minh.", "",
             "| Mã | Thẻ | Tình huống | Hành vi mong đợi | Trạng thái |", "|---|---|---|---|---|"]
    for c in cases["cases"]:
        lines.append(f"| {c['id']} | {c['card']} | {c['title']}: {c['prompt']} | {c['expected_behavior']} | {c['execution_status']} |")
    lines += ["", "Nguồn dữ liệu để cập nhật: [temporal-cases.json](metadata/temporal-cases.json).", ""]
    (ROOT / "BO_CA_THOI_GIAN.md").write_text("\n".join(lines))
    (ROOT / "metadata/coverage-audit.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Chỉ đọc và kiểm tra, không ghi tệp")
    parser.add_argument("--require-complete", action="store_true", help="Báo mã 2 nếu kho chưa đủ nguồn")
    parser.add_argument("--sync-sources", action="store_true", help="Nhập tệp mới vào sổ nguồn, giữ nguyên xác nhận cũ")
    args = parser.parse_args()
    if args.check and args.sync_sources:
        parser.error("--check không được dùng cùng --sync-sources")
    if args.sync_sources:
        sync_sources()
    plan, register, cases, review, downloads = [read(n) for n in
        ("coverage-plan.json", "source-register.json", "temporal-cases.json", "content-review.json", "downloads.json")]
    result = audit(plan, register, cases, review, downloads)
    if not args.check:
        write_tracking(plan, cases, result)
    print(json.dumps({k: v for k, v in result.items() if k != "pending"}, ensure_ascii=False, indent=2))
    raise SystemExit(1 if result["errors"] else 2 if args.require_complete and not result["collection_complete"] else 0)


if __name__ == "__main__":
    main()
