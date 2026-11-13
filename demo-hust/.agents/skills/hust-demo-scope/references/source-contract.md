# Hợp đồng dữ liệu và căn cứ

Đây là schema triển khai đề xuất để giữ đúng thiết kế khảo sát, không phải dữ liệu nghiệp vụ đã được HUST xác nhận. Có thể thay cấu trúc kỹ thuật nếu vẫn giữ các thông tin quyết định bên dưới.

## Thẻ và quan hệ phụ thuộc

| Thành phần | Thông tin cần giữ |
|---|---|
| Thẻ tư vấn | `id`, mục đích, câu hỏi hỗ trợ, phạm vi/loại trừ, miền liên quan, chủ nội dung nếu đã biết, nguồn và trạng thái kiểm tra. |
| Dữ kiện quyết định | Tên biến, kiểu giá trị, trạng thái biết/chưa biết/mơ hồ, lý do ảnh hưởng đáp án, nguồn điều kiện đòi hỏi biến đó. |
| Điều kiện | Mã, biểu thức kiểm tra, phạm vi áp dụng, dữ kiện phụ thuộc, đoạn nguồn hỗ trợ hoặc nhãn giả định, kết luận liên quan. |
| Nguồn/đoạn | Định danh, loại nguồn, vị trí đoạn, nội dung trích, phiên bản, khoảng hiệu lực nếu biết, phạm vi áp dụng, tình trạng xác minh và quyền công bố. |
| Kết luận | Mã, phát biểu, điều kiện/dữ kiện/nguồn đã dùng, trạng thái, lý do, thông tin còn thiếu và đầu mối; quan hệ thay thế kết luận cũ. |

Các nhóm kết luận T6: **KL1** phạm vi nguồn; **KL2** điều kiện tài chính cần đối chiếu; **KL3** phần cần xác nhận. Chúng không có sẵn kết luận đúng cho mọi người hỏi. Không biến KL1 thành xác nhận đủ điều kiện được chi.

Biến ứng viên: loại hoạt động; trong nước/nước ngoài; thời điểm hoạt động; nguồn nhiệm vụ/đơn vị/kết hợp; quan hệ của hoạt động với nhiệm vụ. Loại nhiệm vụ hoặc đặc điểm đơn vị chỉ hỏi khi nguồn của nhánh đang xét đòi hỏi. Không mặc định ngày hỏi là ngày hoạt động. “Hội thảo quốc tế” chưa tự chứng minh diễn ra ở nước ngoài.

## Trạng thái nguồn và cách sử dụng

| Loại | Được dùng để làm gì | Không được suy ra |
|---|---|---|
| `design_reference` | Chọn thẻ, nhận diện phần cần xin bản gốc, thiết kế hội thoại. | Quy định chính thức đã xác minh. |
| `unverified_original` | Đối chiếu nội dung; nêu còn thiếu xác minh, dừng phần chưa đủ căn cứ. | Đã biết hiệu lực chỉ vì có PDF hoặc tên năm trong tệp. |
| `verified_original` | Hỗ trợ kết luận trong đúng đối tượng, thời điểm, phiên bản và quyền sử dụng được kiểm tra. | Có quyền đăng công khai hoặc mọi phần của tệp đều được xác minh. |
| `synthetic_fixture` | Thử hành vi điều kiện/đổi dữ kiện bằng bộ quy tắc giả định, hiển thị nhãn mô phỏng. | Chính sách HUST, giao dịch có thật hoặc dữ liệu đã được chuyên viên chấp nhận. |

Đừng gộp các trạng thái này với nhãn **thật / chuẩn hóa từ nguồn / mô phỏng**: một đoạn được chuẩn hóa từ nguồn thật vẫn có thể chưa được kiểm tra hiệu lực. Giữ riêng nguồn gốc, xác minh và quyền công bố. Trường chưa biết để `null` hoặc trạng thái chưa xác định, không tạo metadata cho đủ.

Nguồn bị thay thế không bị xóa lịch sử: đối chiếu ngày của tình huống với khoảng hiệu lực. Ngày tải/thu thập không phải ngày có hiệu lực. Hai nguồn khác phạm vi chưa hẳn mâu thuẫn; nếu cùng áp dụng nhưng không tương thích và chưa có thứ tự ưu tiên được xác nhận, dừng phần ảnh hưởng.

## CA-01 và fixture

- S-NV: đoạn quy định nhiệm vụ; S-CT: đoạn quy định công tác/hội thảo áp dụng chung; S-ĐV: quy định riêng đơn vị.
- Trong thiết kế CA-01, giả định S-NV/S-CT đã được kiểm tra trong tập thử, S-ĐV vắng mặt. Mô hình phải biết đây là trạng thái **tập thử**, không khẳng định HUST không có S-ĐV.
- Nếu chưa có bản gốc, tạo đoạn giả định mang ID `SIM-*` để kiểm thử. Không sao chép các mã điều khoản thật sang nội dung giả định hoặc viết như trích văn bản HUST.
- Nếu dùng đoạn thật, lưu vị trí và dẫn chứng chính xác, kiểm tra quyền dùng trước khi đưa lên website. Không gắn `verified_original` chỉ để ca thử đạt.
- Fixture phải có đủ nhánh để kiểm trạng thái đáp ứng/không đáp ứng/chưa đủ căn cứ; không cần đưa số tiền, tên người hoặc hồ sơ sinh viên vào để tăng độ khó.

Ghi đáp án mong đợi theo hành vi và từng ý có nguồn; không chỉ so trùng chuỗi câu trả lời. Việc tạo fixture không đồng nghĩa các ca đã chạy hoặc đạt.
