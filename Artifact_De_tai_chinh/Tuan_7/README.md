# Tiếp nhận tài liệu và FAQ — đợt 13–18/11/2026

Chưa ghi nhận bộ mới do thầy cung cấp trong workspace khi lập khung này. Kho cũ và hai PDF đã gửi thầy giữ nguyên. Mã D01–D15 là mã đối chiếu nội bộ trong `../De_nghi_du_lieu_2026-11-13/coverage-crosswalk.json`, không phải số văn bản hoặc số tệp phải nhận.

## Nhận tệp vào buổi làm việc kế tiếp

1. Chọn đúng tệp thầy cung cấp; ghi xuất xứ, cách nhận và phần được phép sử dụng. Không gom cả thư mục Downloads hoặc hồ sơ cá nhân.
2. Chạy `python3 tools/intake.py receive '/đường/dẫn/tệp.pdf' --origin 'Nguồn cung cấp đã xác định' --kind document --scope T6 --request D07` để xem trước; thêm `--apply` mới sao chép. Công cụ không sửa bản gốc, không tải mạng, không giải nén hoặc chạy tệp nhận được.
3. Bản sao nguyên byte nằm trong `received/originals/`; sổ `received/register.json` lưu SHA-256, xuất xứ và từng lượt nhận. Trùng nội dung chỉ lưu một bản nhưng giữ mọi tên/xuất xứ. Không xóa bản tải cũ mà metadata còn tham chiếu.
4. Chạy `python3 tools/intake.py check`. Kiểm toàn vẹn không phải xác nhận quy định còn hiệu lực. Ghi `coverage.json`: đã nhận đủ/thiếu phụ lục, cần bản rõ hơn, cần xác nhận đầu mối; một tệp có thể đáp ứng nhiều mục.
5. Tách văn bản gốc, hướng dẫn, mẫu, FAQ và ý kiến chuyên viên. Để trống ngày chưa biết; chỉ điền hiệu lực/thay thế/chuyển tiếp khi có bằng chứng điều/trang hoặc văn bản xác nhận.
6. Bốn quyền ghi riêng: nghiên cứu, trích dẫn, gửi dịch vụ mô hình, chia sẻ demo. `unknown` không phải `allowed`. Ghi bằng chứng khi xác nhận hoặc từ chối. Các bản nhận và bản trích chữ bị Git bỏ qua; không đưa vào Vercel hoặc GitHub.

Các mã ưu tiên: D01 nhiệm vụ KHCN; D02 Chi tiêu nội bộ; D03 Công tác cán bộ; D07 hướng dẫn/chứng từ T6; D08 nguồn đơn vị; D09 kết hợp nguồn. D04/D05/D06/D10 tương ứng T1/T3/T4/T10; D11–D15 là nền tài chính, thẩm quyền, đầu mối, chuyển tiếp và dẫn chiếu. Toàn bộ nội dung xin vẫn ở hai PDF đã gửi, không thay bằng danh sách rút gọn này.

## Trích chữ và đối chiếu

Giữ nguyên bản nhận. Đặt bản trích dưới `text/<source-id>/`, ghi công cụ/phiên bản, ngày trích và số trang PDF. Đoạn OCR luôn là ứng viên chưa soát; mở bản gốc để kiểm dấu, bảng, số tiền, thời hạn, tên mẫu và điều khoản. Không tự sửa phần không đọc được thành một quy tắc. Kho cũ `Artifact_tham_khao/Quy_dinh_HUST_2026` tiếp tục là nơi đối chiếu nguồn đã thu, không cần nhập lại 45 nội dung vào sổ nhận mới.

`coverage.json` nối chín điều kiện T6 hiện có với D01–D15. Không đánh dấu hoàn thành vì đã nhận một PDF. Với nhánh trong nước/kinh phí nhiệm vụ, lập từng dòng: câu hỏi → dữ kiện → điều kiện → điều/trang → hướng dẫn → điểm dừng. Ngày sự việc, phê duyệt nhiệm vụ, quyết định cử đi, kết thúc chuyến đi và nộp chứng từ được ghi riêng theo căn cứ; chưa đưa tất cả vào trường `date` hiện tại của fixture.

## Gói nguồn ứng viên và thử truy xuất

`candidate-pack.json` đang rỗng và chưa kích hoạt. Từ `demo-hust/`, chạy:

```sh
node --import tsx scripts/knowledge-tools.ts validate ../Artifact_De_tai_chinh/Tuan_7/candidate-pack.json
node --import tsx scripts/knowledge-tools.ts search ../Artifact_De_tai_chinh/Tuan_7/candidate-pack.json 'chứng từ công tác' --date 2026-11-18 --use research
```

Gói lưu văn bản, đoạn nguyên văn, vị trí điều/trang, phiên bản, hiệu lực, đối tượng, loại nhiệm vụ, đơn vị, nguồn kinh phí và quyền sử dụng. Lệnh kiểm phát hiện ID trùng, đoạn rỗng, ngày sai/đảo, thiếu vị trí, liên kết bản gốc thiếu và thẻ dẫn đoạn không tồn tại. Lệnh tìm dùng từ khóa tiếng Việt và bộ lọc đã xác minh; trả đoạn và lý do loại nguồn, **không kết luận đủ điều kiện**. Đây là truy xuất từ khóa ban đầu, chưa phải đánh giá độ bao phủ hay tìm kiếm ngữ nghĩa.

Mỗi thẻ cần câu hỏi, dữ kiện cần biết, nguồn, hướng dẫn, điểm dừng và xác nhận. `packReadiness` báo riêng theo mục đích sử dụng. Không dùng quy tắc mẫu lấp khoảng trống. Runtime hiện chỉ nhận `HUST_KNOWLEDGE_PACK=t6-fixture`; tên gói khác bị chặn trước khi gọi model. Việc nối gói thật với engine chỉ thực hiện sau khi nhận/soát nguồn và kiểm các điều kiện thật, không đổi nhãn fixture thành HUST.

## FAQ để chọn trọng tâm và làm đáp án

`faq-register.json` chưa có câu. Sao chép cấu trúc từ `faq-record-template.json` khi có dữ liệu thật; đây là mẫu trường nhập, không phải FAQ đã thu.

Ghi cách hỏi, mục đích, dữ kiện cần hỏi thêm, đáp án và bước chuẩn bị, căn cứ, đầu mối, chỗ dễ sai và hậu quả; phân biệt câu hỏi thực tế với ca chuyên viên tự xây dựng. `frequency` chỉ điền khi có số liệu sẵn hoặc nhận xét chuyên viên kèm căn cứ; không tự gọi là phổ biến nhất. `answerStatus=confirmed` cần đáp án và bằng chứng xác nhận.

Ẩn danh trước khi nhập. Gán `caseGroup` cho tình huống gốc; mọi biến thể ở cùng nhóm. Chia một phần FAQ đủ chất lượng sang `heldout` trước khi chỉnh prompt; không đọc để sửa rồi tiếp tục gọi là đánh giá độc lập. Chạy `python3 tools/intake.py faq-check faq-register.json` để phát hiện trùng ID, thiếu phân loại/xuất xứ, tần suất không căn cứ và rò nhóm giữa hai tập.

Nếu nhánh ưu tiên còn thiếu, đầu ra bàn giao là gói ứng viên, bảng thiếu và câu hỏi cần chuyên viên xác nhận. Không chuyển nhánh khác để ghi hoàn thành. Việc ngoài năm nhóm chỉ ghi tham khảo.

## Lịch và điểm tiếp tục

- 13–14/11: sửa câu trả lời, phát lại bằng chứng, chuẩn bị nhận nguồn và ca phát triển.
- 15/11: nhận/kiểm kê nếu có; chưa có thì tiếp tục kiểm giao diện và công cụ. Không ghi nhận tài liệu giả.
- 16/11: soát bản gốc, hiệu lực, phạm vi và nhánh trong nước/nguồn nhiệm vụ nếu đủ dữ liệu.
- 17/11: kiểm luồng trên gói đã đủ căn cứ; chỉ dùng model miễn phí qua Vercel khi quyền gửi và quota cho phép.
- 18/11: hồi quy, quay minh chứng và tổng hợp thực tế. Hai giờ dự phòng ưu tiên OCR/kiểm căn cứ; giảm số cuộc gọi trước khi giảm kiểm nguồn.

Giữ ngày thực hiện 13–15/11 riêng với 16–18/11. Kế hoạch 23 giờ + 2 giờ dự phòng là phân bổ, không phải số giờ đã thực hiện. Tiến độ thực nằm trong `KET_QUA_13_18_11.md`.
