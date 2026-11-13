# Demo chatbot tư vấn thủ tục HUST

Website tiếng Việt cho T6/CA-01: hỏi bổ sung có mục đích, đối chiếu KHCN–TCKH, kiểm lại khi đổi dữ kiện, dừng khi thiếu/mâu thuẫn nguồn và mở căn cứ cho từng kết luận. Xây bằng Next.js + TypeScript trong chính thư mục này.

**URL đã kiểm chứng:** https://hust-t6-demo.vercel.app (Production; không cần đăng nhập).

**Bản Vercel hiện có:** fixture, nguồn mẫu T6 tự tạo. Gemini chưa đạt gate công khai: hai câu định mức mới vẫn bị kiểm đầu ra từ chối (GEMINI_SCHEMA). Giữ public fixture; không fallback âm thầm và không gọi là đã phát hành Gemini. Đây chưa phải chính sách HUST được chuyên viên xác nhận.

## Gemini trên Vercel — đã tích hợp và đánh giá

Gemini trích dữ kiện và soạn phản hồi theo ngữ cảnh; engine kiểm điều kiện, nguồn và dữ kiện có đoạn lời khai hỗ trợ. Đã gọi API thật bằng Free Tier qua Vercel và lưu cả ca chưa đạt. Gemini chưa đạt gate công khai: hai câu định mức mới vẫn bị kiểm đầu ra từ chối (GEMINI_SCHEMA). Giữ public fixture; không fallback âm thầm và không gọi là đã phát hành Gemini. [Kết quả và điểm tiếp tục](docs/GEMINI_VERCEL_2026-11-10.md), [rà yêu cầu](docs/AUDIT_HAI_KE_HOACH_2026-11-11.md).

Chọn model theo quota của project; key chỉ đặt ở server. Không fallback âm thầm, không bật billing. Các đoạn nguồn vẫn tự tạo, chưa là tư vấn HUST được chuyên viên xác nhận. OpenAI/Ollama dùng trích dữ kiện; Gemini có thêm bước soạn phản hồi. Toàn bộ đợt đánh giá mới dùng Vercel.

## Tìm kiếm và nhập dữ kiện — đã mở

Tìm toàn bộ câu hỏi/phản hồi/căn cứ trong lịch sử, có hoặc không dấu. Bảng tình huống có Bổ sung/Sửa theo từng trường; lịch cho ngày, lựa chọn ngắn cho các giá trị còn lại. Lựa chọn trực tiếp không cần mô hình; giữ bản nháp và ghi rõ thao tác. Xem [biên bản, video và giới hạn](docs/MO_CHUC_NANG_GIAO_DIEN_2026-11-10.md). Vercel hiện dùng fixture; các vòng Ollama cũ chỉ là lịch sử thử nghiệm.

## Chạy tại máy

```sh
npm ci
npm run dev
```

Mở http://127.0.0.1:3000. Có thể chạy bản production bằng `npm run build` rồi `npm start`. Runtime dự kiến Node 22.x, phụ thuộc khóa trong `package-lock.json`.

## Kiểm chứng

```sh
npm run typecheck
npm test
npm run build
CHAT_ADAPTER=fixture npm start
# Một cửa sổ khác, với Google Chrome sẵn có:
npm run test:e2e
```

Kiểm thử trình duyệt dùng Chrome của máy, không dùng profile đăng nhập cá nhân. Đổi `PLAYWRIGHT_BASE_URL` để chạy trên URL triển khai. Tệp kết quả thực tế, transcript và ảnh được ghi trong `artifacts/demo-runs/`; xem [tiến độ](docs/TIEN_DO_DEMO.md) để biết lần chạy và giới hạn kết quả.

## Hỏi bổ sung và cách đọc câu trả lời

Câu hỏi mô tả tình huống cá nhân (ví dụ “Tôi là giảng viên, muốn tham dự hội thảo thì cần làm gì?”) kích hoạt luồng hỏi từng thông tin: nguồn kinh phí, địa điểm, ngày hoạt động, quan hệ nhiệm vụ hoặc phân định nguồn khi cần. Có lựa chọn nhanh/ô chọn ngày; nhập nhiều dữ kiện cùng lúc sẽ bỏ qua phần đã biết. Câu trả lời ngắn “Có/Chưa” được hiểu theo câu đang hỏi. Không thể cung cấp thì dừng hỏi và nêu giới hạn. Câu hỏi giấy tờ/các bước/thời điểm mặc định hỏi các dữ kiện quyết định nội dung còn thiếu; chỉ yêu cầu tổng quan rõ ràng hoặc tìm tài liệu mới trả trực tiếp. Nếu mô tả một tình huống mới trong cuộc cũ mà chưa rõ quan hệ, bot hỏi trước khi dùng lại dữ kiện cũ.

Khi gửi, phản hồi không tự cuộn trang xuống cuối. Biểu tượng đang rà soát hiện ngay trên ô nhập trong lúc API xử lý (tối thiểu 650ms để quan sát được); không tạo các bước kiểm tra giả. Nút Xem phản hồi mới chỉ cuộn khi người dùng bấm. Ô nhập được cố định ở đáy màn hình, giữ vị trí khi cuộn, có khoảng trống để không che nội dung cuối; chiều rộng đi theo bảng tình huống trên desktop. Khi hỏi bổ sung, chỉ hiện câu đang chờ, các phần đã trả lời thu thành dòng ngắn. Hỏi xong chỉ còn một câu trả lời cuối cho cả chuỗi; câu hỏi/trả lời gốc vẫn lưu đầy đủ trong lịch sử và chuyển vào tab “Thông tin đã làm rõ” của căn cứ.

Phần hướng dẫn và bước tiếp theo là nội dung chính. “Căn cứ và thông tin” có hai tab nguồn tài liệu/thông tin đã làm rõ, thu gọn mặc định. Nguồn được nhóm theo tài liệu; mỗi lần mở một tài liệu, không lặp tiêu đề/phiên bản cho từng đoạn. Bấm [1], [2] mở đúng đoạn và liên kết đúng vị trí trong tài liệu. Các thay đổi hướng dẫn chỉ mở chi tiết khi người dùng muốn xem, không tự gạch bỏ cả đoạn dài vì đổi chủ đề thông tin.

“Không gian tình huống” là bảng bên phải, mặc định đóng trên mọi kích thước màn hình. Nút bật/tắt ở ngay trái “Bản trải nghiệm”; có nút ×, Escape và lớp nền đóng trên điện thoại. Đóng bảng không xóa hội thoại/dữ kiện.

Không còn mục “Chủ đề” cố định trong thanh bên: khối trước chỉ là nhãn của ca T6, không phải bộ lọc hay bộ định tuyến Ban. Giao diện hiển thị phạm vi đề tài KHCN–TCKH–TCNS; ca đang chạy T6 thuộc KHCN–TCKH được mô tả trong bảng tình huống. Chưa mở rộng dữ liệu nghiệp vụ hoặc giả lập TCNS đã hoạt động.

## Tài liệu và trải nghiệm mặc định

Bộ nguồn mặc định `standard` đã đầy đủ nguồn nhiệm vụ, công tác và hỗ trợ đơn vị. Mở `/tai-lieu` để xem 5 tài liệu hướng dẫn, mở đoạn căn cứ tương ứng trong câu trả lời hoặc tải tệp Markdown. Có tổng cộng 6 tệp tự tạo, gồm một tệp dành riêng cho nhánh mâu thuẫn. Dữ liệu gốc nằm trong `src/data/documents.json`; tạo lại tệp tải xuống bằng `node --import tsx scripts/generate-documents.ts` và kiểm tính nhất quán bằng `npm test`.

`missing-unit` và `conflict` là hai nhánh riêng trong “Chế độ kiểm thử”, không còn là trải nghiệm mặc định. Câu hỏi về giấy tờ, các bước hoặc thời điểm chuẩn bị làm rõ loại hoạt động, nguồn kinh phí và ngày để chọn tài liệu áp dụng; không hỏi địa điểm/quan hệ nhiệm vụ nếu chỉ cần danh mục chuẩn bị. Câu mô tả tình huống cá nhân cần làm gì vẫn đi qua đối chiếu điều kiện đầy đủ. Nếu người dùng chỉ yêu cầu tổng quan hoặc không thể cung cấp thêm, trả hướng dẫn có giới hạn.

“Bản trải nghiệm” chứa thông tin về chế độ và giới hạn; nhãn dài không lặp ở mọi vị trí. Câu trả lời và tài liệu vẫn ghi rõ sử dụng tài liệu mẫu, chưa thay hướng dẫn chính thức.

## Cấu hình mô hình tùy chọn

**Thử Ollama tại máy:** `.env.local` cục bộ đang đặt `CHAT_ADAPTER=ollama`, `OLLAMA_BASE_URL=http://127.0.0.1:11434`, `OLLAMA_MODEL=qwen3.5:9b`. Mở Ollama rồi chạy `npm run dev`; xem [hướng dẫn và biên bản](docs/THU_MO_HINH_OLLAMA_2026-11-10.md). Chuyển về bộ trích xuất giới hạn bằng `CHAT_ADAPTER=fixture npm run dev`. Cần khởi động lại web khi đổi chế độ. Có nút **Hủy** khi đang chờ; lỗi mô hình giữ dữ kiện/bản nháp và không tự fallback.

Xem `.env.example`; mặc định `CHAT_ADAPTER=fixture`, không cần key. Chọn `openai` và cấu hình key/model phía máy chủ khi muốn thử mô hình thật. OpenAI/Ollama trích dữ kiện; Gemini trích và soạn phản hồi. Điều kiện/nguồn do engine quyết định. Không có fallback âm thầm khi mô hình lỗi. OpenAI chưa được thử bằng key thật. Ollama đã được chạy cục bộ với `qwen3.5:9b`, không cần key/credits; kết quả còn lỗi, chưa thay fixture trên Vercel. Chỉ dùng tài liệu được phép cho từng chế độ.

## Nguồn và phiên

Nguồn runtime là nội dung tự tạo có nhãn trong `src/lib/sources.ts`; không đọc tài liệu khảo sát từ đường dẫn máy. Đọc [hợp đồng dữ liệu đang chạy](docs/DU_LIEU_MO_PHONG.md), [phạm vi](docs/PHAM_VI_DEMO.md), [nguồn thiết kế](docs/NGUON_THIET_KE.md) và các skill dự án khi cần sửa.

Lịch sử lưu bằng localStorage trên trình duyệt này, tối đa 20 hội thoại trong 30 ngày (lọc khi đọc/ghi), mỗi cuộc tối đa 24 lượt, mỗi câu tối đa 2.000 ký tự. Danh sách mặc định thu gọn, có nút đóng/mở và nhớ lựa chọn trên trình duyệt. Có thể mở lại/tiếp tục, xóa từng cuộc và khôi phục ngay sau khi xóa. “Hội thoại mới” giữ các cuộc cũ và hủy yêu cầu đang chạy. Các tab dùng chung danh sách nhưng giữ cuộc đang mở riêng; khi cùng sửa một cuộc, nhánh mới được giữ riêng để tránh ghi đè. Máy chủ không lưu hội thoại; chưa có đồng bộ giữa thiết bị. Không nhập dữ liệu cá nhân hoặc nghiên cứu chưa công bố.

## Vercel

Triển khai chính thư mục `demo-hust`, không tải cả thư mục khảo sát. `.vercelignore` loại docs, skill, tests, artifacts và tệp môi trường; key chỉ cấu hình phía máy chủ. Nếu nhập từ kho Git gốc, đặt Root Directory `demo-hust`. Không đưa tài liệu thầy gửi lên website.

Định danh project, URL đã kiểm chứng và bằng chứng F01–F05 được ghi trong `docs/TIEN_DO_DEMO.md`. Tài liệu này không tự xác nhận có deployment nếu bước triển khai chưa hoàn tất.

## Củng cố lỗi tồn đọng T6

Báo cáo tổng hợp ở `../Artifact_De_tai_chinh/09_BAO_CAO_TON_DONG_VA_CAI_THIEN_DEMO_T6.md`, ngoài gói triển khai. `src/lib/language.ts` phân biệt mệnh đề khẳng định/phủ định, ngày đầy đủ và tên các thẻ chưa hỗ trợ; chỉ dùng cho bộ trích xuất giới hạn, không thay mô hình hiểu ngôn ngữ tự nhiên đầy đủ. Trường mâu thuẫn được xóa và hỏi lại, không âm thầm giữ dữ kiện cũ. Tình huống mới/tiếp tục được xác nhận trước khi hợp nhất thông tin; dữ kiện đang chờ và quan hệ nguồn được giữ qua lịch sử.

Có thể chạy `HUST_TEST_ARTIFACT_DIR=artifacts/demo-runs/<lan-chay> node --import tsx scripts/audit-robustness.ts` để đối chiếu bộ ca lỗi; đặt thêm `DEMO_BASE_URL` để kiểm ẩn danh trên URL thật. Baseline dùng `AUDIT_BASELINE=1`, chỉ ghi nhận thực trạng và không tự coi các lỗi là đạt. Bộ thử nhắm vào lỗi không phải tập đánh giá nghiệp vụ được chuyên viên duyệt.

## Tuần 6 — chuẩn bị nguồn và mô hình

Hồ sơ xin dữ liệu và bảng căn cứ ở [Tuan_6](../Artifact_De_tai_chinh/Tuan_6/README.md), ngoài gói ứng dụng. Mốc rà soát 07/11/2026; chưa thay chính sách mẫu bằng quy định HUST.

Adapter dùng schema đầy đủ cho `clear`, chuyển tình huống, nguồn thay/kết hợp và loại yêu cầu; kiểm đầu ra mâu thuẫn, từ chối hoặc chưa hoàn tất. Đợt chuẩn bị đã bổ sung kiểm thử mock; việc đó không chứng minh chất lượng mô hình thật. Sau đó đã chạy Ollama ngày 10/11/2026, kết quả được lưu riêng trong biên bản. `.env.example` vẫn mặc định `fixture`; `.env.local` của máy đang thử Ollama.

Mỗi lần kiểm tra đặt `HUST_TEST_ARTIFACT_DIR` vào thư mục mới rồi chạy `npm run typecheck`, `npm test`, `npm run build`; kiểm thử trình duyệt cần bản web đang chạy và `PLAYWRIGHT_BASE_URL` trỏ đúng bản đó. Xem tiến độ để lấy kết quả và giới hạn lần chạy gần nhất.


## Giao diện Stitch — 08/11/2026

Chat, thư viện và trang đọc dùng cùng bộ giao diện sáng/tối. Mặc định sáng; nút mặt trăng/mặt trời ở thanh trên, lựa chọn lưu trên trình duyệt. Bảng tình huống tách dữ kiện đã ghi nhận và thông tin còn thiếu theo câu hỏi; sửa trực tiếp bằng chat. Hai điều khiển này từng khóa ở bản 08/11; hiện đã mở tìm kiếm toàn lịch sử và Bổ sung/Sửa từng trường, xem biên bản cập nhật 10/11 phía trên.

[Biên bản bàn giao và ảnh đối chiếu](docs/GIAO_DIEN_STITCH_2026-11-08.md) ghi kết quả 90 ca xử lý/mock, 51 ca trình duyệt và 23 yêu cầu API trên bản công khai. Các báo cáo LaTeX/PDF và lõi tư vấn không đổi. Nếu CLI Vercel chặn theo tác giả commit của thư mục Git cha, xem cách đóng gói ứng dụng riêng trong biên bản; không sửa tác giả hoặc lấy thư mục triển khai tạm làm source.


## Điều chỉnh thanh trái

Kéo cạnh phải thanh bên để đổi độ rộng từ 200 đến 360 px (không quá 35% cửa sổ). Nhấp đúp để về mặc định 232 px; có thể dùng mũi tên trái/phải, Home/End khi focus cạnh kéo và Escape để hủy lượt kéo. Lựa chọn được lưu trên trình duyệt. Tiêu đề lịch sử giữ nguyên cỡ chữ, tự thêm “…”, trỏ chuột để xem đầy đủ. Trên điện thoại tiếp tục dùng ngăn lịch sử.

[Biên bản và ảnh cập nhật](docs/THANH_TRAI_2026-11-08.md) ghi kết quả kiểm tra cục bộ và URL thật. Dòng nhắc về dữ liệu cá nhân dưới ô nhập đã bỏ; giới hạn 24 lượt và các thông tin chế độ trong “Bản trải nghiệm” vẫn giữ nguyên.


## Giao diện than chì và chuyển động

Mẫu hiện hành là bộ Stitch `(1)`. Chưa có lựa chọn theme thì mở tối; lựa chọn sáng/tối đã lưu được giữ. Công tắc dạng gạt và các thao tác chính có chuyển động dùng Motion 14.10.1. Hệ thống tự giảm chuyển động theo cài đặt hệ điều hành. Chuyển động cuộn dừng khi người dùng gõ, chạm hoặc tự cuộn; không tự kéo xuống phản hồi.

[Biên bản, ảnh và video](docs/GIAO_DIEN_THAN_CHI_MOTION_2026-11-08.md) ghi kết quả kiểm tra, phạm vi và bản dự phòng. Dữ liệu tư vấn và chức năng tìm lịch sử/bổ sung nhanh giữ trạng thái trước đó.

## Đợt 13–18/11: điểm dừng trước tài liệu mới

[Tiến độ và hướng dẫn kiểm chứng](docs/TUAN_7_CHUAN_BI_NGUON_2026-11-13.md) · [Nhận tài liệu và FAQ](../Artifact_De_tai_chinh/Tuan_7/README.md). Khi có narrative hợp lệ, đó là phần trả lời chính; kết luận engine nằm trong mục mở rộng Điều kiện và căn cứ. Kho mặc định vẫn là `t6-fixture`; gói tài liệu cung cấp chưa được kích hoạt.
