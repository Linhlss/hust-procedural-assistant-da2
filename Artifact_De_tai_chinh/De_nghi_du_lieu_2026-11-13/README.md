# Hai bản đề nghị cung cấp dữ liệu

Hai PDF gửi người hướng dẫn được đặt tại `output/pdf/` của project:

- `Danh_muc_tai_lieu_can_bo_sung.pdf`: văn bản, phụ lục, biểu mẫu và hướng dẫn còn thiếu; có tóm tắt phần đã thu. Bản bàn giao: 10 trang.
- `De_nghi_cung_cap_FAQ_va_vuong_mac_thuc_te.pdf`: FAQ, trao đổi thực tế, mức thường gặp, điểm khó/dễ sai và thông tin xác nhận; mẫu cung cấp là tùy chọn. Bản bàn giao: 5 trang.

## Sửa và tạo lại

Nguồn chính là `build_pdfs.py`. Sửa các chuỗi nội dung trong `REQUESTS`, `SCOPE_ROWS`, `HAVE_ROWS`, `FAQ_GROUPS`, `FAQ_FIELDS`, `PRIORITY_ROWS`, cùng hai hàm `document_request()` và `faq_request()`. Sau đó chạy từ thư mục này:

```sh
${HOME}/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 build_pdfs.py
```

Lệnh mặc định ghi lại đúng hai PDF trong `output/pdf/`, xuất hai bản Markdown để đọc nội dung và bảng đối chiếu `coverage-crosswalk.json`. Các bản Markdown được xuất từ mã nguồn, không phải đầu vào biên dịch.

Môi trường cần ReportLab và font Times New Roman có trên máy Mac. Nếu dùng môi trường khác, điều chỉnh đường dẫn font trong `register_fonts()`; nội dung và bố cục A4 không phụ thuộc API mô hình.

## Đối chiếu và kiểm tra

- `coverage-crosswalk.json` đối chiếu 14 mục tuần 6, 21 yêu cầu bổ sung, 17 nhóm nguồn và danh mục bản gốc; các cách phân nhóm có giao nhau, không cộng thành số file.
- Các số phụ lục/biểu mẫu và đầu mối số hiệu chưa kiểm bản ký được giữ là tham chiếu cần xác nhận.
- Yêu cầu FAQ/tình huống được đặt trong PDF thứ hai. PDF thứ nhất chỉ xin tài liệu và thông tin nhận diện, hiệu lực, phạm vi, đầu mối, quyền dùng.
- `verification.json` ghi kết quả kiểm văn bản, font nhúng, kích thước trang, giới hạn bố cục, tính toàn vẹn tệp cũ và việc xem ảnh của đủ 15 trang.
- Khi sửa nội dung, cần tạo lại, render và kiểm những trang thay đổi. Không sửa dữ liệu nguồn, báo cáo, Excel hay mã chatbot để tạo hai PDF này.

Các danh mục cũ vẫn được giữ nguyên để đối chiếu lịch sử; trạng thái chưa nhận/chưa xác minh không được tự nâng thành hoàn thành.

## Lần cập nhật hiện tại

- Đã bỏ hai dòng ngày lập trong PDF; giữ các mốc nghiệp vụ cần để xác định phiên bản và đợt áp dụng.
- Bản tài liệu gọi rõ hướng dẫn điền và ví dụ mẫu đã ẩn danh; mẫu xác nhận/đề xuất, giải trình điều chỉnh, đề nghị/quyết định cử đi, kế hoạch/dự toán; kế hoạch đào tạo theo chương trình/đợt; hướng dẫn minh chứng nghiệm thu; hướng dẫn thao tác hệ thống cho cả năm nhóm.
- Các thành phần bổ sung chỉ xin nếu đang áp dụng và chưa có đầy đủ trong bộ gốc; không khẳng định mỗi thành phần là một file riêng.
- Bản FAQ giữ nguyên nội dung, chỉ bỏ dòng ngày lập. Hai PDF vẫn tách riêng tài liệu quy định với câu hỏi/vướng mắc thực tế.
- Đã kiểm 15 trang cuối bằng ảnh render, font nhúng, dấu tiếng Việt, bảng, lề và ngắt trang. Danh mục đủ khung để gửi xin; chỉ sau khi nhận bản gốc và kiểm phụ lục, biểu mẫu, dẫn chiếu mới chốt được tệp còn thiếu.
