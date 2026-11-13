---
name: hust-demo-build
description: "Xây hoặc sửa web demo chatbot HUST với hội thoại T6, hỏi bổ sung, đối chiếu điều kiện và kiểm lại khi dữ kiện đổi. Dùng cho mã giao diện, API, trạng thái phiên và kiểm tra điều kiện; sản phẩm đích triển khai trên Vercel."
---

# Xây demo chatbot HUST

Đọc [phạm vi demo](../../../docs/PHAM_VI_DEMO.md), rồi [luồng và trạng thái](references/state-and-flow.md) khi thiết kế hoặc sửa bộ xử lý hội thoại. Khi thay nguồn/quy tắc, dùng skill `hust-demo-scope`; khi kiểm chứng hoặc triển khai, dùng `hust-demo-vercel` theo đường dẫn trong `demo-hust/README.md`.

Khi tiếp tục giữa các phiên, đọc [tiến độ demo](../../../docs/TIEN_DO_DEMO.md), kiểm hiện trạng mã và kết quả chạy, rồi làm bước chưa hoàn thành. Cập nhật điểm bàn giao sau thay đổi có ý nghĩa; không khởi tạo lại hoặc dừng xin xác nhận ở từng chặng kỹ thuật đã được phép. Thiếu key chỉ chặn kiểm chứng mô hình thật, không chặn việc xây UI/bộ điều kiện bằng adapter thử có nhãn.

## Hướng triển khai

- Xây trong `demo-hust/`, giữ các tệp hướng dẫn hiện có. Ưu tiên một dự án Next.js + TypeScript cho UI và API; kiểm tra phiên bản Node/Next/SDK bằng tài liệu chính thức lúc khởi tạo, rồi lưu lockfile. Không cần kiến trúc nhiều agent hoặc backend chạy riêng chỉ để làm CA-01.
- Hội thoại là giao diện chính. Có dữ kiện đang dùng, kết luận theo phần, đoạn căn cứ mở được và thay đổi trước/sau. Nội dung tiếng Việt, chữ rõ, hiển thị tốt trên điện thoại; không đưa schema hoặc thông tin kỹ thuật vào luồng người dùng.
- Xây một ca T6 thực sự nhận và xử lý câu người dùng nhập, gồm cả cách diễn đạt khác và nhánh thay đổi. Nút nhập câu ví dụ chỉ trợ giúp; không thay việc hiểu yêu cầu bằng chuỗi đáp án soạn sẵn.
- Mô hình trích xuất ý định/dữ kiện và diễn đạt; mã kiểm tra schema, chọn nguồn/điều kiện và trạng thái kết luận. Không để mô hình tự đặt quy tắc hay tin kết luận từ trình duyệt.
- Chưa cố định nhà cung cấp mô hình. Chọn adapter rõ ràng; nếu dùng OpenAI, đọc skill/tài liệu chính thức phù hợp trước tích hợp. Chế độ fixture giúp phát triển khi chưa có key nhưng phải được ghi nhãn; không âm thầm giả làm kết quả mô hình thật.

## Giữ demo chạy được trên Vercel

API key chỉ ở máy chủ; không dùng biến `NEXT_PUBLIC_*` cho bí mật. Không đọc tệp ở đường dẫn tuyệt đối trên máy người dùng lúc runtime. Chỉ gói các đoạn nguồn được phép, đã chọn lọc vào dự án. Không đưa nguyên thư mục khảo sát hoặc tài liệu thầy gửi lên web.

Trạng thái từng phiên phải tách biệt. Không dựa vào biến toàn cục hoặc ghi file cục bộ của function để duy trì hội thoại qua các lượt. Có thể giữ trạng thái trong phiên trình duyệt cho demo, nhưng server kiểm lại đầu vào và dựng kết luận từ bộ quy tắc/nguồn của server. Hủy/yêu cầu cũ không được ghi đè câu trả lời của lượt mới.

Hoàn thiện theo các chặng quan sát được: nguồn + fixture → xử lý điều kiện → hội thoại hoàn chỉnh → giao diện căn cứ → kiểm thử → triển khai. Mỗi chặng ghi trạng thái thực tế; chỉ cập nhật báo cáo sau khi có bằng chứng chạy. Đừng mở rộng mọi thẻ để thay cho việc hoàn tất F01–F05 trong ca chính.
