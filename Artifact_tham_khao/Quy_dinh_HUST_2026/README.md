# Kho khảo sát quy định HUST

Thu thập ngày **02/11/2026** cho chatbot KHCN–TCKH–TCNS, năm thẻ **T1/T3/T4/T6/T10**. Kho nằm trên máy, ngoài ứng dụng demo.

**Trạng thái: đã có kết quả thu thập nguồn công khai, chưa đủ bộ quy chế gốc HUST.** Không dùng số lượng tệp để suy rằng đã đủ căn cứ tư vấn.

## Mở tài liệu

- [Danh mục bổ sung để hoàn thành phạm vi](DANH_MUC_BO_SUNG.md): 10 nhóm / 21 mục, không tính lại tệp đã có và ba bản gốc đang thiếu; [bảng CSV](DANH_MUC_BO_SUNG.csv).
- [28 ca kiểm tra thời gian/chuyển tiếp](BO_CA_THOI_GIAN.md): mới là thiết kế, chưa chạy nghiệp vụ.
- [Cách cập nhật, xác minh và chốt kho](HUONG_DAN_CAP_NHAT_NGUON.md); [kết quả kiểm tra danh mục](metadata/coverage-audit.json).
- Danh mục có ô tìm kiếm (tệp cục bộ/không kèm bản công khai): mở bằng trình duyệt, lọc số hiệu/tên/thẻ và mở tệp.
- [Danh mục Markdown](DANH_MUC_TEP.md) hoặc [CSV mở bằng Excel](DANH_MUC_TEP.csv).
- [Ma trận 17 nhóm nguồn cần có](MA_TRAN_NGUON_CAN_CO.md): phần đã lấy được, phần thiếu và tiêu chí đủ cho từng thẻ.
- [Danh mục cần xin bản gốc](DANH_MUC_CAN_XIN_BAN_GOC.md): chia theo KHCN, TCKH, TCNS và Văn phòng.
- [Nhật ký khảo sát](NHAT_KY_KHAO_SAT.md) và [phạm vi/nguyên tắc](PHAM_VI_VA_NGUYEN_TAC.md).

## Cấu trúc và cách đọc

| Vị trí | Nội dung |
|---|---|
| `originals/` | Tệp tải nguyên byte: PDF, DOCX và RAR. Mã tệp ổn định theo URL; tên tài liệu đầy đủ ở danh mục. |
| `pages/` | Bản chụp trang nguồn/danh mục/sitemap để kiểm lại nguồn gốc. Không đếm chúng thành quy chế. |
| `text/` | Bản trích chữ, có thể rất ít chữ nếu PDF chỉ là ảnh quét. |
| `text_ocr/` | Chữ nhận dạng tiếng Việt, có trang PDF để tìm lại. Chưa soát toàn văn; bảng, số tiền và ngày viết tay có thể sai. |
| `unpacked/` | Ba tệp bên trong gói phụ lục TT 15/2024 từ HUST; không tính thêm thành ba lượt tải/quy chế mới. |
| `metadata/` | URL, trang gốc, ngày thu thập, SHA-256, số trang, bản trùng, nguồn lỗi, kết quả kiểm toán và phạm vi xác minh. |

Các tệp hiện vẫn giữ trạng thái `unverified_original`: đã thu thập/đối chiếu một số thông tin thư mục và trang cụ thể, chưa hoàn thành xác minh điều kiện áp dụng tại HUST và quyền dùng trên demo. Các trường chưa biết được để trống.

## Phần thiếu quyết định tiến độ

Ba bản cần trước: **quy định nhiệm vụ KHCN&ĐMST 2026** (tên gọi “4411/2026” chưa được kiểm số/ngày ký), **QCCTNB 1616/QĐ-ĐHBK** và **QC Công tác cán bộ 1606/QĐ-ĐHBK**, đủ quyết định/phụ lục/mẫu và sửa đổi. Hai số 1616/1606 đã có văn bản HUST khác dẫn chiếu, nhưng chưa có toàn văn ba quy chế.

Ngoài ra cần quy chế quản lý tài chính, tổ chức/hoạt động, hướng dẫn chuyên môn, nguồn đơn vị và chuyển tiếp theo ma trận. Chưa tìm thấy bản công khai không có nghĩa HUST không có tài liệu. Cần chủ nội dung cung cấp đúng bản đang áp dụng; không dùng tài liệu phân tích của thầy thay bản gốc.

Phạm vi hoàn thành chốt ngày 02/11/2026: năm nhóm T1/T3/T4/T6/T10 và nhánh phụ thuộc; chưa cam kết sở hữu trí tuệ/hợp tác. Không phải thu mọi bản lịch sử ngay bây giờ: thu đúng phiên bản khi nhiệm vụ đang thực hiện, nghĩa vụ kéo dài hoặc giấy tờ tồn đọng cần chúng. Danh mục chưa đóng chỉ vì có tệp tải về hoặc bot biết dừng.

Thống kê kiểm chứng mới nhất: [stats.json](metadata/stats.json). Báo cáo tổng hợp được đặt ở `Artifact_De_tai_chinh/10_KHAO_SAT_VA_THU_THAP_QUY_CHE_HUST_2026-11-02.md`.
