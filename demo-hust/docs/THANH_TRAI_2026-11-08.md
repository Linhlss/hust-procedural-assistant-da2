# Thanh trái điều chỉnh độ rộng — 08/11/2026

## Kết quả

Đã cập nhật **https://hust-t6-demo.vercel.app**, deployment `dpl_58od9tHUjEY5KdGtmqB5K6GqTUu6`, READY / Production. URL phiên bản: https://hust-t6-demo-eamh2v4zq-linhozz.vercel.app. Runtime SHA-256: `cb62f26e5189770de3a6269a1e61f8193657e93d54e731d619add17fddee95f8`.

- Xóa dòng “Chỉ cần thông tin của tình huống, không cần dữ liệu cá nhân.” dưới ô nhập. Nút gửi vẫn ở bên phải; đủ 24 lượt vẫn hiện thông báo và khóa gửi.
- Kéo cạnh phải thanh trái để đổi độ rộng: mặc định 232 px, tối thiểu 200 px, tối đa 360 px và không quá 35% cửa sổ. Đường nhấn hiện khi trỏ, focus hoặc kéo; vùng thao tác rộng 8 px.
- Tiêu đề hội thoại giữ cỡ chữ, một dòng và dấu “…”. Trỏ chuột để xem đầy đủ tên đã lưu. Lịch sử không tràn ngang; nút xóa nằm trong hàng của từng hội thoại.
- Độ rộng được lưu khi thả chuột, độc lập với lịch sử, bằng `hust-sidebar-width`. Thu cửa sổ chỉ giới hạn độ rộng đang hiển thị, không ghi đè lựa chọn đã lưu. Khi không dùng được bộ nhớ trình duyệt, vẫn kéo được trong trang hiện tại.
- Thanh trên, vùng chat, ô nhập và lớp nền bảng tình huống dịch theo độ rộng. Thanh trên thu gọn breadcrumb khi không đủ chỗ. Cả sáng/tối và chế độ điện thoại đã được kiểm tra; dưới 768 px dùng ngăn lịch sử hiện có và không hiện cạnh kéo.

| Thao tác | Kết quả |
|---|---|
| Kéo cạnh phải | Điều chỉnh liên tục trong giới hạn |
| Nhấp đúp cạnh kéo | Trở về 232 px |
| Mũi tên trái/phải khi focus cạnh kéo | Giảm/tăng 10 px |
| Home / End | Về giới hạn nhỏ/lớn hiện tại |
| Escape trong lúc kéo | Hủy thay đổi đang kéo |

## Kiểm chứng

| Kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| Typecheck và build | Đạt, exit code 0 | Lệnh thực chạy trong phiên; Next.js tạo đủ các route |
| Trình duyệt tại máy | 59/59 đạt, không bỏ qua | browser-results.json (tệp cục bộ/không kèm bản công khai) |
| Chrome ẩn danh trên URL công khai | 19/19 đạt | browser-results.json (tệp cục bộ/không kèm bản công khai) |
| API ẩn danh và tài liệu công khai | 23 yêu cầu đạt; sáu trang đọc/tệp tải hoạt động | api-transcripts.json (tệp cục bộ/không kèm bản công khai) |
| Bảo toàn nội dung | 83 tệp cũ được bảo vệ không đổi, gồm báo cáo, API, nguồn mẫu, schema lịch sử và lockfile | protected-files.json (tệp cục bộ/không kèm bản công khai) |
| Gói triển khai | 42 tệp có nội dung, chỉ ứng dụng/cấu hình/nguồn mẫu công khai | deployment-inputs.json (tệp cục bộ/không kèm bản công khai) |

Tám ca mới kiểm tra kéo vượt giới hạn, lưu khi thả, hủy, đặt lại, điều khiển bàn phím, cap theo cửa sổ, chuyển qua điện thoại rồi trở lại, dữ liệu lưu lỗi/hỏng, tiêu đề dài, giữ cỡ chữ, xóa/khôi phục, căn chỉnh khi mở bảng tình huống và thông báo hết 24 lượt. Hai ca chưa đạt ở lần đầu do lỗi tên biến trong bài kiểm thử đã được sửa trước khi chạy lại toàn bộ; không ghi đè bằng chứng lần đầu.

Các ca trên xác minh hành vi kỹ thuật. Runtime vẫn dùng dữ liệu mẫu T6 / `fixture`, chưa gọi mô hình thật hoặc xác minh chính sách HUST. Tìm lịch sử và “Bổ sung” từng trường vẫn khóa.

## Ảnh và source

- Thanh trái 200 px, sáng (tệp cục bộ/không kèm bản công khai)
- Thanh trái 360 px, sáng (tệp cục bộ/không kèm bản công khai)
- Bố cục tối, mở bảng tình huống tại 360 px (tệp cục bộ/không kèm bản công khai)
- Dấu mã và từng tệp runtime (tệp cục bộ/không kèm bản công khai)
- Bản trước chỉnh thanh trái (tệp cục bộ/không kèm bản công khai)

Source chính vẫn nằm trong `demo-hust/`. Không thêm phụ thuộc, sửa API hoặc schema hội thoại; chỉ thêm tùy chọn trình bày cục bộ. Deployment dùng gói độc lập có nội dung trùng source đã kiểm thử và cùng `.vercel/project.json`, tránh gắn tác giả Git của thư mục cha. Không sửa Git, quyền project hoặc tạo token bypass.
