# Bằng chứng tuyển chọn tuần 6

Tất cả câu hỏi và nguồn runtime ở đây là tự biên soạn. Không có key/token, tài liệu thầy hoặc dữ liệu nghiệp vụ cá nhân. Các tệp API là phản hồi nhận được qua Vercel; không phải log provider thô. Repo giữ bản tuyển chọn nhỏ để đối chiếu; ảnh/video, log và các vòng lịch sử còn nguyên trong `artifacts/` tại máy và được Git bỏ qua.

- `SUMMARY.json`: số liệu tính từ từng lượt, tách lỗi và lượt phụ thuộc chưa chạy.
- `legacy-*` và `heldout-*`: hai bộ đối chứng nguyên trạng; không thay điểm sau sửa.
- `manual-content-review.json`: đọc 54 phản hồi API theo năm tiêu chí, chưa phải chuyên viên xác nhận.
- `validation-3.1.json`: 12 hội thoại/20 lượt sau vòng trước; chất lượng không đủ đánh giá do dịch vụ lỗi, một phản hồi nhận sai phạm vi.
- `verification-3.5.json`: bốn câu chuyện mới, đóng băng trước chạy; không gộp với bộ cũ.
- `targeted-regression.json`: ca đã xem chạy lại để sửa lỗi, không phải heldout mới.
- `candidate-smoke.json`: ba kiểm tra trên candidate trước, trace đã tắt; còn hai lỗi dịch vụ nên chưa promote.
- `typed-gemini-api.json`: 13 yêu cầu nhập có kiểu/kiểm đầu vào, không có bước gọi mô hình.

`automaticPassedTurns` không tương đương câu trả lời tư vấn đúng hoàn toàn. Bộ cũ chưa bắt đủ trường hợp làm mất dữ kiện không được nhắc lại trong kỳ vọng của lượt mới; lỗi L10 được ghi thêm ở rà nội dung, không sửa điểm lịch sử. Không dùng các tỷ lệ này làm độ chính xác HUST hoặc bằng chứng câu hỏi thường gặp thực tế.

- `candidate-final-targeted.json`: hai ca ngày/định mức trên deployment cuối trả HTTP 200; lỗi vòng trước giữ nguyên.
- `public-fixture-final-checks.json`, `public-fixture-api-final.json`, `public-fixture-typed-final.json`: 16 ca UI và 36 yêu cầu API kiểm lại bản source cuối; không cộng với vòng cũ thành ca độc lập.

Các tệp `release-first`, `safety-first`, `control-first`, `final-affected-first`, `contact-first` giữ nguyên các vòng trước sửa; `rate-focused-final` là hai câu mới kiểm lỗi ngữ cảnh định mức. Xem SUMMARY để tách API lỗi, lượt chưa chạy và điểm tự động. Không có log provider thô, tài liệu thầy hay secret.
