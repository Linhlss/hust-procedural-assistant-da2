# Cập nhật demo theo phản hồi — 28/10/2026

URL hiện hành: https://hust-t6-demo.vercel.app. Đã triển khai Production và kiểm tra bằng trình duyệt không đăng nhập.

1. **Giảm nhãn lặp:** bỏ banner dài và nhãn MÔ PHỎNG ở đầu từng lượt. Thông tin chế độ được gom vào “Bản trải nghiệm”; câu trả lời và tài liệu có chú thích ngắn về tài liệu mẫu.
2. **Có lịch sử hội thoại:** danh sách ở thanh bên/điện thoại, lưu trên trình duyệt đang dùng; tạo cuộc mới vẫn giữ cuộc cũ. Mở lại, tiếp tục, xóa/khôi phục được. Tối đa 20 cuộc trong 30 ngày, lọc khi đọc/ghi; chưa đồng bộ tài khoản hoặc thiết bị. Có xử lý dữ liệu phiên bản cũ, dữ liệu hỏng và trường hợp trình duyệt chặn lưu trữ.
3. **Có tài liệu mẫu đầy đủ:** tạo 6 tệp Markdown cùng trang đọc có liên kết đến từng đoạn, gồm nguồn nhiệm vụ, công tác 2025/2026, hỗ trợ đơn vị, sổ tay chuẩn bị và tình huống mâu thuẫn. Bộ mặc định đầy đủ nguồn đơn vị; thiếu/mâu thuẫn nguồn chỉ nằm trong chế độ kiểm thử riêng. Câu hỏi chung về giấy tờ/các bước/thời điểm được trả trực tiếp, không ép khai đủ tình huống.

23 ca tự động tại máy và 11 ca trình duyệt trên URL thật đạt. Đã xác minh 17 request API, mở/tải 6 tệp và 6 trang tài liệu. Ca lịch sử kiểm cả đóng/mở context trình duyệt, tiếp tục trao đổi, hai tab, xóa/khôi phục và tải lại trang. F01–F05 và các điểm dừng vẫn được kiểm riêng.

Bằng chứng: biên bản nghiệm thu bản sửa (tệp cục bộ/không kèm bản công khai), kết quả trình duyệt (tệp cục bộ/không kèm bản công khai), transcript API (tệp cục bộ/không kèm bản công khai), [tiến độ cập nhật](../demo-hust/docs/TIEN_DO_DEMO.md).

Tài liệu là nội dung mẫu tự tạo, không phải chính sách HUST được xác minh. Bộ hiểu câu vẫn là fixture có giới hạn, chưa gọi mô hình AI. Lịch sử mất nếu người dùng xóa dữ liệu trình duyệt; máy chủ chưa lưu hoặc đồng bộ hội thoại. Không đưa tài liệu gốc của người hướng dẫn, key hoặc nhật ký riêng vào gói triển khai.

## Bản tiếp theo — luồng hỏi bổ sung, citation và bảng phải

Đã cập nhật cùng URL. Chatbot chủ động hỏi từng dữ kiện cần thiết, có lựa chọn nhanh và chọn ngày, hiểu câu ngắn theo bước đang hỏi và không hỏi lại dữ kiện đã có. Câu mô tả tình huống cá nhân “cần làm gì” không còn bị bỏ qua bước làm rõ; có hỏi xác định trường hợp mới trước khi dùng lại dữ kiện cũ.

Hướng dẫn, các ý chuẩn bị và bước tiếp theo được đọc riêng với nguồn. Citation thu gọn mặc định, đánh số và mở đúng đoạn khi bấm. Không gian tình huống là bảng bên phải có đóng/mở, nút ngay trái “Bản trải nghiệm”, có ×/Escape và đóng bằng lớp nền trên điện thoại.

30 ca xử lý tại máy và 17 ca trình duyệt URL thật đạt; API xác minh 22 request, gồm chuỗi hỏi theo câu trong ảnh. Biên bản và ảnh bản hỏi đáp (tệp cục bộ/không kèm bản công khai). Chế độ dữ liệu/mô hình không thay đổi: tài liệu mẫu và fixture, chưa xác minh chính sách HUST.
