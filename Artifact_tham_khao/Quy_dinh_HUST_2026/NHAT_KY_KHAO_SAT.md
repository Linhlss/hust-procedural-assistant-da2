# Nhật ký khảo sát nguồn công khai

Phiên thu thập: 02/11/2026. Các bản chụp trang và kết quả tải có URL, thời điểm UTC, mã băm trong `metadata/downloads.json`. Nhật ký này tổng hợp phương pháp và kết quả tra cứu, không phải bản ghi tự động đầy đủ từng truy vấn của công cụ tìm kiếm.

## Điểm xuất phát

Đã đọc requirement, báo cáo tiến độ 02, AGENTS và skill `hust-demo-scope`/hợp đồng nguồn. Đã kiểm kê PDF/DOCX trong workspace ngoài ứng dụng và thư mục kết quả: chỉ thấy hai tài liệu phân tích thầy gửi, chưa thấy ba bản quy chế gốc 2026. Không mở lại các hướng khảo sát đã tạm dừng.

## Tìm kiếm theo nhóm

| Nhóm truy vấn đã thử | Kết quả quyết định bước tiếp |
|---|---|
| `site:hust.edu.vn "4411" "2026"`; tên đầy đủ “xét chọn, thực hiện và đánh giá nhiệm vụ”; số 5299/2023 | Chưa tìm thấy đúng bản 2026/2023. Trang cũ về xét chọn đề tài cơ sở dẫn QĐ 352/2020; giữ URL khảo sát, không nhập thành quy định mới. |
| `site:hust.edu.vn "1616" "chi tiêu"`; tên đầy đủ QCCTNB, bản 2025/2026 | Tìm thấy QĐ 2102 học bổng NCS và QĐ 3040 Ban biên tập dẫn số/ngày 1616. Tải để kiểm số hiệu; chưa có bản quy chế. |
| `site:hust.edu.vn "1606" "cán bộ"`; tên QC CTCB, 1471/2025, 1218/2024 | Tìm được dẫn chiếu 1606 trong QĐ 3040. Các kết quả công khai cũ/khác lĩnh vực không thay bản cần thu thập. |
| NQ 04/2024, NQ 40/2024; sửa đổi NQ 11/NQ 32/2025; QĐ 9768/2023 | Tìm được trang chức năng các Ban và dẫn chiếu NQ 04/40 trong QĐ ngân sách 658/2026. Chưa có toàn văn các quy chế nền và sửa đổi. |
| Website trường thuộc: SoICT, Vật liệu, Cơ khí, Điện–Điện tử, Kinh tế, Hóa & KHSS; “chi tiêu nội bộ”, “biểu mẫu”, “quy chế”, “cán bộ” | Đã lưu trang chủ và lần theo kho tải xuất hiện trong menu. Kho Vật liệu/Cơ khí không hiện tệp quy chế cần tìm; Hóa & KHSS chủ yếu tài liệu sinh viên/đào tạo. Chưa có QCCTNB đơn vị tải được. Đây là khảo sát các điểm vào công khai, không phải tuyên bố đã duyệt mọi trang mọi khoa. |
| “cử cán bộ”, “đi học/nghiên cứu/công tác nước ngoài”, “TCCB”, “biểu mẫu” | Có trang trao đổi cán bộ, thông tin chương trình và đầu mối; chưa có đủ bộ hướng dẫn/mẫu TCNS hiện hành cho T10. Không tải hồ sơ tuyển dụng/cá nhân từ kết quả lạc phạm vi. |
| Tìm cập nhật HUST cuối 10–đầu 11/2026 | Tìm thông báo kế hoạch ban hành hệ thống quy chế và triển khai quy trình tài chính; chưa tìm thấy quyết định quy chế mới đính kèm. Tin tức không chứng minh văn bản đã ký và có hiệu lực. |
| Căn cứ Nhà nước theo danh mục HUST và tài liệu thầy gửi | Tải luật/NĐ/TT phụ thuộc từ cổng Chính phủ hoặc cơ quan Nhà nước; tìm cả bản sửa đổi/thay thế. Phát hiện TT 140/2025 thay TT 102/2012 và các điều khoản chuyển tiếp cần giữ. |

Một số truy vấn quá chặt trả kết quả lạc sang số thứ tự, trường khác hoặc tài liệu cá nhân; các kết quả đó bị loại khỏi kho nguồn nghiệp vụ. Không lấy tên trường “Bách khoa” hay trùng số quyết định làm bằng chứng cùng cơ quan.

## Kiểm tra danh mục chính thức

Đã đọc `robots.txt` HUST trước khi thu thập; chỉ đi các đường công khai. Sitemap gốc liên kết nhiều module; chọn các module liên quan thay vì tải cả trang sinh viên/tuyển sinh ngoài phạm vi.

| Sitemap HUST đã tải | Số URL trong phản hồi |
|---|---:|
| `sitemap-vi.van-ban.xml` | 0 |
| `sitemap-vi.nghien-cuu.xml` | 587 |
| `sitemap-vi.tai-chinh.xml` | 4 |
| `sitemap-vi.tai-chinh-dai-hoc.xml` | 22 |
| `sitemap-vi.about.xml` | 8 |
| `sitemap-vi.co-cau-to-chuc-bai-viet.xml` | 27 |
| `sitemap-vi.news.xml` | 1000 |
| `sitemap-vi.su-kien-noi-bat.xml` | 562 |
| `sitemap-vi.hop-tac-doi-ngoai.xml` | 177 |

Tổng 2.387 mục URL trong chín phản hồi; không phải 2.387 tài liệu đã đọc. Sitemap news dừng ở 1.000 mục nên không được dùng để chứng minh đã bao phủ toàn bộ lịch sử. Đã đọc cả 5 trang danh mục `vi/news/van-ban-quy-che/`; nội dung chủ yếu cũ. `vi/van-ban/` chưa hiện danh sách văn bản cần tìm. Đường dẫn `vi/download/` của website chính trả 404; không coi đó là thiếu văn bản trong hệ thống nội bộ.

Từ sitemap nghiên cứu, lọc được 13 thông báo đề xuất/tuyển chọn/hướng dẫn thuộc đề tài/chương trình, đã lưu vào `metadata/sitemap-candidates.json` và tải các file đính kèm công khai. Không tự tải các văn bằng sáng chế, danh sách hồ sơ cá nhân hay toàn bộ tuyển sinh để tăng số lượng.

## Lỗi tải và chất lượng đã xử lý

- Các tệp đính kèm qua `?download=1&id=…` có URL `.html` nhưng dữ liệu là PDF/DOCX/RAR. Bộ thu thập kiểm tra định dạng thực, giữ byte và SHA-256. Đã sửa phân loại các tệp phát hiện nhầm lúc đầu.
- Ba tệp từng thiếu bản ghi do tác vụ tải đồng thời đã được đối chiếu URL/mã băm và bổ sung lại. Bộ thu thập hiện dùng khóa tệp khi cập nhật chỉ mục. Kiểm toán cuối phải kiểm cả tệp không có bản ghi và bản ghi trỏ tệp không có.
- Nhiều PDF là ảnh quét, chỉ trích được chuỗi ký số hoặc vài chục chữ. Đã tạo OCR tiếng Việt riêng cho nhóm văn bản nền/phụ thuộc; OCR không được coi là nguyên văn đã soát.
- Cổng `vbpl.moj.gov.vn` không phân giải được tại lần tải; liên kết PDF `vbpl.vn/.../177573/VanBanGoc_12.TT.pdf` trả 404. Trang `vbpl.vn` trả HTTP 200 nhưng chỉ là khung chờ tải dữ liệu. Các trạng thái được giữ, không tính là đã lấy nội dung.
- TT 12/2025 được tải thay từ trang cơ quan quản lý hàng không `maa.gov.vn`; ảnh trang có dấu chìm Thư Viện Pháp Luật, đã ghi rõ là bản đăng lại.
- Link CDN Công báo của TT 44/2026 lỗi chứng chỉ tại lần thử; đã tải thành công bản từ cổng văn bản Chính phủ. Không tắt kiểm tra chứng chỉ để vượt lỗi.
- TT 71/2018: trang đăng lại VKIST ghi mốc “ngày hiệu lực” khác Công báo. Chưa tự chọn metadata của trang đăng lại làm hiệu lực chính thức.

## Kết quả kiểm toán phạm vi hiện tại

Đã có nguồn pháp lý phụ thuộc và các thông báo/biểu mẫu của một số nhánh. Chưa thu thập đủ bộ quy chế HUST theo `MA_TRAN_NGUON_CAN_CO.md`, đặc biệt H01/H03/H04 và các phụ lục, hướng dẫn riêng, nguồn đơn vị. Cần đường dẫn hoặc bản gốc từ chủ nội dung; chưa có bằng chứng cho phép kết luận công việc đã hoàn tất.

## Rà soát bổ sung sau phản hồi của người dùng

Người dùng cho biết không biết vị trí ba bản gốc. Đã kiểm tra thêm danh mục tiếng Anh Research Ethics, Policies and Guidelines (31/01/2021) của HUST; liên kết nhiệm vụ vẫn là QĐ 352/2020, không phải bản 2026. Các truy vấn bổ sung theo bkoffice/eHUST và số/tên quy chế không cung cấp thêm bản gốc công khai. Không đăng nhập hoặc truy cập hồ sơ nội bộ.

Đã tìm tên tệp PDF/DOCX/DOC/ZIP/RAR có số hiệu/từ khóa quy chế liên quan trong Downloads và Desktop; không có kết quả phù hợp. Không mở các tệp cá nhân không liên quan.

## Triển khai danh mục bổ sung theo phạm vi đã chốt

Ngày 02/11/2026: người làm đề tài chọn năm nhóm T1/T3/T4/T6/T10 và nhánh phụ thuộc; lịch sử theo nhiệm vụ đang thực hiện, nghĩa vụ kéo dài và giấy tờ tồn đọng. Đã tạo 10 nhóm / 21 yêu cầu, sổ xác minh 45 nội dung, bốn điểm chờ giải thích và 28 ca thiết kế thời gian. Không có mục nào được đóng bằng suy đoán.

Đã tìm bổ sung 11 truy vấn có mục tiêu; xem `metadata/search-followup-2026-11-02.json`. Chưa lấy thêm bản gốc cần thiết. Tải thêm trang đầu mối Văn phòng–Ban–Trung tâm thành công sau lần lỗi phân giải tên miền; giữ 127 bản ghi tệp/trang tải có đường dẫn. Loại kết quả khác trường, quyết định cá nhân, thông báo học bổng sinh viên và bản cũ chưa có phụ thuộc. Không đăng nhập hệ thống HUST hoặc gửi thư.

Tham chiếu hiện hành: [Danh mục bổ sung](DANH_MUC_BO_SUNG.md), [hướng dẫn chốt kho](HUONG_DAN_CAP_NHAT_NGUON.md), [kiểm tra danh mục](metadata/coverage-audit.json). Chưa đủ kho nguồn; kiểm tra cấu trúc không phải kiểm tra chính sách.
