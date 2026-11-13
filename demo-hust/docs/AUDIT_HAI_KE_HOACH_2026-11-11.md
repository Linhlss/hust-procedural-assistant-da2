# Rà hai kế hoạch — 11/11/2026

Đối chiếu source, transcript và kết quả thực chạy. Không coi build xanh là xác nhận chất lượng nghiệp vụ. Nguồn mẫu và 37 tệp bảo vệ không đổi.

## Kế hoạch gần nhất: Gemini trên Vercel

| Yêu cầu | Bằng chứng / trạng thái |
|---|---|
| Tổng hợp tuần 6, giữ bộ 20 cũ, thêm chấm dữ kiện tự thêm | `KET_QUA_TUAN_6.md`, `evaluation.ts`, cohort cũ SHA không đổi; điểm cũ và chấm lại ghi riêng |
| 30 hội thoại, chia 10 phát triển / 20 giữ riêng, rubric trước chạy | `tests/context-cases.json`, manifest và `BO_CAU_HOI_T6_GEMINI_2026-11-10.md`; không thay kỳ vọng sau chạy |
| Adapter Gemini: trích và soạn; engine giữ nguồn/điều kiện | `gemini.ts`, `gemini-extraction.ts`, `conversation-inputs.ts`; unit và transcript hai phase thật |
| Typed edit không gọi mô hình, đọc lịch sử cũ | 13 yêu cầu Gemini/kiểm đầu vào đạt; `input-events.test.ts`, `history.ts` và mock kiểm số lần gọi |
| Lỗi/schema/hủy/quota giữ dữ kiện, không fallback | Ca mock và lỗi thật; các lượt phụ thuộc không giả lập tiếp; deadline cả lượt 50s/function 60s |
| Key server, đúng project, Free | Secret Preview/Production lưu trực tiếp; UI quota; CLI automation được cấp; không ghi key/token vào repo |
| Bộ cũ và mới chạy qua Vercel, lưu phản hồi/thời gian/lỗi | Hai bộ đầy đủ trong `docs/evidence/week6`; 6 lỗi/5 skip bộ cũ và 2 lỗi schema bộ giữ riêng được giữ |
| Chấm nội dung riêng, sửa trên nhóm phát triển | 54 phản hồi API đã đọc; không đồng nhất điểm dữ kiện với chất lượng nội dung. Sau khi xem heldout, các vòng mới ghi riêng |
| Kiểm các thay đổi sau đánh giá | 156 unit + typecheck, 12 câu chuyện 3.1, 4 câu chuyện 3.5, hồi quy đã xem và smoke candidate; mọi lỗi được giữ |
| Tắt trace và cập nhật URL chính sau gate | Gemini chưa đạt gate công khai: hai câu định mức mới vẫn bị kiểm đầu ra từ chối (GEMINI_SCHEMA). Giữ public fixture; không fallback âm thầm và không gọi là đã phát hành Gemini. |

## Kế hoạch thứ hai từ dưới lên: mở chức năng giao diện

| Yêu cầu | Bằng chứng / trạng thái |
|---|---|
| Sáu trường nhập có kiểu, một phần mở mỗi lần, ngày cần xác nhận | `FactEditor.tsx`, `CurrentFacts.tsx`, desktop/mobile features; lựa chọn cũ bị khóa, ngày có Gỡ ngày |
| Chưa xác định khác false, thay/kết hợp nguồn đúng ý | Unit input events, API typed và browser; trực tiếp không qua mô hình |
| Hủy/Escape/focus/draft, lỗi/thử lại, chỉ commit khi thành công | Browser feature tests và MCP Escape mới: phần nhập đóng, focus về nút, draft giữ; cancel/request sequence chặn phản hồi cũ |
| Pending tình huống phải xác nhận trước khi sửa | Disable khi pending + server `allowedEdit`; ca unit không cho ghép tình huống |
| Vừa đổi/thông báo, không tự cuộn, Motion/Reduced Motion | Thông báo cụ thể, tests feedback/motion/features, ảnh/video đợt mở chức năng còn nguyên |
| Tìm toàn bộ nội dung, không JSON keys; có/không dấu, đ/d, đủ các từ | `history-search.ts`, unit history-search; trả đoạn trích và highlight an toàn |
| Số kết quả, thứ tự mới, empty vs no result, xóa từ khóa | `Chat.tsx`/HistorySearch và kiểm browser ở 1440/390px |
| Mở giữ bộ lọc; Hội thoại mới xóa; xóa/undo đồng bộ | Browser features đã chạy; cùng state query cho desktop/mobile; 20 cuộc/30 ngày giữ nguyên |
| API cũ, schema kiểm phía server, replay/restore không tin kết luận client | `conversation-inputs.ts`, `input-schema.ts`; 36 yêu cầu fixture đã lưu; từ chối ngày sai/kết luận client |
| Desktop/mobile, hai theme, sidebar giới hạn, keyboard | Các suite features/sidebar/motion và 75 ca web vòng đầu + recheck sáu ca mạng. Không có khóa chức năng tìm/sửa cố định còn tồn tại |
| Đánh giá mô hình riêng và giữ lỗi cũ | Ollama vòng sau mở khóa đã lưu; Gemini các vòng sau tách riêng. Chưa xác nhận chính sách |
| Source, ảnh/video, biên bản, đúng Vercel project | `MO_CHUC_NANG_GIAO_DIEN_2026-11-10.md` và bằng chứng lịch sử; public fixture truy cập không đăng nhập |

## Báo cáo và repo

Báo cáo tuần 6 mới có PDF hai trang và source riêng; không in ngày/họ tên. Các báo cáo cũ và Excel không chỉnh sửa. Repo hiện tại là private `Linhlss/enterprise-support-copilot-da2`, nhánh main. Người dùng đã yêu cầu commit/push; chỉ đưa source, tài liệu dự án và bằng chứng tuyển chọn, không đưa key, .vercel, log provider thô hoặc tài liệu thầy chưa rõ quyền dùng.


**Còn thiếu gate Gemini công khai.** Hai chức năng giao diện đã hoàn thành; việc thu nguồn và xác nhận nghiệp vụ vẫn chưa được thực hiện.

Lượt kiểm cuối: 156 unit, typecheck, 8 kiểm tra web và 36 yêu cầu API; xem bằng chứng tuyển chọn và `GEMINI_VERCEL_2026-11-10.md`. Báo cáo tuần 6 biên dịch từ source, hai trang, không ngày/họ tên. Git được chuẩn bị trên repo private hiện có; trạng thái push được kiểm tra riêng sau commit.
