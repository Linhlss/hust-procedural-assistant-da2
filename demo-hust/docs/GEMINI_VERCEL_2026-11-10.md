# Gemini trên Vercel — kết quả và điểm tiếp tục

## Hiện trạng

Đã kết nối Gemini thật bằng REST, trích dữ kiện và soạn phản hồi; key Secret ở Preview/Production. Automation riêng `hust-t6-demo` được người dùng cấp, CLI quản lý token. Không bật billing hoặc mua credit. Chỉ dùng câu hỏi/nguồn mẫu được phép. Tất cả hội thoại của đợt này chạy qua Vercel; không gọi Ollama mới.

URL chính https://hust-t6-demo.vercel.app hiện dùng **fixture**. Bản Gemini https://hust-t6-demo-1d0bcxgl4-linhozz.vercel.app, `dpl_GYYrBcA9DAKcRsdbS9kbrGKtccCZ`, trace=0. Gemini chưa đạt gate công khai: hai câu định mức mới vẫn bị kiểm đầu ra từ chối (GEMINI_SCHEMA). Giữ public fixture; không fallback âm thầm và không gọi là đã phát hành Gemini.

## Mã đã hiện thực

- Trích tin nhắn mới với đầy đủ lịch sử. Mỗi trường dùng một thao tác giữ/gán/rút và đoạn lời khai hỗ trợ; kiểm polarity, ngày thật và nguồn gốc giá trị. Không suy ra quan hệ từ tiền nhiệm vụ hoặc phân định từ hai nguồn cùng chi.
- Engine chọn nguồn/phiên bản và điều kiện. Hỏi căn cứ sau khi sửa năm giữ cả điều kiện và nguồn áp dụng. Thêm kết luận thiếu căn cứ định mức khi các đoạn được chọn không chứa mức chi; không đặt giá tiền mới.
- Gemini diễn đạt từ kết luận/đoạn nguồn hiện hành. Kiểm ID nguồn, một số số liệu và danh mục giấy tờ không được đoạn trích hỗ trợ. Các kiểm tra này không thay kiểm tra ngữ nghĩa.
- Nhập trực tiếp không gọi mô hình. Lỗi/hủy không commit nửa lượt; không fallback âm thầm. Cả lượt tối đa 50 giây, từng pha tối đa 45 giây trong cùng deadline; function 60 giây. 503 retry tối đa một lần; 429 dừng, không retry dồn hay trả phí.
- Lịch sử cũ đọc được; `narrative` và thông tin kiểm dữ kiện tùy chọn được lưu/tìm kiếm. Không đổi nguồn mẫu hoặc thêm nghiệp vụ HUST.

## Kết quả đã chạy

| Bộ | Fixture: hội thoại / lượt | Gemini 3.5: hội thoại / lượt |
|---|---|---|
| Cũ, 20 hội thoại / 39 lượt | 15/20 · 33/39 | 12/20 · 26/39 |
| Giữ riêng, 20 hội thoại / 28 lượt | 12/20 · 19/28 | 16/20 · 24/28 |

Bộ cũ Gemini trả 28 phản hồi, 6 lỗi, 5 lượt phụ thuộc không chạy. Bộ giữ riêng trả 26 phản hồi, 2 lỗi schema. Đọc riêng nội dung: bộ cũ 24/39 lượt đủ cả năm tiêu chí; bộ giữ riêng 20/28. Người rà là Codex, chưa có xác nhận chuyên viên. Giữ nguyên điểm cũ và mọi ca chưa đạt.

Sau đánh giá đã sửa cấu trúc trích xuất, kiểm bằng chứng và định tuyến. Bộ 3.1 mới: 12 hội thoại/20 lượt, 1 HTTP 200 nhận sai phạm vi, 11 lỗi, 8 lượt phụ thuộc không chạy; chưa đủ để đánh giá chất lượng model. Google trả thông báo nhu cầu cao. Model Free 3.1/3.5 đã được xác nhận trên AI Studio; thay model là cấu hình cho từng deployment, không fallback theo từng lượt.

Bốn hội thoại mới với 3.5: 3/4 hội thoại, 5/8 lượt qua kiểm tự động; 1 lỗi dịch vụ, 2 lượt phụ thuộc không chạy. Một diễn giải còn nói lý do về ngày trong khi hỏi nguồn. Hồi quy đã xem V06/V08/V09 được ghi riêng, không gọi là heldout; sau đó bổ sung kết luận định mức. Candidate trước vòng R có 1/3 ca smoke trả thành công, 2 lỗi dịch vụ. Các số này không gộp thành một tỷ lệ chung.

- 156/156 ca mã và typecheck đạt; Vercel candidate READY. Các ca mô hình trong unit là giả lập.
- Browser fixture: 69/75 lần đầu; chạy lại đúng sáu ca mạng/timeout đều đạt. Hai ca hiển thị Gemini dùng mock. Lượt kiểm bản cuối: 16/16 ca features/coverage ở sáng/tối, 1440/390 px; kiểm sửa/rút dữ kiện, draft, tìm/mở/xóa/undo và định mức thiếu nguồn.
- API fixture: 36/36; đã kiểm lại 36/36 trên bản source cuối, không cộng hai lượt thành 72 ca độc lập. API typed trên Gemini: 13/13; hai yêu cầu sai bị từ chối đúng, không có phase model trong yêu cầu thành công.
- MCP trình duyệt xác minh Escape đóng phần nhập, trả focus về nút và giữ draft. 37 tệp bảo vệ, nguồn mẫu, báo cáo cũ và Excel không đổi.

[Chỉ mục bằng chứng](evidence/week6/README.md) · [số liệu](evidence/week6/SUMMARY.json) · [rà hai kế hoạch](AUDIT_HAI_KE_HOACH_2026-11-11.md).

## Chạy lại có kiểm soát

Dùng Node 22 trong `demo-hust`. `scripts/evaluate-vercel.ts` chỉ nhận HTTPS, hỗ trợ suite `legacy`, `context`, `validation`, `verification`, `release`, `safety`, `control`, `final`, `contact`, `rate`. `EVAL_CASE_IDS` lọc ca hồi quy; thư mục kết quả mới cho mỗi phiên bản. Vercel riêng cần `EVAL_TRANSPORT=vercel-cli`, `ALLOW_VERCEL_AUTOMATION=1` và đúng deployment ID đã kiểm. Không lưu token/header.

Cohort và rubric được đóng băng trước lần chạy của từng vòng. Sau khi dùng heldout để sửa, chỉ gọi lần chạy lại là hồi quy; nhóm đánh giá mới phải có câu hỏi khác và được chốt trước. Mọi lỗi trước đó được giữ nguyên.

## Kiểm chứng sau khi tiếp tục lúc 06:00

Các vòng sau đánh giá được giữ riêng; không sửa kỳ vọng hay cộng thành số ca độc lập. R/S/T/U/V là các bản trước sửa, M là kiểm riêng ngữ cảnh định mức sau sửa.

| Vòng / tệp | Hội thoại đạt tự động | Lượt đạt tự động | Lỗi API | Lượt phụ thuộc chưa chạy |
|---|---:|---:|---:|---:|
| release-first | 4/8 | 10/14 | 3 | 0 |
| safety-first | 1/5 | 6/10 | 2 | 0 |
| control-first | 2/5 | 5/9 | 2 | 1 |
| final-affected-first | 2/3 | 4/5 | 1 | 0 |
| contact-first | 0/2 | 0/2 | 2 | 0 |
| rate-focused-final | 0/2 | 0/2 | 2 | 0 |

Các sửa đổi có bằng chứng: yêu cầu giữ/gán/rút gắn lời khai; chặn tự thêm nguồn thứ hai; không đổi unknown thành false trong diễn giải; rút ngày khi tra căn cứ phải hỏi lại; lọc hướng dẫn giấy tờ khỏi câu chỉ hỏi định mức. Câu hỏi cần cả hai phần vẫn giữ hướng dẫn tương ứng. Cho phép hỏi đầu mối về chứng từ áp dụng khi bước tiếp theo của server đã nêu việc đó; không cho tự thêm danh mục. Đầu ra sai được yêu cầu viết/trích lại tối đa một lần mỗi pha trong cùng deadline 50s; 429 không retry, không fallback fixture.

Bản cuối: **156 ca mã đạt**, typecheck đạt; 8 kiểm tra trình duyệt và 36 yêu cầu API trong lượt xác minh cuối theo `release-state.json`. Gemini chưa đạt gate công khai: hai câu định mức mới vẫn bị kiểm đầu ra từ chối (GEMINI_SCHEMA). Giữ public fixture; không fallback âm thầm và không gọi là đã phát hành Gemini.

Phát hành Gemini công khai vẫn chưa hoàn thành; giữ public fixture. Không dùng unit/mock hoặc một phản hồi tốt để thay gate chưa đạt.

## Nguồn kỹ thuật

[GenerateContent](https://ai.google.dev/api/generate-content), [structured output](https://ai.google.dev/gemini-api/docs/structured-output), [quota](https://ai.google.dev/gemini-api/docs/rate-limits), [Free terms](https://ai.google.dev/gemini-api/terms), [Vercel env](https://vercel.com/docs/environment-variables/managing-environment-variables).
