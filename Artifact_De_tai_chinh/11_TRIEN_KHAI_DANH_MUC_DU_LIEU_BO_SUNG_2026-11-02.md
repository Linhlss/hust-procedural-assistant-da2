# Triển khai danh mục dữ liệu bổ sung — 02/11/2026

## Phạm vi được người làm đề tài xác nhận

Năm nhóm T1/T3/T4/T6/T10 cùng nhánh phụ thuộc là phạm vi hoàn thành hiện tại. Chưa cam kết sở hữu trí tuệ/hợp tác; khoảng 12 thẻ trước đây là ước lượng, không phải chỉ tiêu mở rộng nội dung. Không mở lại tuyển dụng, kNC, hồ sơ cá nhân, xử lý/duyệt hồ sơ hoặc thanh toán. Chốt phạm vi này không thay xác nhận chính sách hay chấp thuận vận hành của HUST.

Lịch sử được thu theo nhiệm vụ đang thực hiện, nghĩa vụ kéo dài hoặc giấy tờ tồn đọng và chuyển tiếp. Không gom mọi quy định cũ ngay bây giờ, không tự chọn năm bắt đầu, không suy giấy tờ chờ lâu phải dùng bản cũ.

## Kết quả đã tạo

- [Danh mục 10 nhóm / 21 mục bổ sung](../Artifact_tham_khao/Quy_dinh_HUST_2026/DANH_MUC_BO_SUNG.md), có thời điểm cần, đầu mối, điều kiện kích hoạt, tiêu chí đủ và trạng thái; [bản CSV](../Artifact_tham_khao/Quy_dinh_HUST_2026/DANH_MUC_BO_SUNG.csv). Không đếm lại tệp đã có hoặc ba bản gốc; ba bản gốc vẫn là phụ thuộc bắt buộc.
- [Sổ xác minh nguồn](../Artifact_tham_khao/Quy_dinh_HUST_2026/metadata/source-register.json) cho 45 nội dung khác nhau trong 51 lượt tải: gộp bản trùng, giữ đường dẫn/URL, phân biệt ngày công bố với ngày xác minh, sửa đổi/chuyển tiếp, đối tượng/đơn vị và quyền dùng. Hiện chưa tự nâng nguồn nào thành đã xác minh.
- [Đầu mối và bốn điểm cần làm rõ](../Artifact_tham_khao/Quy_dinh_HUST_2026/metadata/content-review.json): mốc nghiệm thu, khoán/đoàn ra, nguồn kết hợp, chuyển tiếp/giấy tờ tồn. Chưa có trả lời hoặc xác nhận chuyên viên.
- [28 ca thời gian/chuyển tiếp](../Artifact_tham_khao/Quy_dinh_HUST_2026/BO_CA_THOI_GIAN.md) cho đủ năm nhóm: hiện hành, trước/đúng/sau mốc, nhiệm vụ cũ, nghĩa vụ kéo dài, giấy tờ chờ, sửa ngày, thiếu nguồn và thay đổi loại nhiệm vụ. Đây là ca thiết kế hành vi, chưa có đáp án nghiệp vụ đã duyệt hoặc kết quả chạy.
- [Hướng dẫn cập nhật và chốt kho](../Artifact_tham_khao/Quy_dinh_HUST_2026/HUONG_DAN_CAP_NHAT_NGUON.md), công cụ đồng bộ nguồn/kiểm tra trạng thái, mã băm và cổng chống đóng thiếu nguồn. Chốt kho có dấu kiểm và ngày; cập nhật về sau làm dấu kiểm thay đổi.

## Khảo sát bổ sung thực tế

Đã tìm tiếp 11 truy vấn theo số hiệu, hướng dẫn KHCN, mẫu TCNS, chi tiêu và tài chính; kết quả và quyết định chọn/loại được ghi trong [nhật ký truy vấn](../Artifact_tham_khao/Quy_dinh_HUST_2026/metadata/search-followup-2026-11-02.json). Không tìm được thêm bản gốc chính sách cần thiết trong lượt này; không đồng nghĩa chúng không tồn tại.

Tải thêm một [trang danh mục đầu mối HUST](https://hust.edu.vn/vi/co-cau-to-chuc-bai-viet/phong-ban-trung-tam-50716.html), giữ bản chụp, URL, ngày và mã băm. Đây không phải quy chế và không đóng mục nguồn. Trang có liên kết email/địa chỉ không hoàn toàn thống nhất với trang từng Ban, nên chưa chọn làm xác nhận liên hệ hiện hành.

[Tin tập huấn quy trình số](https://hust.edu.vn/vi/news/tin-tuc-su-kien/dai-hoc-bach-khoa-ha-noi-tap-huan-su-dung-quy-trinh-so-656086.html) đã có trong kho chỉ giúp nhận diện bộ phụ lục cần xin, chưa thay thế toàn văn hướng dẫn. Không tải quyết định cá nhân, tài liệu khác trường hoặc gom bản rất cũ chưa có ca phụ thuộc để tăng số lượng.

## Trạng thái và kiểm chứng

Kết quả máy đọc mới nhất: [coverage-audit.json](../Artifact_tham_khao/Quy_dinh_HUST_2026/metadata/coverage-audit.json).

- Đã kiểm tính toàn vẹn 127 tệp nguồn/trang theo bản ghi tải; 45 nội dung tệp chính khác nhau.
- Danh mục có cấu trúc hợp lệ; 0/21 yêu cầu bổ sung đã đóng, ba bản gốc nền tảng vẫn thiếu, 0/28 ca đã đạt kiểm tra nghiệp vụ.
- [13 phép kiểm bộ quản lý danh mục](../Artifact_tham_khao/Quy_dinh_HUST_2026/metadata/coverage-validation-tests.json) đạt: chặn đóng thiếu căn cứ, ngày không tồn tại, gắn xác minh/báo ca đạt sai, nguồn không tồn tại, dấu kiểm sai và quyền nghiên cứu dùng cho bản công khai; kiểm đồng bộ giữ dữ liệu cũ, liên kết và dấu kiểm nguồn thiết kế. Ca hoàn thành giả định chỉ chạy trong bộ nhớ để kiểm cổng, không được ghi vào dữ liệu thật.
- Kho chưa đóng phiên bản nghiệm thu và `collection_complete=false`. Cờ hợp lệ về cấu trúc không phải xác nhận đầy đủ nguồn/chuyên môn.
- Không đổi mã hội thoại, dữ liệu chạy, nhà cung cấp mô hình hoặc triển khai website. Các dữ liệu mới ở ngoài thư mục ứng dụng; chỉ đồng bộ tài liệu phạm vi/danh mục nguồn thiết kế trong demo.

## Phần cần hoàn tất tiếp

Nhận ba bản gốc và kiểm ngay phụ lục; thu hướng dẫn đăng ký/điều chỉnh/nghiệm thu, tài chính, TCNS, quy chế nền và nhánh nguồn đơn vị theo danh mục. Đọc dẫn chiếu để xác định bản thiếu thực sự; bổ sung lịch sử khi có phụ thuộc. Sau đó ánh xạ điều kiện–đoạn nguồn, xác minh hiệu lực/quyền dùng, xác nhận đáp án và chạy ca nghiệp vụ trước khi đóng kho.

Người dùng không cần biết sẵn vị trí tài liệu. Bộ danh mục giúp trao đổi đúng phần còn thiếu với người hướng dẫn/chủ nội dung; chưa có thư hay yêu cầu nào tự gửi đi.
