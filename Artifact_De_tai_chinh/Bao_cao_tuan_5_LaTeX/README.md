# Báo cáo tiến độ tuần 5

Source chính: main.tex. Bản biên dịch chính: main.pdf.

Mở Bien_dich.command để biên dịch và xem báo cáo. Công cụ cần MacTeX hoặc TeX Live có XeLaTeX và latexmk. Phông Latin Modern Roman, cỡ thân bài 12 pt, lề và cách chia mục giữ theo bản tuần 4.

Biên dịch không tự mở cửa sổ PDF:

    ./Bien_dich.command --no-open

Tuan5_Student.pdf ở thư mục khảo sát là liên kết tới main.pdf trong thư mục này. Khi biên dịch lại, bản bàn giao cập nhật theo cùng source. Nếu cần mang sang máy khác, sao chép thư mục source; main.pdf là tệp PDF thực.

## Căn cứ nội dung

- Mốc đối chiếu: Tuan4_Student.pdf, ghi nhận thiết kế và chưa cài đặt/demo.
- Kết quả kỹ thuật: Artifact_De_tai_chinh/09_BAO_CAO_TON_DONG_VA_CAI_THIEN_DEMO_T6.md và demo-hust/artifacts/demo-runs/robustness-production-2026-10-28/ACCEPTANCE.md. Ngày kiểm chứng: 28/10/2026.
- Kết quả dữ liệu: Artifact_De_tai_chinh/11_TRIEN_KHAI_DANH_MUC_DU_LIEU_BO_SUNG_2026-11-02.md và Artifact_tham_khao/Quy_dinh_HUST_2026/metadata/coverage-audit.json. Ngày cập nhật: 02/11/2026.

Các số liệu là kết quả đã lưu, không phải số ca mới tạo trong lúc soạn báo cáo. 28 ca thời gian/chuyển tiếp mới ở mức thiết kế, chưa chạy kiểm chứng nghiệp vụ. Nguyên mẫu T6 dùng nguồn mẫu tự tạo và chưa chạy mô hình ngôn ngữ thật.

## Đối chiếu các ví dụ cụ thể trong bản biên tập

- F01: R03-h trong demo-hust/tests/robustness-cases.ts; câu hỏi hội thảo chưa có dữ kiện dẫn tới hỏi nguồn kinh phí.
- F02 và F05: D01 trong demo-hust/tests/behavior.test.ts; đối chiếu nguồn KHCN/TCKH và kiểm tra đoạn nguồn, lý do, bước tiếp theo.
- F03 và F04: D03 trong demo-hust/tests/behavior.test.ts; thay hoàn toàn nguồn nhiệm vụ bằng nguồn đơn vị, rút kết luận nhiệm vụ, giữ phần công tác và dừng đúng phần thiếu nguồn.
- Ba ví dụ sửa lỗi: R01-a, R05-c, R03-a/R03-b trong demo-hust/tests/robustness-cases.ts. Ngày sai 31/02/2026 cũng có trong ca kiểm thử riêng ở behavior.test.ts.
- Bộ 34 ca trước–sau/biến thể là một phần của tổng 77 ca xử lý; số liệu đối chiếu tại báo cáo kỹ thuật ngày 28/10/2026, không cộng thêm vào tổng.
- Ví dụ nguồn: source-register.json có mẫu đăng ký và thuyết minh nhiệm vụ cấp Bộ; DANH_MUC_BO_SUNG.md, nhóm G02, vẫn yêu cầu hướng dẫn nhiệm vụ cấp Đại học.

Đợt biên tập chỉ sửa nội dung báo cáo và biên dịch lại; không chạy thêm ca kiểm thử ứng dụng hoặc thay đổi nguyên mẫu.

## Hạn chế và kế hoạch tiếp theo

Hạn chế về phạm vi, nguồn/đáp án và xử lý ngôn ngữ được gom cuối mục 5. Mục 6 nêu bốn đầu việc tiếp tục: bổ sung tài liệu mấu chốt, chuẩn hóa/kiểm chứng T6, tinh chỉnh giao diện và tích hợp mô hình/mở rộng nội dung. Các việc này chưa được ghi nhận là đã hoàn thành.

Đầu trang chỉ giữ tên đề tài. Bảng kiểm thử ở cuối trang đầu; ví dụ sửa lỗi, chuẩn bị dữ liệu, hạn chế và kế hoạch nằm ở trang sau. Phông, cỡ chữ, lề và sáu mục giữ như bản trước.
