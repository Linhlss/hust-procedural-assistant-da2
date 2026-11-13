# Cập nhật, xác minh và chốt kho nguồn

Áp dụng cho năm nhóm T1/T3/T4/T6/T10 và nhánh phụ thuộc đã chốt ngày 02/11/2026. Không công bố kho này lên demo. Thực hiện các lệnh bên dưới từ thư mục khảo sát.

## 1. Tiếp nhận nguồn và tránh xin trùng

Đọc `DANH_MUC_BO_SUNG.md`, ma trận H01–H17 và danh mục tệp trước khi xin/tải. Ba bản gốc vẫn phải có nhưng không đếm lại trong 10 nhóm bổ sung. Phụ lục/mẫu có ngay trong một bản gốc được liên kết tới cùng nguồn, không tạo yêu cầu xin tệp mới cho đủ số.

Với URL công khai được phép thu thập, dùng bộ tải hiện có để giữ URL, thời điểm, byte và SHA-256. Với tệp nhận trực tiếp, giữ bản nguyên byte và lập bản ghi trong `metadata/downloads.json`: đường dẫn, nguồn cung cấp được phép ghi, thời điểm nhận và mã băm. Không bịa URL công khai cho tệp được gửi riêng; quyền dùng vẫn phải xác nhận. Không ghi thông tin cá nhân không cần thiết.

Sau khi thêm bản ghi/tệp:

```sh
python3 Artifact_tham_khao/Quy_dinh_HUST_2026/tools/build_catalog.py
python3 Artifact_tham_khao/Quy_dinh_HUST_2026/tools/manage_coverage.py --sync-sources
```

Lệnh thứ hai thêm nguồn mới vào `source-register.json`, gộp nội dung theo mã băm và giữ xác nhận cũ. Bộ lập danh mục cũ không ghi đè sổ xác minh bổ sung này. Trường hợp tệp nhận trực tiếp cần định danh nguồn tiếp nhận nhất quán với bộ tải, không dùng đường dẫn máy cá nhân làm nguồn công khai.

## 2. Xác minh đúng phần trước khi đóng mục

Nguồn mới mặc định `unverified_original`. Trong `metadata/source-register.json`:

- Giữ ngày công bố ở `declared_*`; chỉ điền `verified_*` khi có bằng chứng và người kiểm. Không lấy ngày tải hoặc năm tên tệp làm hiệu lực.
- Ghi cơ quan, phạm vi loại nhiệm vụ/đơn vị/đối tượng, điều/trang, sửa đổi, thay thế và chuyển tiếp. Trường chưa rõ để `null` hoặc danh sách rỗng.
- `content_owner_confirmation` có `who`, `when`, `evidence`: vai trò/người xác nhận, thời điểm và chỗ lưu xác nhận được phép. Không tạo chữ ký/xác nhận giả để vượt kiểm tra.
- Quyền nghiên cứu, dùng nội bộ và trích hiển thị công khai phải được phân biệt trong nội dung xác nhận quyền. `publication_permission_evidence` lưu căn cứ; cờ `publication_reviewed` không tự cấp quyền xuất bản.

Trạng thái quyền dùng: `not_assessed`, `research_only`, `internal_only`, `public_excerpt`, `public_full`, `denied`. `release.intended_use` mặc định `public_demo`: nguồn được dùng phải cho phép trích công khai hoặc toàn văn; `internal_research` chỉ dùng cho bản chốt nghiên cứu nội bộ, không được hiểu là đã đủ quyền cho demo công khai. Dù cho phép toàn văn, cũng không tự tải kho gốc lên website.

Trong `metadata/coverage-plan.json`, cập nhật từng yêu cầu:

- `open`: còn thiếu nguồn, phạm vi, xác nhận hoặc điều kiện.
- `covered`: có `evidence`, `conditions`, `references_reviewed` và xác nhận chủ nội dung. Mỗi bằng chứng có `source_id`, `locator`, `claim`: nguồn, vị trí điều/trang và ý được hỗ trợ. Mỗi điều kiện có bằng chứng riêng.
- `not_applicable_confirmed`: chỉ dùng khi có lý do và xác nhận không áp dụng. Không được đóng chỉ vì không tìm được tài liệu hoặc muốn giảm phạm vi.

Ba nguồn H01/H03/H04 được theo dõi riêng tại `core_dependencies`. Một nguồn có thể giải quyết nhiều mục. Danh mục đơn vị áp dụng phải được xác nhận; nguồn đơn vị chỉ đủ khi có quy định riêng hoặc căn cứ xác nhận dùng chung. Không tự bỏ nhánh thiếu tài liệu.

Điểm nghiệp vụ mơ hồ lưu trong `content-review.json`. Có thể xác nhận cách hiểu hoặc xác nhận một điểm dừng có căn cứ; ý kiến chuyên viên không tự thay văn bản chính thức.

## 3. Lịch sử và ca kiểm tra

Chỉ lần bản cũ khi điều khoản chuyển tiếp hoặc ca thuộc phạm vi đòi hỏi. Tách ngày hỏi, phê duyệt/ký, bắt đầu/kết thúc, nộp/chờ xử lý và mốc phát sinh nghĩa vụ. Chỉ hỏi mốc ảnh hưởng kết luận. Giấy tờ nằm chờ lâu không tự quyết định dùng bản cũ; không mặc định ngày nộp là mốc quyết định cho mọi phần.

`metadata/temporal-cases.json` hiện có 28 ca thiết kế. Trước khi chạy nghiệp vụ, bổ sung dữ kiện và ngày cụ thể được xác nhận, nguồn/đoạn, đáp án đúng và điểm dừng. `execution_status=passed` chỉ ghi sau khi có kết quả thực chạy và xác nhận đáp án. Những ca cố ý thiếu nguồn vẫn cần nguồn/đáp án chuẩn cho việc xác định phải dừng, không điền một chính sách giả thay phần thiếu.

```sh
python3 Artifact_tham_khao/Quy_dinh_HUST_2026/tools/manage_coverage.py
python3 Artifact_tham_khao/Quy_dinh_HUST_2026/tools/manage_coverage.py --check
```

Lệnh đầu sinh lại bảng Markdown/CSV, bảng ca và báo cáo kiểm tra. `--check` chỉ đọc. Mã 0 nghĩa cấu trúc/tham chiếu/toàn vẹn hợp lệ, **không nghĩa đã đủ nguồn**. Luôn đọc `collection_complete` và danh sách `pending`.

## 4. Đóng phiên bản nghiệm thu

Đóng các mục nguồn và xác nhận danh mục đơn vị/loại nhiệm vụ; hoàn thành ánh xạ điều kiện và dẫn chiếu; kiểm tra ca thời gian với nguồn thật; xác nhận nội dung, đáp án và quyền dùng. Không cần xác nhận mọi tệp tải dư không được sử dụng.

Trong `release`, ghi xác nhận phạm vi/chủ nội dung có bằng chứng và các bước đã thực hiện. Chạy kiểm tra để lấy `inventory_sha256`, sau đó ghi đúng dấu kiểm, ngày chốt và `state=frozen`. Nội dung nguồn, trạng thái và kết quả ca là thành phần của dấu kiểm; sửa sau đó phải mở lại phiên bản và kiểm lại.

```sh
python3 Artifact_tham_khao/Quy_dinh_HUST_2026/tools/manage_coverage.py --check --require-complete
```

Mã 0: đủ các cổng kiểm tra được khai báo. Mã 1: dữ liệu không hợp lệ. Mã 2: dữ liệu hợp lệ nhưng còn việc chưa đóng. Công cụ kiểm tính nhất quán và bằng chứng đã khai báo, không tự đánh giá tính đúng đắn chuyên môn hoặc thay chủ nội dung xác nhận. Văn bản mới sau ngày chốt là cập nhật duy trì.
