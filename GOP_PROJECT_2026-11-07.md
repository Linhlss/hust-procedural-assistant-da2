# Gộp project HUST — 07/11/2026

## Bộ làm việc chính

Thư mục mới: ${PROJECT_ROOT}

Nguồn sao chép và bản lưu đối chiếu, giữ nguyên: ${HOME}/Documents/Khảo sát

Chỉ gộp hướng chatbot tư vấn T1/T3/T4/T6/T10. Nội dung source báo cáo, mã xử lý, fixture, kho nguồn và bằng chứng kiểm thử được giữ nguyên; chỉ cập nhật hướng dẫn, liên kết và manifest cần thiết cho vị trí mới.

## Bản dự phòng thư mục đích trước khi gộp

Đường dẫn: ${HOME}/Documents/AI Engineer/Star Project/DA2_truoc_gop_HUST_20261107_123413.tar.gz

Bản này bao gồm toàn bộ thư mục đích trước khi gộp và lịch sử Git. Trạng thái có thay đổi chưa commit được ghi trong metadata/migration-2026-11-07.json. Không checkout các tệp người dùng đã xóa, không commit/push hoặc triển khai website trong đợt này.

<a id="phan-khong-dua-vao-bo-lam-viec"></a>

## Phần không đưa vào bộ làm việc

- Enterprise Support Copilot và các tài liệu cũ trong thư mục ĐA 2: nằm trong bản dự phòng ở trên.
- Các hướng Huong_da_tam_dung, tài liệu QUY TRÌNH IGOV và các bản báo cáo trùng: giữ ở thư mục khảo sát gốc.
- Chỉ giữ PDF Đồ án 1 để đối chiếu định dạng; source đồ án sản xuất cũ giữ tại bản khảo sát.
- Bỏ tệp tạm, bộ nhớ đệm, phụ thuộc có thể cài lại và tệp LaTeX trung gian.
- Không sao chép .env.local có token Vercel tạm; chỉ giữ .env.example và liên kết project Vercel cục bộ, được Git bỏ qua.

## Kiểm tra

Đã kiểm tra tại thư mục mới ngày 07/11/2026:

| Kiểm tra | Kết quả |
|---|---|
| Cài phụ thuộc | npm ci từ lockfile; dùng được bộ nhớ đệm cục bộ |
| Kiểu dữ liệu và build | Đạt |
| Xử lý hội thoại | 77 ca đạt, 0 lỗi |
| Trình duyệt tại máy | 37 ca đạt, 0 lỗi/bỏ qua/flaky |
| API ẩn danh tại máy | 23 yêu cầu đạt; 6 tệp và 6 trang đọc nguồn truy cập được |
| Báo cáo hoàn chỉnh | 27 trang, toàn bộ vị trí chữ khớp bản nguồn |
| Báo cáo tuần 5 | 2 trang, toàn bộ vị trí chữ khớp bản nguồn |
| Kho nguồn | 127 tệp/trang khớp dấu kiểm; trạng thái thiếu nguồn không đổi |
| Mã/fixture/kiểm thử gốc | 49 tệp giữ nguyên dấu kiểm |
| Source LaTeX và tài liệu tham khảo của hai báo cáo | 21 tệp giữ nguyên dấu kiểm |

Bằng chứng mới: kết quả kiểm chứng (tệp cục bộ/không kèm bản công khai), manifest gộp (tệp cục bộ/không kèm bản công khai). Các kết quả cũ vẫn giữ thời điểm ban đầu. Đây là kiểm tra di chuyển và hồi quy trên fixture, không phải xác nhận nghiệp vụ HUST.

Khôi phục hướng cũ khi cần: giải nén bản dự phòng vào một thư mục riêng để xem, không ghi đè lên bộ HUST đang làm việc.

## Dọn thư mục khảo sát sau khi gộp

Đã lưu thêm bản riêng của thư mục khảo sát tại `${HOME}/Documents/AI Engineer/Star Project/Sao_luu_Khao_sat_2026-11-07/Khao_sat_20261107_192755.tar.gz`. Đã kiểm tra toàn bộ 1251 mục trong bản lưu bằng SHA-256. Bản này giữ cả tài liệu và source lịch sử đã chủ động loại khỏi bộ làm việc chính.

ĐA 2 không phụ thuộc vào thư mục khảo sát để chạy ứng dụng hoặc biên dịch báo cáo. Các liên kết PDF nằm trong ĐA 2. Người dùng có thể chuyển thư mục khảo sát vào Thùng rác; giữ bản lưu nói trên bên ngoài ĐA 2 để phục hồi khi cần. Tệp .env cục bộ chứa thông tin truy cập và bộ nhớ đệm sinh lại được không đưa vào bản lưu.

Chi tiết: kiểm tra trước khi dọn (tệp cục bộ/không kèm bản công khai).
