# Thử mô hình thật tại máy — 10/11/2026

Đã kết nối Ollama với nguyên mẫu T6 và chạy bộ hội thoại độc lập đã đóng băng. Bản tích hợp hoạt động; chất lượng trích dữ kiện của cấu hình đang thử **chưa đủ ổn định để thay fixture**. Kho nguồn vẫn là tài liệu mẫu tự tạo, chưa xác nhận độ đúng nghiệp vụ HUST.

## Kết quả chính

| Nội dung | Kết quả quan sát |
|---|---|
| Bộ thử | 20 hội thoại tự biên soạn, 39 tiền tố hội thoại; 1–5 lượt/cuộc |
| Fixture | 15/20 hội thoại, 33/39 tiền tố đạt kỳ vọng |
| Ollama | 7/20 hội thoại, 16/39 lần gọi đạt kỳ vọng |
| Sai cấu trúc/ngữ nghĩa schema | 3 lần gọi bị chặn, không tạo câu trả lời mới |
| Trung vị / p95 | 12.95 / 33.36 giây/lần gọi adapter trong bộ thử |
| Miền thời gian | 9.51–41.51 giây; không có lần gọi chạm ngưỡng 120 giây |
| Kiểm tra mã | 100/100 kiểm thử; typecheck và build đạt |
| Trình duyệt | 65 kiểm thử hồi quy fixture; 2 kiểm thử hủy trên máy tính/điện thoại; 1 kiểm thử toàn luồng Ollama đạt |

Một hội thoại chỉ đạt nếu mọi kỳ vọng của mọi lượt đều đạt. Bộ chấm chỉ kiểm các trường, câu hỏi làm rõ, trạng thái và nguồn được khai báo trong từng ca; không chấm mọi trường có thể xuất hiện. Đây là phép thử kỹ thuật trên câu tự biên soạn, không phải tỷ lệ chính xác trên câu hỏi thực tế hoặc kết quả đánh giá nghiệp vụ. Các chốt phạm vi và nguồn nằm trong engine dùng chung, không quy toàn bộ kết quả của chúng cho mô hình.

Bảng đối chiếu từng ca (tệp cục bộ/không kèm bản công khai) · Phản hồi Ollama nguyên bản (tệp cục bộ/không kèm bản công khai) · Fixture (tệp cục bộ/không kèm bản công khai) · [Bộ câu hỏi và kỳ vọng](../tests/ollama-cases.json).

## Máy, mô hình và phép thử khả thi

- Apple M1, RAM 17.179.869.184 byte (16 GiB); Ollama 0.40.15, runner MLX.
- Model đã có sẵn `qwen3.5:9b`, digest `d63f830f28d5`, lượng tử hóa `nvfp4`, tệp khoảng 7,6 GB. Không tải thêm mô hình hoặc mua API credits.
- Cấu hình: `think:false`, `stream:false`, `temperature:0`, `num_ctx:16384`, `num_predict:4096`; giới hạn 120 giây/yêu cầu. Bộ đánh giá chạy tuần tự, không gọi mô hình đồng thời.
- Lần gọi đầu khi chưa nạp model: tổng 33,98 giây, trong đó Ollama báo thời gian nạp 12,14 giây. Sau điều chỉnh cấu trúc trước khi đánh giá, hội thoại ba lượt đạt phép thử khói; thời gian các tiền tố 14,67 / 25,94 / 32,75 giây. Bản ghi `cold-single` của lần thử lại là lần đã nạp model, không được tính thành đo lạnh mới.
- `ollama ps` ghi nhận khoảng 8,1 GB ở phép thử ngắn; snapshot sau bộ đánh giá báo khoảng 12 GB (API `size_vram` 12.742.121.956 byte), 100% GPU, context 16384. `memory_pressure` tại snapshot báo 15% bộ nhớ trống. Đây là số đo tại các thời điểm, không phải đỉnh RAM của riêng tiến trình; bộ nhớ thống nhất và cache tăng theo lượt. Không quan sát thấy OOM trong các lần chạy này.
- Việc chạy được bộ thử ngắn không bảo đảm mọi hội thoại 24 lượt sẽ phù hợp với RAM/ngữ cảnh. Adapter kiểm giới hạn trước khi gọi và báo lỗi rõ khi vượt; không cắt bớt lịch sử để tiếp tục.

Máy và bộ nhớ (tệp cục bộ/không kèm bản công khai) · Thử khói ban đầu (tệp cục bộ/không kèm bản công khai) · Thử khói sau sửa cấu trúc (tệp cục bộ/không kèm bản công khai).

## Thay đổi đã thực hiện

`src/lib/ollama.ts` gọi `/api/chat` của Ollama qua loopback và yêu cầu JSON Schema dùng chung với bộ kiểm dữ kiện. Mô hình chỉ trả ý định và bản thay đổi dữ kiện cho từng lượt. Engine cũ tiếp tục hợp nhất thông tin, chọn tài liệu mẫu, đối chiếu điều kiện và tạo hướng dẫn. Không để mô hình sinh hoặc quyết định chính sách.

API nhận cùng cấu trúc `messages/profile/requestId`. Phản hồi và bộ đọc lịch sử chấp nhận thêm mode `ollama`, vẫn đọc được hội thoại `fixture` và `openai`. Nhãn câu trả lời dùng mode đã lưu của chính lượt đó, tránh đổi nhãn các câu trả lời cũ khi chuyển chế độ. “Bản trải nghiệm” hiển thị “AI tại máy qua Ollama”.

Thêm nút **Hủy** trong trạng thái chờ. Hủy, lỗi và yêu cầu cũ không thêm lượt thành công hoặc ghi đè dữ kiện hiện có; bản nháp được giữ để thử lại. Adapter phân biệt lỗi cấu hình/kết nối, timeout, vượt ngữ cảnh, sai schema và hủy. Không tự chuyển sang fixture hoặc gửi lại yêu cầu âm thầm. Cấu hình Ollama chỉ chấp nhận loopback và từ chối chạy trên Vercel.

Kiểm ngữ cảnh dùng số byte UTF-8 như một chặn trên bảo thủ cho token đầu vào, cộng phần dành cho đầu ra và khung chat. Vì không dùng bộ tokenizer riêng của model, có thể từ chối sớm một hội thoại vẫn vừa context; đây là giới hạn hiện tại. Toàn bộ lượt được giữ hoặc yêu cầu bị từ chối rõ ràng.

## Quy trình đánh giá và lỗi còn lại

Bộ 20 hội thoại được tạo và khóa trước khi gọi mô hình, SHA-256 `f6bc5a0f27c3585c9eae303d59e91e04a994217f3c59d9e2b4945e9bb724046e`. Gồm đủ/thiếu dữ kiện; trả lời ngắn; phủ định; thay/kết hợp nguồn; sửa, xóa hoặc nhập ngày sai; tiếp tục/chuyển tình huống; thiếu/mâu thuẫn nguồn; ngoài phạm vi; và yêu cầu tự đặt kết luận. Cùng câu hỏi, kỳ vọng và engine được dùng cho hai chế độ. Không đổi prompt, schema, engine, bộ ca hoặc đáp án trong khi chạy lần đánh giá này; hash mã được lưu trong JSON.

Phép thử khói đầu tiên phát hiện model gộp hai lượt thành một patch. Trước lần đánh giá đã bổ sung ràng buộc số phần tử bằng số lượt và chỉ dẫn không điền hồi tố. Bộ đánh giá vẫn ghi nhận ba phản hồi không qua bộ kiểm schema ở L06/lượt 2, L15/lượt 3 và L16/lượt 2; phản hồi thô được giữ lại. Cụ thể: L06 vừa xóa `related` vừa cấp giá trị `false`; L15 đánh dấu mơ hồ nhưng không chỉ ra dữ kiện cần xóa; L16 vừa xóa địa điểm vừa cấp `foreign`. Đây là lỗi nhất quán trong JSON, không phải ba phản hồi JSON không đọc được. Chẩn đoán (tệp cục bộ/không kèm bản công khai).

Lỗi chất lượng tập trung ở:

- **Quan hệ với nhiệm vụ:** có lượt model gán `related:false` dù câu nêu phục vụ nhiệm vụ, hoặc dùng giá trị `false` thay cho chưa biết. Sai khác `related` xuất hiện trong 17 lượt; đây là số lượt có lỗi trường đó, không phải 17 hội thoại độc lập.
- **Câu ngắn và nguồn tiền:** “Đề tài chi.” chưa được nhận đúng; câu thay/ghép nguồn có lúc bỏ qua bước hỏi quan hệ giữa nguồn cũ và mới.
- **Thông tin qua nhiều lượt:** sửa ngày có thể kéo theo thay đổi sai dữ kiện quan hệ nhiệm vụ đã có; một số phản hồi chuyển tình huống bị từ chối do không qua schema.
- **Fixture cũng còn hạn chế:** chưa hiểu hết câu mới về đơn vị chi, câu ngắn và việc rút lại ngày/nguồn. Không lấy fixture làm đáp án chuẩn; đáp án mong đợi được định nghĩa riêng trong bộ ca.

Vì vậy, kết quả chưa chứng minh Ollama tốt hơn fixture. Lần tiếp theo cần xử lý phân biệt `null/false`, chỉ trích dữ kiện thực sự được phát biểu và tính nhất quán khi tái đọc lịch sử. Nếu điều chỉnh prompt/adapter, lưu thành vòng thử mới, giữ nguyên kết quả lần này và bổ sung tập câu độc lập. Chưa mở rộng T1/T3/T4/T10 hoặc chức năng tìm lịch sử/bổ sung nhanh trong đợt này.

## Kiểm chứng trên web và video

Lần kiểm thử web đầu đã chạy ba lượt model nhưng dừng tại nút Hủy: nút nằm trong khối `aria-hidden`. Đã chuyển nút về thanh trạng thái trên ô nhập, biên dịch lại, kiểm tra bàn phím ở 1440/390 px rồi chạy lại toàn luồng Ollama. Lần đầu và video lỗi được giữ ở `browser-ollama-before-cancel-fix/`. Bộ 65 ca hồi quy có sẵn đạt trước sửa vị trí nút; sau sửa chạy hai ca hủy trực tiếp và ca toàn luồng, không chạy lại mọi kiểm thử trình bày không bị ảnh hưởng.

Kiểm thử web Ollama gọi thật ba lượt: hỏi hội thảo còn thiếu ngày → bổ sung ngày → chuyển hoàn toàn sang nguồn đơn vị. Kiểm tra nhãn mode, nguồn, không giữ kết luận chỉ dành cho kinh phí nhiệm vụ sau khi thay nguồn, và mở lại hội thoại đã lưu. Kịch bản còn kiểm lỗi 503, thử lại cùng bản nháp, hủy, hai phiên tách biệt và không có lỗi JavaScript.

Phần lỗi 503 và hủy trong kiểm thử web được **chủ động giả lập ở tầng mạng** để kiểm giao diện, không cộng vào 39 lần đánh giá mô hình thật. Timeout 120 giây và lỗi kết nối/schema/ngữ cảnh cũng có kiểm thử mock; không tuyên bố đã chờ timeout thật hoặc kiểm mọi tình huống đứt kết nối. Mã phản hồi lỗi không có `answer`.

Video chạy thật (tệp cục bộ/không kèm bản công khai) · Ảnh hỏi bổ sung (tệp cục bộ/không kèm bản công khai) · Ảnh hướng dẫn (tệp cục bộ/không kèm bản công khai) · Ảnh nguồn (tệp cục bộ/không kèm bản công khai) · Ảnh sau đổi kinh phí (tệp cục bộ/không kèm bản công khai) · Kết quả web (tệp cục bộ/không kèm bản công khai) · Hồi quy (tệp cục bộ/không kèm bản công khai).

MCP trình duyệt cũng xác nhận trang cục bộ và thông tin chế độ AI tại máy. Ảnh chế độ (tệp cục bộ/không kèm bản công khai). Bản source, báo cáo LaTeX/PDF, nguồn mẫu và liên kết project Vercel được đối chiếu; xem kiểm tra bảo toàn (tệp cục bộ/không kèm bản công khai).

## Bật, tắt và chạy lại

Thư mục chính là `demo-hust` trong project ĐA 2. Cần Node 22, các phụ thuộc từ lockfile và Ollama đã chạy. Không cần khóa OpenAI.

```sh
cd '${PROJECT_ROOT}/demo-hust'
# Kiểm tra dịch vụ/model đã có; không kéo model mới:
ollama list
ollama ps
# Nếu chưa chạy dịch vụ, mở ứng dụng Ollama hoặc chạy ollama serve ở cửa sổ riêng.
```

`.env.local` đã được tạo cục bộ, Git bỏ qua:

```dotenv
CHAT_ADAPTER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3.5:9b
```

```sh
npm run dev
# Mở http://127.0.0.1:3000
# Hoặc bản production: npm run build && npm start
```

Bản thử trong phiên bàn giao chạy ở **http://127.0.0.1:3020**. Sau khi tắt Terminal hoặc khởi động lại máy, cần chạy lại dịch vụ Ollama và lệnh web; chưa thiết lập tự khởi động. Dừng web bằng Ctrl+C. `ollama stop qwen3.5:9b` chỉ giải phóng model khỏi RAM; lần gọi sau có thể nạp lại nếu dịch vụ vẫn chạy.

Để thử fixture, dừng web và chạy `CHAT_ADAPTER=fixture npm run dev`, hoặc đổi giá trị trong `.env.local` rồi khởi động lại. Muốn quay lại Ollama, đổi `CHAT_ADAPTER=ollama`. Không đổi `.env.example` mặc định fixture. Không đặt `CHAT_ADAPTER=ollama` trên Vercel: localhost của máy chủ đó không phải Mac này. Bản Vercel hiện có được giữ nguyên.

```sh
npm run typecheck
npm test
npm run build
# Chạy lại bộ mô hình, dùng thư mục mới để không ghi đè bằng chứng:
HUST_TEST_ARTIFACT_DIR=artifacts/demo-runs/ollama-vong-moi node --import tsx scripts/evaluate-ollama.ts
# Web fixture cần chạy riêng; sau đó đặt PLAYWRIGHT_BASE_URL đúng cổng:
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3021 HUST_TEST_ARTIFACT_DIR=artifacts/demo-runs/fixture-vong-moi npm run test:e2e
# Web Ollama cần chạy riêng; có gọi model thật và ghi video:
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3020 HUST_TEST_ARTIFACT_DIR=artifacts/demo-runs/ollama-web-vong-moi npm run test:e2e -- --config playwright.ollama.config.ts
```

Không chạy nhiều yêu cầu mô hình cùng lúc khi đo thời gian trên máy 16 GiB. Các trường hợp chưa đủ nguồn hoặc đáp án chuyên viên vẫn chưa hoàn thành về nghiệp vụ. Không gửi báo cáo hoặc cập nhật bảng tiến độ học thuật tự động trong đợt này.

## Nội dung có thể báo cáo tuần 6

“Đã tích hợp Ollama/qwen3.5:9b chạy cục bộ vào nguyên mẫu T6, giữ engine đối chiếu điều kiện và kiểm cấu trúc đầu ra. Đã chạy bộ 20 hội thoại (39 lần gọi), so sánh với fixture và kiểm luồng trên web. Cấu hình hiện tại đạt 7/20 hội thoại theo kỳ vọng đã định nghĩa, trung vị khoảng 13 giây/lần gọi; còn lỗi quan hệ nhiệm vụ và cập nhật dữ kiện. Nguồn vẫn là tài liệu mẫu, chưa đánh giá độ đúng nghiệp vụ HUST.”

## Tài liệu kỹ thuật chính thức

- [Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs): schema trong trường format.
- [Chat API](https://docs.ollama.com/api/chat): chat, stream và số đo thời gian.
- [Thinking](https://docs.ollama.com/capabilities/thinking): điều khiển think.
- [Ollama FAQ](https://docs.ollama.com/faq): dịch vụ tại máy và địa chỉ nghe.
