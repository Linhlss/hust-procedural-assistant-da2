# Kết quả kiểm tra bộ skill

Đây là kiểm tra **bộ hướng dẫn chuẩn bị xây dựng**, không phải kết quả chạy ứng dụng. Hoàn tất ngày 28/10/2026.

| Hạng mục | Bằng chứng đã kiểm tra | Kết quả |
|---|---|---|
| Cấu trúc ba skill | Chạy `quick_validate.py` của skill-creator lần lượt cho `hust-demo-scope`, `hust-demo-build`, `hust-demo-vercel`. | Cả ba trả `Skill is valid!`. |
| Thông tin giao diện skill | Đọc YAML, kiểm tên gọi, độ dài mô tả và prompt có đúng tên `$skill`. | Hợp lệ; không đặt chế độ chỉ được gọi tường minh. Việc hiện trong danh sách của từng phiên phụ thuộc cơ chế nạp skill; AGENTS có đường dẫn mở trực tiếp. |
| Liên kết tài liệu | Kiểm tra 92 liên kết Markdown nội bộ tại thời điểm rà soát trước khi thêm biên bản này. | Tất cả trỏ tới tệp/thư mục tồn tại. |
| Căn cứ trích phạm vi | So SHA-256 của sáu nguồn trong `source-manifest.json` với tệp hiện tại. | Trùng khớp. Đây không phải xác minh hiệu lực pháp lý của nguồn. |
| Giữ tài liệu ban đầu | Đối chiếu danh mục 20 tệp trước sắp xếp với vị trí mới; so SHA-256 của mọi PDF/DOCX/TeX ban đầu. | Đủ 20 tệp; các PDF/DOCX/TeX không bị thay nội dung. |
| Tách hướng cũ | Kiểm kê bảy tệp chuyển sang artifact và cập nhật liên kết liên quan. | Bảy tệp đã chuyển; không xóa vĩnh viễn. |

## Rà soát nội dung hướng dẫn

- Có đủ F01–F05; tách demo T6 khỏi phạm vi đề tài ba Ban.
- Phân biệt nguồn thiết kế, nguồn gốc chưa xác minh, nguồn đã kiểm tra và fixture; không coi tài liệu thầy cung cấp là toàn bộ quy định gốc.
- Có nhánh nguồn kinh phí thay thế/kết hợp, chọn lại thẻ/nguồn trước khi kiểm kết luận và dừng riêng phần thiếu căn cứ.
- Giữ giới hạn dữ liệu, tiền, tuyển dụng, kNC và không giao dịch với hệ thống HUST.
- Hướng tới Vercel, có bước kiểm URL thật và quyền truy cập của người nhận link; không xem build local là đã triển khai.

Chưa có mã ứng dụng, ca kiểm thử chạy thực tế, đăng nhập Vercel hoặc URL live. Các bước này thuộc giai đoạn xây demo tiếp theo; không dùng biên bản này để ghi chúng là đã hoàn thành.

## Rà soát bổ sung về phạm vi và khả năng nối tiếp

Ngày 28/10/2026, đối chiếu lại requirement và bản tiến độ sau khi người dùng bỏ mục trình diễn:

- Phạm vi demo vẫn là T6/CA-01 với F01–F05; không tự mở rộng thành toàn bộ năm thẻ hoặc bỏ miền TCNS khỏi đề tài đầy đủ.
- Đã sửa liên kết PDF sang tên hiện có `Tuan4_Student.pdf` và cập nhật dấu kiểm của hai tệp nguồn thay đổi. Không sửa PDF trong lần rà soát skill này.
- Đã bỏ chỉ dẫn tự cập nhật mục 9 của báo cáo; kết quả chạy được lưu vào artifact và chỉ đưa vào báo cáo khi người dùng yêu cầu.
- Đã bổ sung file tiến độ và quy tắc bàn giao giữa các phiên: đọc trạng thái, kiểm chứng hiện trạng, tiếp tục bước còn thiếu, ghi bằng chứng và hành động tiếp theo. Mốc kỹ thuật không phải yêu cầu hỏi lại quyền đã có.
- Đã phân định bước nào vẫn làm được khi chưa có bản gốc, key mô hình hoặc đăng nhập Vercel; không tự gọi mô phỏng là chạy mô hình thật hoặc đã triển khai.

Kiểm tra lại: cả ba skill tiếp tục trả `Skill is valid!`; 98 liên kết Markdown nội bộ tồn tại; sáu bản ghi nguồn khớp tệp hiện tại. Dự án vẫn chưa có `package.json` hoặc `.vercel/project.json`.

**Kết luận:** bộ hướng dẫn bao phủ các chặng chuẩn bị dữ liệu → xây hội thoại → kiểm thử → triển khai/chia sẻ trong phạm vi demo đã chọn. Chưa có kiểm chứng việc xây ứng dụng từ đầu đến cuối bằng bộ skill; không thể dùng kiểm tra cấu trúc để cam kết không có lỗi hoặc không phụ thuộc nguồn, tài khoản và dịch vụ bên ngoài.
