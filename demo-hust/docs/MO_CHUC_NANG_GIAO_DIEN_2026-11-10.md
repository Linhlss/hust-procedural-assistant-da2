# Mở chức năng tìm kiếm và nhập dữ kiện — 10/11/2026

Đã hoàn thiện hai chức năng đang khóa: tìm kiếm toàn bộ lịch sử và bổ sung/sửa từng dữ kiện. Đã triển khai lên **https://hust-t6-demo.vercel.app**, deployment `dpl_9cGiDLnu9587x7K6gfLgMfgahk69`, READY / Production. Vercel dùng **fixture**; bản tại máy dùng Ollama ở http://127.0.0.1:3020. Phạm vi vẫn là T6 và nguồn mẫu, chưa xác nhận nghiệp vụ HUST.

## Chức năng đã sử dụng được

| Thành phần | Cách sử dụng |
|---|---|
| Hoạt động | Bấm Bổ sung/Sửa, chọn Hội thảo hoặc Công tác |
| Địa điểm | Chọn Trong nước hoặc Nước ngoài |
| Ngày | Chọn lịch hoặc nhập bằng bàn phím, bấm Cập nhật; có Gỡ ngày |
| Kinh phí | Chỉ nhiệm vụ, Chỉ đơn vị hoặc Kết hợp hai nguồn; hai lựa chọn “Chỉ” là thay thế hoàn toàn |
| Quan hệ nhiệm vụ | Có phục vụ, Không phục vụ hoặc Chưa xác định |
| Phân định nguồn | Đã phân định, Chưa phân định hoặc Chưa xác định; chỉ hiện với nguồn kết hợp |

Mỗi lần mở một phần nhập ngay dưới dữ kiện. Lựa chọn ngắn gửi khi bấm; ngày cần xác nhận. Chọn lại giá trị hiện tại không tạo lượt mới. “Chưa xác định” xóa dữ kiện, khác với `false`. Bản nháp trong ô chat được giữ khi dùng form. Lỗi/hủy giữ lựa chọn để thử lại; máy chủ trả thành công mới cập nhật giá trị. Dữ kiện đã có vẫn sửa được.

Khi chờ xác nhận tình huống, phải chọn tiếp tục/mới trước khi sửa, tránh ghép dữ kiện sai trường hợp. Giữ khóa khi đang xử lý, chưa khởi tạo hoặc đủ 24 lượt. Hủy nhập/Escape đóng phần nhập; khi đang gửi có Hủy cập nhật. Thông báo ghi cụ thể dữ kiện vừa đổi, có nền riêng và chuyển động; không tự cuộn xuống câu trả lời. Reduced Motion, theme và thanh bên kéo được vẫn hoạt động.

## Tìm kiếm toàn bộ hội thoại

Tìm trong tên cuộc, mọi câu người dùng, phản hồi, lý do/câu hỏi làm rõ, dữ kiện đang chờ, hướng dẫn, phần thay đổi và đoạn căn cứ. Không tìm theo các khóa JSON nội bộ. Chữ hoa/thường, dấu tiếng Việt và `đ/d` được chuẩn hóa; nhiều từ yêu cầu đủ các từ trong cùng cuộc. Có số kết quả/tổng số, đoạn trích và đánh dấu chữ khớp bằng văn bản an toàn.

Máy tính và ngăn lịch sử điện thoại dùng chung truy vấn. Mở kết quả giữ bộ lọc; Hội thoại mới xóa bộ lọc. Xóa/khôi phục cập nhật kết quả ngay. Có trạng thái lịch sử trống/không tìm thấy và nút xóa từ khóa. Truy vấn không được lưu qua tải lại. Việc tìm kiếm hoàn toàn tại trình duyệt, không gọi API/model; vẫn giới hạn 20 cuộc trong 30 ngày.

## API và lịch sử

`/api/chat` giữ tương thích yêu cầu cũ `messages/profile/requestId`. Thêm `inputs` chứa thông tin nhập đã ghi nhận cho các lượt trước và `edit` cho lựa chọn mới. Máy chủ kiểm kiểu, ngày, số lượt và ngữ cảnh; không nhận nguồn hoặc kết luận từ client. Đầu vào có kiểu là dữ kiện tự khai báo, không phải hồ sơ được xác minh.

- Lựa chọn trực tiếp chuyển thành patch bằng mã, không gọi Ollama/OpenAI. Mã cũ vẫn tính lại nguồn, điều kiện và kết luận.
- Lưu trích xuất đã kiểm cùng lượt để tránh diễn giải lại các lượt đã chốt. Với Ollama, chỉ trích tin nhắn mới nhưng gửi đầy đủ lịch sử trước đó làm ngữ cảnh; không cắt lịch sử âm thầm. Giới hạn context và timeout 120 giây vẫn áp dụng.
- Hội thoại cũ được khôi phục từ dữ kiện và trạng thái đã lưu; máy chủ dựng lại kết luận từ kho nguồn. Không tin kết luận cũ như một quyết định nghiệp vụ.
- Giữ khóa localStorage `hust-conversations-v2`, mở rộng trường tùy chọn, không xóa kho cũ. Lượt chọn có nhãn “Cập nhật trực tiếp”, không giả làm mô hình vừa suy luận.
- Giữ request ID/hủy để phản hồi cũ không ghi đè; giữ giới hạn 2.000 ký tự và 24 lượt. Trần thân JSON tăng lên 150.000 ký tự để chứa metadata. API key vẫn ở máy chủ; không thêm thư viện/phụ thuộc.

## Kiểm chứng và các lần sửa

Áp dụng [hust-demo-build](../.agents/skills/hust-demo-build/SKILL.md) và [hust-demo-vercel](../.agents/skills/hust-demo-vercel/SKILL.md); MCP trình duyệt kiểm tra trực tiếp, Playwright kiểm tra tự động.

| Kiểm tra | Kết quả |
|---|---|
| Kiểm thử mã | 113/113 đạt; typecheck và build đạt |
| Hồi quy cục bộ | 72/72 đạt, gồm kiểm tra bố cục sáng/tối và điện thoại được giữ đầy đủ |
| Kiểm tra sau chỉnh trình bày | 13/13 đạt, gồm nhập ngoài thứ tự và bố cục/căn cứ |
| Bản cuối công khai | 11 ca ở theme tối và 6 ca ở theme sáng đạt; Chrome sạch, không cookie chủ project/token bypass |
| API công khai | 23 yêu cầu cũ + 13 yêu cầu có kiểu đạt trên deployment cuối |
| Video/thông báo cửa sổ thấp | 3 kiểm tra ghi video cuối đạt |
| Luồng Ollama với phục hồi tường minh | 1 kiểm tra đạt; thông tin chi tiết bên dưới |
| Bảo toàn | 43 tệp báo cáo/Excel, dữ liệu, nguồn, lockfile và cấu hình liên kết không đổi |

72 ca là vòng hồi quy đầy đủ trước các tinh chỉnh trình bày cuối; sau đó chạy 13 ca chịu ảnh hưởng, gồm ca cửa sổ thấp mới. Các lần chạy lặp không cộng thành số ca độc lập.

Vòng đầu phát hiện nhãn “Chưa xác định” bị dùng rộng cho tình huống mới và phần đánh dấu chữ tạo thêm span làm lệch kiểm tra tiêu đề. Đã sửa phân biệt nhãn, dùng Fragment cho chữ không khớp và giữ đủ kiểm tra bố cục. Kiểm trực quan tại cửa sổ thấp còn phát hiện thông báo mới lẫn nền; đã thêm nền kín, nội dung cụ thể và kiểm tra hồi quy riêng. Đã sửa thêm dòng tóm tắt để thao tác form ngoài thứ tự ghi đúng trường vừa sửa, không gắn nhầm vào câu hỏi đang chờ. Các lần chưa đạt giữ nguyên trong artifact; không sửa quy tắc nghiệp vụ hoặc đáp án để đạt.

113 kiểm thử (tệp cục bộ/không kèm bản công khai) · 72 ca cục bộ (tệp cục bộ/không kèm bản công khai) · Public tối (tệp cục bộ/không kèm bản công khai) · Public sáng (tệp cục bộ/không kèm bản công khai) · API cũ (tệp cục bộ/không kèm bản công khai) · API có kiểu (tệp cục bộ/không kèm bản công khai) · Toàn vẹn (tệp cục bộ/không kèm bản công khai).

## Vòng đánh giá mô hình mới — báo riêng với giao diện

Giữ bộ 20 hội thoại/39 lượt và kỳ vọng, SHA-256 `f6bc5a0f27c3585c9eae303d59e91e04a994217f3c59d9e2b4945e9bb724046e`. Chạy bằng `scripts/evaluate-input-flow.ts` trên M1/16 GiB, model `qwen3.5:9b` sẵn có, Ollama 0.40.15; `stream:false`, `think:false`, nhiệt độ 0, context 16384, đầu ra 4096, timeout 120 giây. Không tải model, mua credit hoặc gọi OpenAI thật.

- Fixture: **15/20 hội thoại, 33/39 lượt**.
- Ollama: **6/20 hội thoại, 14/39 lượt**, bỏ qua 0 lượt; trung vị **12.40 giây**, p95 **22.64 giây**.
- Ba phản hồi không qua bộ kiểm schema/nhất quán ở L07/lượt 2, L15/lượt 3 và L16/lượt 2. Các lỗi khác gồm nguồn tiền, quan hệ nhiệm vụ, hỏi làm rõ và phân định nguồn.

Vòng cũ đạt 7/20, vòng mới 6/20; **không kết luận chất lượng hiểu câu đã cải thiện**. Vòng mới thay cách tổ chức đầu vào, nên không quy chênh lệch cho riêng mô hình. Kỳ vọng chỉ kiểm các trường/trạng thái/nguồn được khai báo; chưa là đánh giá trên câu hỏi thực tế hoặc đáp án chuyên viên. Các chốt phạm vi/nguồn còn có hỗ trợ từ engine dùng chung.

Một kiểm thử web ban đầu cũng chưa đạt: chat đổi nguồn thật trả HTTP 503 / `OLLAMA_SCHEMA`, hệ thống giữ nguyên hai lượt trước và ngày đã chọn. Ca đó còn nguyên ở `ollama-browser/`, không đổi thành đạt. Kiểm thử bổ sung `ollama-recovery/` xác nhận người dùng chủ động bấm chọn nguồn đơn vị để tiếp tục; đây là hành động rõ ràng của người dùng, **không phải fallback âm thầm**. Kết quả sau đó giữ ngày 15/11/2026, chuyển funding sang unit, bỏ kết luận chỉ dành cho nhiệm vụ và lưu/mở lại được.

So sánh từng ca (tệp cục bộ/không kèm bản công khai) · Phản hồi gốc (tệp cục bộ/không kèm bản công khai) · Ca UI chưa đạt (tệp cục bộ/không kèm bản công khai) · Lỗi thật (tệp cục bộ/không kèm bản công khai) · Phục hồi (tệp cục bộ/không kèm bản công khai).

Các thao tác form đã hoạt động độc lập với mô hình; chat tự do Ollama vẫn chưa đủ ổn định để thay fixture. Chưa bổ sung nguồn HUST thật, xác nhận nghiệp vụ hoặc triển khai T1/T3/T4/T10.

## Video và cách chạy lại

- Bổ sung/sửa dữ kiện (tệp cục bộ/không kèm bản công khai).
- Tìm kiếm và mở/xóa/khôi phục (tệp cục bộ/không kèm bản công khai).
- Chat thật lỗi và phục hồi bằng chọn trực tiếp (tệp cục bộ/không kèm bản công khai).
- Ảnh bản công khai (tệp cục bộ/không kèm bản công khai).

Source chính vẫn là thư mục `demo-hust`; gói trong `${TMPDIR}` chỉ phục vụ triển khai, không phải bản làm việc thứ hai. Bản cục bộ đang mở tại http://127.0.0.1:3020. `.env.local` giữ `CHAT_ADAPTER=ollama`; Vercel được đặt fixture riêng. Khởi động lại máy cần mở Ollama và chạy web theo hướng dẫn README. Dịch vụ Ollama tiếp tục chạy; cấu hình không đổi.

```sh
npm run typecheck
npm test
npm run build
# Web fixture chạy ở terminal riêng để kiểm UI:
CHAT_ADAPTER=fixture npm start -- --port 3021
# Dùng thư mục mới cho từng lần chạy:
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3021 HUST_TEST_ARTIFACT_DIR=artifacts/demo-runs/lan-moi npm run test:e2e
# Đánh giá pipeline mô hình (không sửa bộ ca đóng băng):
HUST_TEST_ARTIFACT_DIR=artifacts/demo-runs/model-lan-moi node --import tsx scripts/evaluate-input-flow.ts
```

Tài liệu triển khai đã đối chiếu [Vercel deploy](https://vercel.com/docs/cli/deploy) và [environment variables](https://vercel.com/docs/environment-variables). Không thay bảo vệ project, commit/push Git, sửa báo cáo LaTeX/PDF hoặc bảng tiến độ.
