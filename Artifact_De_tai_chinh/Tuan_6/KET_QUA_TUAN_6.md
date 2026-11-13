# Tổng hợp tuần 6 — cập nhật 11/11/2026

Tuần 6: 09–15/11/2026. Ghi kết quả đã có, không tính kế hoạch thành kết quả. Phần chuẩn bị 07–08/11 được tách riêng.

## 1. Kết quả trong tuần

**Tìm lịch sử:** tìm trong tên, câu hỏi/phản hồi, thay đổi, dữ kiện và căn cứ; có/không dấu, đ/d, nhiều từ, số kết quả, trích đoạn và đánh dấu khớp. Mở/xóa/khôi phục giữ đúng cuộc và bộ lọc trên desktop/điện thoại.

**Nhập dữ kiện trực tiếp:** Bổ sung/Sửa hoạt động, địa điểm, ngày, nguồn, quan hệ và phân định. Có rút dữ kiện, `false` khác chưa biết, Hủy/Escape/Thử lại; giữ draft và không tự cuộn. Máy chủ kiểm và xử lý bằng mã, không gọi mô hình.

**Gemini trên Vercel:** đã trích dữ kiện và soạn phản hồi thật từ kết luận/nguồn được cấp. Phiên bản sửa dùng thao tác giữ/gán/rút kèm lời khai, chặn suy ra quan hệ từ nguồn tiền, giữ dữ kiện không liên quan khi đổi nguồn. Có kết luận thiếu căn cứ định mức, kiểm nguồn/đầu ra, timeout/hủy và không fallback âm thầm. Key chỉ ở Vercel, Free Tier, không billing. Không gọi Ollama trong đợt này.

**Trạng thái chia sẻ:** URL chính https://hust-t6-demo.vercel.app hiện dùng **fixture**. Bản Gemini https://hust-t6-demo-1d0bcxgl4-linhozz.vercel.app, `dpl_GYYrBcA9DAKcRsdbS9kbrGKtccCZ`, trace=0. Gemini chưa đạt gate công khai: hai câu định mức mới vẫn bị kiểm đầu ra từ chối (GEMINI_SCHEMA). Giữ public fixture; không fallback âm thầm và không gọi là đã phát hành Gemini.

## 2. Kiểm chứng

| Hạng mục | Kết quả thực tế |
|---|---|
| Mã / kiểu dữ liệu | 156/156 ca mã; typecheck đạt; candidate Vercel READY |
| Trình duyệt Vercel | Vòng fixture trước: 16/16; lượt cuối: 8 ca đạt theo bằng chứng, không cộng vòng lặp |
| API | Fixture 36/36 đã lưu; lượt cuối 36 yêu cầu đạt, ghi riêng chế độ trong bằng chứng |
| API typed Gemini | 13/13; không có phase model; hai yêu cầu sai bị từ chối đúng |
| Bộ cũ: fixture / Gemini 3.5 | 15/20, 33/39 / 12/20, 26/39 |
| Giữ riêng: fixture / Gemini 3.5 | 12/20, 19/28 / 16/20, 24/28 |
| Đọc nội dung Gemini | 24/39 lượt bộ cũ và 20/28 lượt giữ riêng đủ năm tiêu chí; chưa phải chuyên viên xác nhận |
| Vòng 3.1 sau sửa | 12 hội thoại/20 lượt: 1 HTTP 200 sai phạm vi, 11 lỗi, 8 lượt phụ thuộc chưa chạy |
| Vòng 3.5 mới sau sửa | 3/4 hội thoại, 5/8 lượt đạt tự động; một lỗi dịch vụ, hai lượt phụ thuộc chưa chạy |
| Smoke candidate cuối | Đổi nguồn đạt; ngày và định mức lỗi dịch vụ. Không thay bằng phản hồi giả |

Các vòng khác nhau không cộng thành số ca độc lập hoặc tỷ lệ chính xác chung. Bộ cũ có câu mở đầu lặp; bộ mới tự biên soạn, chưa có số liệu chứng minh là phân bố câu hỏi thường gặp. Điểm tự động chỉ kiểm các trường/kỳ vọng; rà nội dung còn phát hiện mất dữ kiện không được nhắc lại trong kỳ vọng cũ, dẫn nguồn không hỗ trợ câu và trả lời lệch nhu cầu.

[Biên bản đầy đủ](../../demo-hust/docs/GEMINI_VERCEL_2026-11-10.md) · [bằng chứng tuyển chọn](../../demo-hust/docs/evidence/week6/README.md) · [câu hỏi](BO_CAU_HOI_T6_GEMINI_2026-11-10.md) · [rà kế hoạch](../../demo-hust/docs/AUDIT_HAI_KE_HOACH_2026-11-11.md).

## 3. Những sửa đổi dựa trên lỗi thực

- Bỏ suy ra `related=true` khi chỉ nói dùng tiền đề tài và `allocation=true` khi chỉ nói hai nguồn cùng chi.
- Không rút quan hệ nhiệm vụ chỉ vì chuyển sang nguồn đơn vị; máy chủ tự bỏ điều kiện không còn áp dụng.
- Một thao tác cho mỗi trường, có đoạn lời khai hỗ trợ; ngày không tồn tại không giữ ngày cũ như kết luận mới.
- Hỏi căn cứ sau đổi năm giữ điều kiện và phiên bản áp dụng. Phân biệt đăng ký dự hội thảo với đăng ký nhiệm vụ.
- Câu hỏi mức chi có kết luận chưa đủ căn cứ từ máy chủ; không diễn giải phạm vi nguồn thành được chi một số tiền.
- Công cụ lưu request dùng snapshot, không giữ chung mảng tin nhắn. Bản replay sai được lưu, các bằng chứng cũ không ghi đè.

Các sửa đổi mã qua kiểm thử; những hành vi chưa kiểm chứng được với API thật do dịch vụ vẫn được ghi còn chờ.

## 4. Bằng chứng lịch sử và chuẩn bị trước tuần

Ollama tại máy là đợt trước, không chạy mới: vòng gần nhất cũ 6/20 hội thoại, 14/39 lượt; chấm lại phát hiện dữ kiện tự thêm còn 4/20, 9/39. Fixture 15/20, 33/39. Giữ nguyên các kết quả cũ, không thay bằng điểm Gemini.

Chuẩn bị 07–08/11 gồm phiếu 14 mục, 9 điều kiện ứng viên, 5 vị trí OCR và 11 ca T6 nghiệp vụ; phiếu chưa gửi, chưa nhận thêm nguồn hoặc đáp án chuyên viên. Stitch, animation và sidebar đã làm trước tuần 6, không ghi thành xây mới kỳ này. 11 ca nghiệp vụ chưa chạy/được xác nhận.

## 5. Hạn chế và công việc còn lại

1. Gemini chưa đạt gate công khai: hai câu định mức mới vẫn bị kiểm đầu ra từ chối (GEMINI_SCHEMA). Giữ public fixture; không fallback âm thầm và không gọi là đã phát hành Gemini.
2. Runtime chỉ T6, nguồn tự tạo. Ba bản gốc nền tảng, hướng dẫn/chứng từ đúng đơn vị, hiệu lực/quyền dùng và đáp án chuyên viên còn thiếu. T1/T3/T4/T10 chưa triển khai.
3. Bộ giữ riêng đã dùng để tìm lỗi thì không tiếp tục gọi nó là chưa thấy. Mọi vòng sửa/chạy lại và câu mới được ghi phiên bản riêng; không thay kỳ vọng để tăng điểm.
4. Sau kỹ thuật, bổ sung nguồn và chuyên viên, rồi mở các nhóm thủ tục còn lại theo phạm vi đã chốt.

## 6. Báo cáo tuần 6

PDF hai trang (tệp cục bộ/không kèm bản công khai) · [source LaTeX](../Bao_cao_tuan_6_LaTeX/main.tex) · [lệnh biên dịch](../Bao_cao_tuan_6_LaTeX/Bien_dich.command). Đầu trang chỉ có tên đề tài; không in ngày hoặc họ tên. PDF biên dịch từ đúng source. Báo cáo hoàn chỉnh, tuần 4–5 và Excel không đổi.

## 7. Cập nhật sau lượt lịch 06:00

Đã sửa kiểm nguồn đơn/kết hợp, rút dữ kiện, ngày khi tra căn cứ và bộ kiểm diễn giải. 156 unit và typecheck đạt. Hai câu định mức mới sau lọc ngữ cảnh: 0/2 lượt đạt tự động; đọc nội dung riêng, không dùng làm độ chính xác thực tế. Các vòng R/S/T/U/V giữ nguyên lỗi và điểm trong bảng bằng chứng. Gemini chưa đạt gate công khai: hai câu định mức mới vẫn bị kiểm đầu ra từ chối (GEMINI_SCHEMA). Giữ public fixture; không fallback âm thầm và không gọi là đã phát hành Gemini.
