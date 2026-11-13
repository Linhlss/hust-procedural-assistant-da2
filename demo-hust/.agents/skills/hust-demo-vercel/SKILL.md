---
name: hust-demo-vercel
description: "Kiểm thử demo chatbot HUST theo F01–F05 và triển khai lên Vercel để chia sẻ bằng URL. Dùng khi đánh giá CA-01, chạy build, xác minh nhiều phiên hoặc kiểm tra deployment thật; không dùng kết quả cục bộ để khẳng định đã triển khai."
---

# Kiểm thử và triển khai demo trên Vercel

Đọc [phạm vi demo](../../../docs/PHAM_VI_DEMO.md) và [ca kiểm chứng + hướng dẫn Vercel](references/acceptance-and-vercel.md) trước khi kiểm thử hoặc triển khai. Vercel là nền tảng người dùng đã chọn; không chuyển sang Sites/Cloudflare chỉ vì có connector sẵn.

Đọc [tiến độ demo](../../../docs/TIEN_DO_DEMO.md) để nối tiếp lần chạy trước, nhưng kiểm lại tiến trình/deployment thật trước khi chờ hoặc chạy lại. Ghi kết quả và việc còn chờ đúng chặng; thiếu đăng nhập không ngăn hoàn thiện kiểm thử cục bộ. Không tự chỉnh hoặc chèn lại mục demo trong báo cáo đã nộp.

## Bằng chứng phải có

- Chạy CA-01 và biến thể có ý nghĩa: dữ kiện đủ/thiếu, sửa nguồn thay thế/kết hợp, thiếu/mâu thuẫn nguồn, ngoài phạm vi, khác phiên bản, hai phiên và lỗi mô hình. Mỗi kết quả F01–F05 có lượt hội thoại/nguồn kiểm chứng; chưa chạy ghi chưa chạy.
- Không dùng ảnh UI đẹp hoặc build thành công để chứng minh đúng nghiệp vụ. Với fixture giả định, chỉ kết luận đúng hành vi trong bộ thử đó, chưa xác nhận chính sách HUST.
- Khi có lỗi trọng yếu như bịa nguồn, giữ kết luận đã hết áp dụng hoặc lẫn dữ kiện hai người, sửa rồi chạy lại ca ảnh hưởng. Không tự đặt phần trăm đạt hoặc khẳng định nhanh hơn đề tài khác.

## Triển khai có thể chia sẻ

Kiểm tra ứng dụng hiện tại, lockfile, lệnh build và Vercel project đã liên kết trước khi tạo mới. Dự án này chưa có liên kết ở thời điểm tạo skill; không suy ra đã có tài khoản hoặc URL. Dùng cách kết nối sẵn có nếu hợp lệ; thiếu thông tin đăng nhập thì hoàn thành phần cục bộ và chỉ yêu cầu người dùng thao tác đăng nhập, không xin gửi token vào chat.

Chỉ triển khai ứng dụng và nguồn được phép. Giữ key ở biến môi trường máy chủ, tách Preview/Production nếu dùng. Trước khi ghi cấu hình, xác định đúng tài khoản/project và không thay dự án không liên quan. Quyền xây skill không tự cho phép công khai tài liệu nội bộ hoặc mua dịch vụ.

Sau khi Vercel báo sẵn sàng, thử URL thật trong trình duyệt: trang tải được, API hội thoại chạy, dẫn chứng mở được, F03/F04 hoạt động, hai phiên độc lập và lỗi được xử lý. Kiểm tra quyền truy cập của người nhận link; request có token của chủ dự án không chứng minh người khác vào được. Không vô hiệu hóa bảo vệ dự án khác để có link.

Ghi URL, deployment/trạng thái, phiên bản mã/cấu hình nếu có, chế độ dữ liệu/mô hình, các ca thực sự chạy và lỗi còn lại. Nếu chỉ chạy local hoặc fixture, nói đúng trạng thái đó. Chỉ gọi bước triển khai hoàn tất khi URL trên Vercel dùng được cho đối tượng chia sẻ dự kiến.
