# Đồng bộ bản công khai

Workspace riêng giữ nguyên source và dữ liệu cá nhân. Repo này là bản xuất đã lọc, không tự kết nối Vercel.

1. Sửa và kiểm tra trong workspace riêng.
2. Bảo đảm repo công khai không có thay đổi chưa commit. Chạy từ repo này: `python3 tools/export_public.py --source "/đường/dẫn/workspace-riêng" --output .` để xem trước, thêm `--apply` mới cập nhật. Công cụ cần Python 3.9+ và pypdf nếu giữ hai PDF đề nghị dữ liệu.
3. Kiểm README, liên kết, định danh, bí mật, danh sách tệp và các hash source sau khi xuất. Chạy lại typecheck/test/build khi source ứng dụng thay đổi. Không gọi model để kiểm thao tác đồng bộ Git.
4. Tạo commit và push `main` sau khi rà diff. Không dùng `git add` hoặc push từ workspace riêng để thay cho bước lọc. Không force-push.

Bộ xuất mặc định loại bản gốc/OCR/receipt, tài liệu thầy, tệp môi trường thật, cấu hình Vercel, cache, lịch sử Git cũ, PDF báo cáo, Excel và chỉ dẫn AGENTS đã được rút. Source báo cáo thay thông tin sinh viên bằng dữ liệu mẫu; số liệu kiểm thử lịch sử giữ nguyên. Hai PDF yêu cầu tài liệu/FAQ chỉ kèm khi kiểm tra không có định danh hoặc secret.

`PUBLIC_EXPORT.json` mô tả bản xuất và tệp loại theo lý do. `PUBLIC_VERIFICATION.json` ghi lần kiểm thực tế trước phát hành; khi cập nhật mới phải kiểm lại trước khi sử dụng kết quả đó. Không tự thêm giấy phép mã nguồn/tài liệu khi chưa có yêu cầu của chủ dự án.
