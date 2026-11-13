# Kết quả xây dựng demo — 28/10/2026

Đã xây dựng và triển khai bản demo T6/CA-01 theo ba skill dự án. **Mở dùng thử: https://hust-t6-demo.vercel.app**. Người nhận link không cần đăng nhập Vercel; khả năng truy cập đã được kiểm bằng trình duyệt và API ẩn danh.

Bản này chứng minh hành vi trên **bộ quy tắc mô phỏng tự tạo**, chưa phải tư vấn chính sách HUST đã xác minh. Chế độ đang chạy dùng bộ trích xuất câu có giới hạn, **chưa bật mô hình AI**. Không đưa tài liệu thầy gửi, hồ sơ cá nhân hoặc tài liệu nghiên cứu lên website.

## Kết quả sản phẩm

- Hội thoại tiếng Việt trên máy tính/điện thoại; nhập tình huống tự do trong các cách diễn đạt mà bộ trích xuất hỗ trợ, không chỉ nhấn phát kịch bản.
- F01: hỏi dữ kiện cần thiết, tránh hỏi lại phần đã có; có giới hạn khi người hỏi chưa biết/không muốn bổ sung.
- F02: tách phần nhiệm vụ KHCN và phần điều kiện chung TCKH, mỗi phần có nguồn riêng.
- F03: làm rõ thay thế/kết hợp; khi chuyển hẳn sang nguồn đơn vị, loại nguồn/kết luận chỉ thuộc nhiệm vụ, giữ phần chung và nêu phần đã thay thế. Đổi ngày chọn lại phiên bản.
- F04: phân biệt đáp ứng, không đáp ứng theo khai báo và chưa đủ căn cứ trong bộ thử; thiếu nguồn đơn vị hoặc nguồn mâu thuẫn thì dừng đúng phần.
- F05: mỗi kết luận có dữ kiện, lý do, đoạn nguồn, vị trí, phiên bản/khoảng áp dụng giả định và bước tiếp theo; sao chép được tóm tắt kèm căn cứ để tự trao đổi.
- Mỗi tab có phiên riêng; bắt đầu hội thoại mới xóa phiên và hủy yêu cầu cũ. Lỗi xử lý giữ dữ kiện, không phát đáp án giả.

## Kiểm chứng thực tế

| Nội dung | Kết quả |
|---|---|
| Kiểm TypeScript và build | Đạt; Vercel Production READY. |
| Kiểm điều kiện/API tại máy | 17 ca đạt, gồm D01–D11 và các ca bổ sung. |
| Kiểm trình duyệt tại máy | 5 ca đạt. |
| Kiểm trình duyệt trên URL thật | 5 ca đạt bằng Chrome không đăng nhập; gồm desktop/mobile, dẫn chứng, đổi nguồn, mâu thuẫn, hai phiên và xử lý lỗi/thử lại/hủy phản hồi cũ. |
| Kiểm API trên URL thật | 15 request được xác minh, có transcript; request chứa kết luận từ trình duyệt bị từ chối. |
| Rà soát gói triển khai | Đã loại tệp môi trường, tài liệu gốc, báo cáo, skill, ca thử và nhật ký. |

**F01–F05 đạt trong phạm vi bộ thử mô phỏng.** Không suy ra đạt nghiệp vụ HUST, đạt trên toàn tập đánh giá đề tài hoặc giảm thời gian công việc thực tế. D10 dùng mock lỗi mô hình tại máy và chặn request lỗi trong trình duyệt; chưa thử nhà cung cấp mô hình thật.

## Những chỉnh sửa sau khi tự rà soát

Đã sửa lỗi kiểm địa chỉ gửi yêu cầu khiến trình duyệt bị từ chối; xử lý ngày sửa không hợp lệ để không dùng tiếp ngày cũ; giữ mốc so sánh kết luận qua lượt ngoài phạm vi; tạm dừng phần kinh phí khi chưa rõ thay thế/kết hợp. Đã tăng cỡ chữ, độ tương phản và bổ sung căn cứ vào bản tóm tắt. Các nhánh ảnh hưởng đã được chạy lại.

## Bàn giao và giới hạn

Mã ứng dụng ở `demo-hust/`. Điểm tiếp tục, lệnh chạy lại và định danh deployment nằm trong [tiến độ demo](../demo-hust/docs/TIEN_DO_DEMO.md). Bằng chứng Production (tệp cục bộ/không kèm bản công khai) chứa transcript API, ảnh và kết quả trình duyệt; bằng chứng local (tệp cục bộ/không kèm bản công khai) chứa transcript điều kiện và kiểm gói triển khai.

Có adapter OpenAI tùy chọn, key chỉ ở máy chủ, đã thử schema/timeout bằng mock và không tự chuyển sang fixture khi lỗi. Chưa cấu hình key/model thật hoặc kiểm chứng chất lượng mô hình. Muốn tư vấn chính sách thực tế cần nguồn gốc được phép, xác minh hiệu lực/phạm vi và chủ nội dung duyệt đáp án.

Bản đầu tiên chỉ thực hiện T6/CA-01. Đề tài đầy đủ vẫn giữ KHCN–TCKH–TCNS và các thẻ T1/T3/T4/T6/T10; chưa xây toàn bộ các thẻ còn lại, chưa có đánh giá chuyên viên hoặc đối chứng C0/C1/C2. Không sửa requirement hay báo cáo đã nộp thành kết quả thực nghiệm cũ.
