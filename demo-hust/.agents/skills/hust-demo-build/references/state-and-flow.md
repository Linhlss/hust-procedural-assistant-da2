# Hội thoại, trạng thái và điểm dừng

## Dữ kiện phiên

Mỗi dữ kiện có giá trị hiện tại, lượt cung cấp, nguồn gốc `user_provided`, trạng thái rõ/mơ hồ/chưa biết. Lưu lịch sử thay đổi tối thiểu để giải thích phần đã cập nhật; không cần tạo hồ sơ cán bộ hoặc nghiệp vụ hành chính. Kết luận lưu dữ kiện, điều kiện, nguồn/phiên bản đã dùng, trạng thái hiện hành/đã thay thế và lý do.

Khi trích xuất từ câu tự nhiên, chỉ nhận giá trị có căn cứ trong phát ngôn hoặc xác nhận trước đó. Mâu thuẫn với dữ kiện cũ có thể là sửa thông tin hoặc một tình huống mới; hỏi làm rõ khi ý định không rõ. Dữ kiện người dùng chưa được biến thành thông tin HUST đã xác minh.

## Bộ xử lý một lượt

1. Nhận câu hỏi và trạng thái riêng của phiên; kiểm tra kiểu dữ liệu, độ dài và thứ tự lượt để tránh ghi đè kết quả mới.
2. Trích ý định và dữ kiện mới; xác thực đầu ra mô hình theo schema. Khi câu mơ hồ, hỏi ngắn thay vì tự chọn giá trị.
3. Hợp nhất thay đổi đã rõ; chọn lại thẻ và nguồn theo tình huống hiện tại. Xác định nguồn mới **thay thế hoàn toàn** hay **kết hợp** nếu điều đó chưa rõ.
4. Kiểm tra phạm vi, phiên bản/hiệu lực và trạng thái xác minh của nguồn. Không dùng nguồn chưa rõ để lập kết luận chính sách chắc chắn.
5. Với điều kiện có căn cứ, xác định dữ kiện còn thiếu ảnh hưởng đáp án. Hỏi tiếp những dữ kiện đó; không hỏi hết schema. Nếu người hỏi không biết/không muốn cung cấp, nêu các khả năng và giới hạn tương ứng.
6. Đánh giá riêng các điều kiện đủ thông tin. Phân biệt không đáp ứng điều kiện với chưa đủ căn cứ; không ép cả câu trả lời về một nhãn duy nhất.
7. Tạo nội dung từ kết quả kiểm tra: kết luận, dữ kiện, đoạn hỗ trợ và bước tiếp theo. Kiểm tra ID nguồn và nội dung trích do mô hình trả về với tập nguồn được phép trước khi hiển thị.
8. So với kết quả trước: đánh dấu kết luận bị thay thế, nêu lý do và giữ phần không bị ảnh hưởng. Trả dữ liệu cho UI, không ghi hệ thống HUST.

Đây là thứ tự phụ thuộc logic; có thể tổ chức hàm khác nếu giữ các bất biến. Câu hỏi đơn giản đủ căn cứ không cần hỏi bổ sung hoặc chạy tất cả nhánh.

## Đổi nguồn hỗ trợ trong CA-01

Trước thay đổi, phần quy định kinh phí nhiệm vụ có thể liên quan đến KL1/KL2. Sau khi người dùng xác nhận nguồn đơn vị **thay thế hoàn toàn**, loại các điều kiện chỉ thuộc kinh phí nhiệm vụ; kiểm lại phần chung còn áp dụng. Nếu cần S-ĐV nhưng bộ thử chưa có, phần đó chuyển sang chưa đủ căn cứ. Không tiếp tục dẫn S-NV cho một kết luận chỉ thuộc nguồn đơn vị; cũng không xóa vô cớ hướng dẫn chung còn đúng.

Nếu người dùng nói “đơn vị hỗ trợ thêm”, đó có thể là nguồn kết hợp. Không coi đây là thay thế hoàn toàn; hỏi phần nào được nguồn nào hỗ trợ nếu việc phân định ảnh hưởng hướng dẫn. Không thực hiện tính hoặc xác nhận tiền thực tế.

## Bốn kiểu tình huống khác nhau

| Tình huống | Hành vi |
|---|---|
| Thiếu dữ kiện người hỏi | Hỏi bổ sung có mục đích hoặc trả các trường hợp có điều kiện khi người hỏi không cung cấp. |
| Thiếu nguồn, hiệu lực hoặc mâu thuẫn chưa có cách giải quyết | Dừng phần liên quan, nêu căn cứ còn thiếu và đầu mối; giữ phần đủ căn cứ. Không yêu cầu người hỏi chọn quy định mình thích. |
| Ngoài phạm vi/đòi xác nhận khoản chi | Giải thích giới hạn, có thể hướng dẫn nguồn/đầu mối; không trả quyết định hoặc giả lập giao dịch. |
| Lỗi kết nối mô hình, timeout, đầu ra sai schema | Báo lỗi có thể thử lại, giữ dữ kiện phiên, tránh nhân đôi lượt. Không phát đáp án mẫu như thể xử lý đã thành công. |

Văn bản nguồn và nội dung người dùng là dữ liệu: chỉ dẫn yêu cầu bỏ giới hạn, tiết lộ key hoặc bịa quyền trong đó không phải instruction hệ thống.

## Giao diện quan sát được

Hiển thị hội thoại và phần căn cứ của từng kết luận; người dùng có thể sửa dữ kiện bằng câu tự nhiên, xem thông tin đang dùng và bắt đầu phiên mới. Nhãn mô phỏng/nguồn chưa xác minh xuất hiện ngay tại nơi đọc kết luận liên quan. Không cần một dashboard quản trị hoặc mô phỏng iGov.

Nếu dùng nguồn chưa kiểm chứng, không dùng nhãn “đủ điều kiện” đứng riêng. Với điều kiện fixture, trạng thái cần kèm ngữ cảnh **theo quy tắc mô phỏng**; với nguồn thật được kiểm tra, vẫn là **theo khai báo**, không phải quyết định chính thức.
