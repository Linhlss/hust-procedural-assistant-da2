# Giao diện than chì và animation — 08/11/2026

## Bản bàn giao

- URL công khai: **https://hust-t6-demo.vercel.app**.
- Deployment `dpl_8azYjaE8dNPviyawDDYwAPWRc9xw`, READY / Production; URL phiên bản: https://hust-t6-demo-70wku0rv1-linhozz.vercel.app.
- SHA-256 runtime: `2b809000fae276e4814c514da8417c3a27ae16a4320e6537ba3b1a196bbbf742`; dấu từng tệp (tệp cục bộ/không kèm bản công khai).
- Video thao tác trên URL thật (tệp cục bộ/không kèm bản công khai).
- Đối chiếu ảnh Stitch và ứng dụng (tệp cục bộ/không kèm bản công khai), bản tối (tệp cục bộ/không kèm bản công khai), bản sáng (tệp cục bộ/không kèm bản công khai).

## Đã thay đổi

Dùng bộ `stitch_hust_procedural_assistant_redesign (1)` và ảnh kèm làm chuẩn; DESIGN.md chỉ dùng thông số trình bày phù hợp. Các đoạn liên quan duyệt hồ sơ/chữ ký không được dùng làm yêu cầu mới.

- Màu tối than chì: nền #0B0B0D, chrome #17171A, thẻ #1C1C20, bề mặt #242428, ô nhập #27272A, viền #34343B. Logo chuyển sắc đỏ, thẻ có bóng và viền sáng nhẹ.
- Theme tối cho lần đầu chưa có lựa chọn; giữ các lựa chọn sáng/tối đã lưu. Công tắc dạng gạt, đồng bộ chat, thư viện và tài liệu.
- Ô nhập gọn: textarea và nút gửi cùng hàng; nội dung tối đa 780 px. Nhắc câu hỏi bổ sung dùng câu đang chờ thực tế. Không tạo chế độ điền sẵn giả; tìm lịch sử và bổ sung từng trường vẫn khóa.
- Thanh trái vẫn kéo được 200–360 px, không quá 35% cửa sổ, giữ cỡ chữ và dấu “…”. Kéo bám chuột; chỉnh bằng phím/đặt lại chuyển mềm trong giới hạn.
- Nút/chip có hover và phản hồi nhấn; theme có thumb trượt nảy; bảng/ngăn và lớp nền có chuyển động mở lẫn đóng; căn cứ và phần đã thay thế giãn/thu; chỉ báo tab chuyển mềm; hội thoại/phản hồi mới mờ hiện và dịch nhẹ; hàng lịch sử xóa/khôi phục có chuyển vị trí.
- Mức chính 200–400 ms, độ nảy ở điều khiển nhỏ; khối văn bản không phóng/thu. Không có hiệu ứng gõ chữ giả hoặc trì hoãn gọi API để chờ animation.

## Thiết kế kỹ thuật và khả năng sử dụng

Motion for React **14.10.1** được khóa trong package và lockfile. Các primitive chung nằm trong MotionUI; giữ native details/summary kết hợp trạng thái đóng/mở có animation. Nội dung đã đóng hoặc đang thoát có `inert`/ẩn khỏi trợ năng, không còn nhận click/focus. Giữ Escape và phục hồi focus; source ID và `EvidenceHandle.showSource` vẫn giữ.

Không transform phần bọc ô nhập cố định. Khi mở bảng desktop, không gian dành cho chat và ô nhập chuyển đồng bộ. Cơ chế đo chiều cao ô nhập vẫn bù khoảng trống cuối nội dung. Mở nguồn xong mới định vị/focus đúng đoạn. Các chuyển động cuộn có thể ngắt ngay khi người dùng gõ, chạm, dùng phím hoặc tự cuộn. Không tự cuộn khi nhận phản hồi.

Reduced Motion được tôn trọng bằng cấu hình Motion và CSS: bỏ độ nảy, trượt, phóng/thu, rút ngắn chuyển trạng thái; các thao tác vẫn hoạt động. Theme được xác định trước khi hiển thị để giữ lựa chọn trình duyệt.

Đã dùng MCP trình duyệt để đọc DOM/màu, thử hội thoại và kiểm tra bản triển khai; Playwright dùng cho tự động hóa, ảnh và video. Không cài thêm Stitch MCP vì bộ export đã cung cấp nguồn thiết kế.

## Kiểm chứng thực tế

| Nội dung | Kết quả | Bằng chứng |
|---|---|---|
| Typecheck / build | Đạt, exit code 0 | build-checks.json (tệp cục bộ/không kèm bản công khai) |
| Xử lý / mock | 90/90 đạt | unit.log (tệp cục bộ/không kèm bản công khai) |
| Trình duyệt tại máy | 65/65 đạt, không bỏ qua | browser-results.json (tệp cục bộ/không kèm bản công khai) |
| Trình duyệt ẩn danh trên URL thật | 20/20 đạt | browser-results.json (tệp cục bộ/không kèm bản công khai) |
| API và tài liệu công khai | 23 yêu cầu đạt; sáu trang đọc/tệp tải hoạt động | api-transcripts.json (tệp cục bộ/không kèm bản công khai) |
| Bảo toàn nghiệp vụ/báo cáo | 54 tệp thuộc nhóm được bảo vệ không đổi | protected-files.json (tệp cục bộ/không kèm bản công khai) |
| Gói triển khai | 44 tệp có nội dung, chỉ ứng dụng/cấu hình và nguồn mẫu công khai | deployment-inputs.json (tệp cục bộ/không kèm bản công khai) |

Sáu ca mới kiểm tra màu/default/ghi nhớ theme, ngắt animation bảng trên máy tính/điện thoại, đúng nguồn sau đóng/mở liên tiếp, khôi phục trong lúc hàng đang thoát, theme đổi nhanh và Reduced Motion. Các ca cũ tiếp tục kiểm dữ kiện, nguồn, lỗi, nhiều phiên, lịch sử, giới hạn 24 lượt, cỡ chữ khi kéo và nội dung cuối trang.

Trong quá trình kiểm tra đã sửa nội dung thu gọn vẫn được coi là hiện, tên hai nút đóng lịch sử bị trùng và cuộn còn tiếp diễn sau thao tác mới. Các thư mục thử trước được giữ riêng; kết quả cuối dùng thư mục release/production trên, không cộng các lần chạy lặp thành số ca độc lập. Ảnh đối chiếu được chụp sau khi chuyển động kết thúc. Video có các khoảng dừng ngắn để quan sát và ghi lại thao tác thật.

## Giới hạn và tiếp tục

Runtime vẫn là nguồn mẫu T6 / `fixture`; chưa gọi mô hình thật hoặc xác nhận chính sách HUST. API, nguồn mẫu, schema lưu lịch sử và báo cáo không đổi. Kết quả kiểm kỹ thuật không thay xác nhận nghiệp vụ hoặc bảo đảm tốc độ trên mọi thiết bị; Reduced Motion và các kích thước máy tính/máy tính bảng/điện thoại đã được kiểm tra trong Chrome.

Nguồn chính vẫn ở `demo-hust/`. Triển khai cùng project Vercel qua gói độc lập để không gắn tác giả Git của thư mục cha; không sửa Git hoặc bảo vệ project. Bản trước thay giao diện (tệp cục bộ/không kèm bản công khai) được giữ để đối chiếu/khôi phục.
