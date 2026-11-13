# Tổng hợp model API tham khảo và phương án kiểm thử tiết kiệm

## 1. Mục đích và quyết định hiện tại

Tài liệu này lưu các model đã trao đổi để lựa chọn sau. Không yêu cầu tích hợp hoặc mua quyền dùng tất cả model.

**Ngân sách API mặc định hiện tại: 0 đồng.** Chỉ cân nhắc quota miễn phí mà tài khoản thực sự có; hết quota thì lưu điểm tiếp tục và chờ. Không bật billing, mua credit, tự chuyển sang model trả phí hoặc nâng gói để mở thêm quota.

Mốc đối chiếu tài liệu giá: **13/11/2026**. Giá dưới đây là USD trên **một triệu token**, theo chế độ Standard nếu có, đầu vào chưa hưởng cache, không gồm thuế, phí công cụ, phí nền tảng hoặc phụ phí ngữ cảnh dài. Cần kiểm lại giá, quyền truy cập và quota trước lần sử dụng thực tế.

**Mức $20–40 và giả định 5.000 lượt từng được trao đổi là một kịch bản dự phòng lớn, không phải chi phí bắt buộc hoặc số lượt phải đạt để hoàn thành đồ án.** Trước mắt không áp dụng kịch bản đó.

## 2. Danh sách tám ứng viên

Các vai trò dưới đây là đề xuất lựa chọn, chưa phải kết quả so sánh chất lượng trên chatbot HUST.

| STT | Model và mã API | Miễn phí hoặc điều kiện dùng thử | Giá đầu vào / đầu ra | Vai trò đáng thử | Trạng thái trên project |
|---|---|---|---|---|---|
| 1 | **Gemini 3.8 Flash** — `gemini-3.8-flash` | Có Free Tier; quota phụ thuộc project và model. Phải kiểm quyền và RPM/TPM/RPD thực tế trong AI Studio. | **$0 trong quota Free**. Standard trả phí: **$0,75 / $3,75** đến 31/12/2026; **$1,50 / $7,50** từ 01/01/2027. | Ưu tiên kiểm tra quyền dùng miễn phí trước. Có thinking, structured outputs; project đã có adapter thuộc họ Gemini. [S01] và [S02]. | **Chưa kiểm thử model này.** Không dùng kết quả Gemini 3.1/3.5 để thay thế. |
| 2 | **DeepSeek V4.1 Flash** — gọi `deepseek-flash`; bảng giá ghi phiên bản `DeepSeek-V4.1-Flash-1017` | API tính tiền theo token. Không mặc định được cấp credit hoặc miễn phí lâu dài. | Đầu vào không cache: **$0,15–0,30**; đầu ra: **$0,60–1,20**, theo giờ thấp điểm/cao điểm. | Ứng viên chi phí thấp khi sau này có ngân sách. Hỗ trợ thinking, JSON và giao thức API tương thích OpenAI. [S03] | **Chưa kiểm thử trên project.** |
| 3 | **Qwen 3.8 Max** — `qwen3.8-max` | Model Studio Singapore công bố quota **một triệu token**, hiệu lực **90 ngày** theo mốc kích hoạt/phát hành/phê duyệt áp dụng. Cần kiểm điều kiện và quota còn lại của tài khoản; không phải miễn phí vĩnh viễn. | Singapore/International: **$2 / $6** sau quota. Không dùng mức giá vùng khác để tính thay. | Thử đối chiếu nếu tài khoản được cấp quota miễn phí. Khác với Qwen 3.5:9B chạy tại máy đã thử trước đây. [S04] | **Chưa kiểm thử model API này.** |
| 4 | **GPT-6 Luna** — `gpt-6-luna` | API trả phí; trang model không hỗ trợ Free Tier. Không dùng gói ChatGPT Plus làm bằng chứng có credit API. | **$0,10 / $0,50**. | Ứng viên trả phí thấp cho hiểu yêu cầu, trích dữ kiện và soạn phản hồi; có reasoning và structured outputs. Có thể xem xét khi có ngân sách riêng. [S05] | **Chưa kiểm thử trên project.** |
| 5 | **Claude Haiku 5.5** — `claude-haiku-5-5` | API tính tiền theo token; không mặc định có credit dùng thử. Quyền chat trên Claude.ai khác với quyền dùng API. | Với đầu vào mỗi yêu cầu không quá 100.000 token: **$0,10 / $0,50**; vượt mốc đó: **$0,50 / $2,50**. | Ứng viên chi phí thấp cho phân loại, trích xuất và phản hồi hội thoại; chỉ cân nhắc khi có ngân sách. [S06] | **Chưa kiểm thử trên project.** |
| 6 | **GPT-6.1 Terra** — `gpt-6.1-terra` | API trả phí; không mặc định có credit. | **$1 / $5**. | Ứng viên đối chiếu về suy luận và diễn đạt khi đã có nguồn/bộ đánh giá phù hợp. Không cần tích hợp chỉ để đủ danh sách model. [S07] | **Chưa kiểm thử trên project.** |
| 7 | **Nemotron 3 Ultra qua OpenRouter** — `nvidia/nemotron-3-ultra-550b-a55b:free` | Phiên bản `:free` có giá $0, chịu giới hạn. Tài khoản chưa mua credit: thường **20 yêu cầu/phút, 50 yêu cầu/ngày** dùng chung cho các biến thể free; lần thử thất bại cũng tính quota. Mức 1.000/ngày gắn với điều kiện đã mua credit, không được coi là phương án 0 đồng hiện tại. | **$0 / $0** cho đúng biến thể free còn được cung cấp. | Ứng viên reasoning miễn phí cho một vòng nhỏ nếu kết nối và quyền dùng đáp ứng. Cần kiểm khả năng tiếng Việt, đầu ra có cấu trúc, độ trễ và nhà cung cấp thực tế. [S08] và [S09]. | **Chưa kiểm thử trên project.** |
| 8 | **GPT-6.1 Sol** — `gpt-6.1-sol` | API trả phí; trang model không hỗ trợ Free Tier. | **$2 / $10**. | **Dành cho giai đoạn hệ thống đã hoàn thiện theo kế hoạch**, rồi chạy đánh giá và hồi quy trước khi trình bày. Đợt này không tích hợp hoặc gọi model. [S10] | **Chưa kiểm thử trên project.** |

Các mã không kèm ngày có thể là alias. Khi đánh giá phải lưu model/version nhà cung cấp trả về nếu có, cùng ngày chạy và cấu hình; không coi tên alias là cam kết phiên bản bất biến.

### Cách chọn trong điều kiện hiện tại

1. Kiểm quota sẵn có cho **Gemini 3.8 Flash**; chỉ chọn nếu thật sự truy cập được trong Free Tier và đáp ứng yêu cầu kỹ thuật.
2. Nếu không có quota phù hợp, xem quyền dùng đúng biến thể **Nemotron 3 Ultra free**; hạn mức thấp thì chia phiên chạy theo ngày. Khi so sánh phải cố định model và ghi nhà cung cấp, không dùng bộ định tuyến ngẫu nhiên `openrouter/free` để đại diện cho một model cụ thể.
3. **Qwen Max** chỉ được đưa vào vòng thử miễn phí nếu xác nhận tài khoản có quota và có cách ngăn sử dụng phát sinh phí. Chưa rõ điều kiện thanh toán thì tiếp tục để tham khảo.
4. Luna, Haiku, DeepSeek, Terra và Sol giữ trong danh mục cho giai đoạn được cấp ngân sách. Không đăng ký trả phí trong đợt này.

Một model có thể không đáp ứng schema, tiếng Việt, thời lượng xử lý hoặc quota của ứng dụng dù được công bố mạnh. Chọn model theo kết quả kiểm thử của project, không theo tên, kích thước hoặc bảng xếp hạng sử dụng.

## 3. Phân biệt kết quả đã có với phần chưa làm

Theo biên bản của project, Gemini thuộc các phiên bản 3.1/3.5 đã có lần gọi thật qua Vercel, kèm lỗi và kết quả đánh giá được lưu. Điều đó không xác nhận Gemini 3.8 Flash hoặc bảy ứng viên khác trong danh mục đã chạy được.

Các chức năng tìm lịch sử và Bổ sung/Sửa/Gỡ dữ kiện đã được hiện thực. Nhập dữ kiện trực tiếp được máy chủ kiểm tra bằng mã, không cần mô hình diễn giải lại. Bộ kiểm thử mã, trình duyệt và API hiện có tiếp tục dùng được cho phần tương ứng.

Nguyên mẫu runtime vẫn tập trung T6 và nguồn mẫu. Nguồn nghiệp vụ, FAQ cùng đáp án chuyên viên cho toàn bộ T1/T3/T4/T6/T10 vẫn là phụ thuộc phải hoàn thiện; thêm model không thay thế các phần này.

Tài liệu nội bộ được dùng hoặc gửi đến dịch vụ mô hình theo quyền được cấp. Riêng Gemini Free công bố nội dung có thể được dùng để cải thiện sản phẩm; không tự chuyển nguồn nội bộ lên gói Free khi chưa rõ quyền. Xem [S01] và [phiếu xin dữ liệu](Tuan_6/PHIEU_XIN_DU_LIEU_2026-11-07.md).

## 4. Giảm chi phí bằng cách chia đúng lớp kiểm thử

| Thành phần | Cách kiểm tra không cần gọi model mới | Phần vẫn cần lần gọi thật |
|---|---|---|
| Cập nhật dữ kiện | Kiểm các thao tác gán/giữ/rút; phân biệt `false` với chưa biết; kiểm ngày và quan hệ tình huống bằng đầu vào đã xác định. | Model có hiểu đúng một phát ngôn tiếng Việt mới và trích đúng thay đổi hay không. |
| Chọn nguồn và đối chiếu điều kiện | Kiểm ngày hiệu lực, phạm vi nguồn, thay/kết hợp kinh phí, thiếu/mâu thuẫn nguồn bằng bộ dữ kiện và nguồn kiểm thử. | Model có diễn đạt đúng kết luận/đoạn nguồn được cấp hay không. |
| Lịch sử, giao diện, hủy/lỗi/thử lại | Dùng đầu vào có kiểu và phản hồi giả có kiểm soát. Xác minh không mất bản nháp, không ghi đè dữ kiện, không nhận phản hồi cũ. | Kiểm tích hợp với một số lượt model thật sau khi luồng ứng dụng đã qua kiểm tra. |
| Bộ kiểm đầu ra | Chạy lại phản hồi thật đã lưu và các đầu ra lỗi đã biết qua bộ kiểm mới. Đo cả trường hợp chặn đúng và chặn nhầm. | Prompt/model mới có tạo đầu ra hợp lệ, đủ nội dung và bám nguồn hay không. |
| Hiểu ngôn ngữ và hội thoại | Rà trước câu hỏi, dữ kiện, đáp án và tiêu chí bằng người đọc. Không dùng fixture để thay bằng chứng hiểu câu của model. | Bộ hội thoại đại diện và nhóm tình huống trọng yếu phải chạy thật. |
| Độ đúng nghiệp vụ HUST | Đối chiếu nguồn và nhờ chuyên viên xác nhận đáp án khi nhận được tài liệu/FAQ. | Model chỉ được đánh giá trên phần có đáp án/căn cứ đủ để đối chiếu; không thuê model khác làm người xác nhận nghiệp vụ. |

### Quy tắc chạy lại

- Sửa bố cục/CSS: kiểm giao diện liên quan, không tự chạy lại cả bộ model.
- Sửa engine hoặc trạng thái: chạy đầy đủ bộ mã liên quan, sau đó kiểm một số hội thoại thật bị ảnh hưởng nếu cần.
- Sửa prompt, schema trích xuất, model hoặc dữ liệu nguồn được cấp cho model: phải có vòng kiểm model thật phù hợp; phát lại đầu ra cũ không đủ để chứng minh bản mới tốt hơn.
- Có thể dùng ca biên và các bất biến trong kiểm thử mã: chỉ đổi nguồn thì không được tự đổi ngày; rút dữ kiện thì kết luận phụ thuộc phải được xét lại; chưa biết không được trở thành phủ định. Những phép kiểm bằng dữ kiện trực tiếp này không được tính thành kiểm thử hiểu tiếng Việt.

Việc phát lại phản hồi cũ phục vụ kiểm hồi quy đầu ra/hiển thị, không tạo ra phản hồi mô hình mới. Nếu sau này thêm cache để tránh gọi trùng khi phát triển, khóa phải xét đủ model, cấu hình, prompt/schema, nguồn, trạng thái và lịch sử. Những lần kiểm tính ngẫu nhiên hoặc đánh giá độc lập phải gọi mới, không lấy cache để tăng điểm.

## 5. Đợt gọi miễn phí có giới hạn được đề xuất

Phần này là phương án tiếp theo, **chưa triển khai hoặc chạy mới**. Không chốt hoàn thành toàn bộ phạm vi từ một đợt thử T6.

### 5.1. Bộ phát triển

Chọn **24 hội thoại T6**, nằm trong khoảng 20–30 đã thống nhất; bốn hội thoại cho mỗi nhóm:

1. Thiếu dữ kiện và câu trả lời ngắn theo câu hỏi bổ sung.
2. Phủ định; phân biệt không/chưa biết/rút lại dữ kiện.
3. Thay thế hoặc kết hợp nguồn kinh phí.
4. Sửa/rút ngày, ngày không hợp lệ và thời điểm phiên bản nguồn.
5. Tiếp tục hoặc bắt đầu một tình huống mới.
6. Thiếu căn cứ, ngoài phạm vi hoặc yêu cầu tự đặt kết luận.

Mỗi hội thoại có dữ kiện mong đợi, nguồn/kết luận cần dùng, nội dung phải trả lời và điều không được khẳng định; chốt trước lần chạy. Đây là bộ để phát hiện và sửa lỗi, không gọi là tập đánh giá độc lập.

### 5.2. Nhóm đánh giá và ca trọng yếu

- Sau khi ổn định, chuẩn bị **20 hội thoại mới giữ riêng** trước khi chạy. Không gọi các tập đã xem và dùng để sửa là heldout mới.
- Chọn tối đa **sáu hội thoại trọng yếu** để chạy thêm một lần, tập trung sai nguồn, mất dữ kiện, tự đặt điều kiện hoặc chuyển tình huống sai; ghi lần lặp riêng, không tăng số ca độc lập.
- Nếu giả định trung bình ba lượt/hội thoại, tổng ba nhóm khoảng **150 lượt người dùng**, tương ứng khoảng **300 lần gọi model cơ bản** khi mỗi lượt có hai pha trích/soạn. Đây là phép tính khối lượng, không phải hạn mức tài khoản hoặc số lần đã chạy; retry có thể làm tăng số yêu cầu.
- Chia theo quota thực tế và lưu điểm tiếp tục. Không yêu cầu hoàn thành trong một ngày; không tạo thêm key để né hạn mức project.

### 5.3. Cách chấm và giữ bằng chứng

- Chấm tự động: dữ kiện đúng/thiếu/tự thêm, dữ kiện đã rút, nguồn còn dùng/đã bỏ, phiên bản, câu hỏi cần bổ sung và trạng thái kết luận.
- Rà nội dung theo năm tiêu chí hiện có: **bám nhu cầu, đủ nội dung, nhất quán ngữ cảnh, căn cứ hỗ trợ, dừng đúng**. Ghi rõ người rà và phần chưa được chuyên viên xác nhận.
- Tách lỗi dịch vụ, lỗi trích xuất, lỗi kiểm đầu ra, lỗi diễn đạt và lượt phụ thuộc chưa chạy. Không chỉ tính trên phản hồi thành công để che lỗi dịch vụ.
- Lưu mã ca, kỳ vọng đã chốt, phiên bản mã/prompt/nguồn, model/cấu hình, deployment, phản hồi, dữ kiện, nguồn, thời gian, token nếu API cung cấp và lỗi. Không lưu key/token hoặc dữ liệu riêng không cần thiết.
- Mỗi phiên bản dùng thư mục bằng chứng mới. Chỉ tiếp tục phần chưa có kết quả; không ghi đè lỗi cũ hoặc gọi lại chỉ để lấy đáp án đạt.
- Khi hết quota, dừng và lưu điểm tiếp tục. Lỗi model không được âm thầm thay bằng fixture hoặc model khác.

Mọi hội thoại/model thật của phương án tiếp tục chạy qua **Vercel**, theo lựa chọn của người dùng. Kiểm thử mã có thể chạy không gọi model. Chưa thay cấu hình URL chính hoặc công khai model mới khi chưa qua kiểm chứng.

## 6. Mức tin cậy được giữ và giới hạn cần nói rõ

Phương án trên giữ được độ phủ kiểm tra phần mềm bằng cách kiểm toàn bộ logic có thể xác định bằng mã, dùng lại bằng chứng đúng mục đích và dành lượt gọi thật cho hành vi chỉ model mới thể hiện được. Không cần gọi model hàng nghìn lần để xác minh lại một nút xóa hội thoại hoặc phép chọn nguồn theo ngày.

Tuy nhiên, **giảm số lần gọi thật không tạo ra mức chắc chắn thống kê tương đương hàng nghìn lượt kiểm độc lập**. Bộ nhỏ còn có thể bỏ sót cách hỏi hiếm và sự không ổn định của model. Không lấy số ca unit/mock cộng với số hội thoại thật để công bố một tỷ lệ chính xác chung.

Chưa có FAQ hoặc câu hỏi thực tế thì gọi bộ thử là tự biên soạn, không khẳng định đại diện tần suất người dùng HUST. Khi nhận được nguồn và FAQ, ưu tiên cải thiện tính đại diện, đáp án đối chiếu và ca nghiệp vụ quan trọng thay vì chỉ tăng số câu.

Những lỗi trọng yếu như tự thêm dữ kiện, chọn sai phiên bản, khẳng định được hỗ trợ khi thiếu nguồn hoặc mất dữ kiện sau lỗi phải được ghi rõ và xử lý trước khi mở rộng sử dụng. Không hạ bộ kiểm để làm điểm đẹp.

## 7. Phần đã có và phần cần triển khai riêng

| Hạng mục | Trạng thái ghi nhận trong project |
|---|---|
| Bộ kiểm thử mã/giao diện/API và bằng chứng Gemini cũ | Đã có; cần chọn đúng phần để tái sử dụng. Không chạy lại trong lần tạo tài liệu này. |
| Chấm dữ kiện tự thêm và năm tiêu chí rà nội dung | Đã có trong `demo-hust/src/lib/evaluation.ts`. |
| Lọc ca bằng `EVAL_CASE_IDS`, dấu kiểm tập câu hỏi, lưu kết quả và dừng quota | Đã có trong runner `demo-hust/scripts/evaluate-vercel.ts`; cần rà hành vi tiếp tục khi chuẩn bị vòng mới. Runner hiện chỉ nhận mode Gemini/fixture, không tự hỗ trợ cả tám model. |
| Harness phát lại phản hồi riêng, báo tổng token/ngân sách trước mỗi lượt, tích hợp model mới | Chưa coi là hoàn thành; cần triển khai và kiểm riêng nếu được yêu cầu. Không có cơ chế đo chi phí mới chỉ vì tài liệu này được tạo. |
| Bộ 24 phát triển / 20 đánh giá mới / sáu ca trọng yếu | Đề xuất tiếp theo; chưa viết bộ mới hoặc chạy trong đợt này. |
| Cơ chế dừng theo quota miễn phí và tuyệt đối không tự trả phí | Yêu cầu của phương án; xác minh theo tài khoản và cấu hình trước khi chạy. |

Bằng chứng trạng thái nội bộ để đối chiếu: [biên bản Gemini](../demo-hust/docs/GEMINI_VERCEL_2026-11-10.md), [rà hai kế hoạch](../demo-hust/docs/AUDIT_HAI_KE_HOACH_2026-11-11.md), [tổng hợp tuần 6](Tuan_6/KET_QUA_TUAN_6.md). Các biên bản lịch sử được giữ nguyên.

## 8. Nguồn chính thức đã đối chiếu

Các nguồn sau xác nhận thông số/giá công bố của nhà cung cấp, không chứng minh model đã đạt trên project hoặc tài khoản cá nhân có quota tương ứng.

[S01]: https://aistudio.google.com/docs/pricing#gemini-3.8-flash
[S02]: https://aistudio.google.com/docs/rate-limits
[S03]: https://api-docs.deepseek.com/quick_start/pricing/
[S04]: https://www.alibabacloud.com/help/en/model-studio/model-pricing
[S05]: https://developers.openai.com/api/docs/models/gpt-6-luna
[S06]: https://platform.claude.com/docs/en/about-claude/pricing
[S07]: https://developers.openai.com/api/docs/models/gpt-6.1-terra
[S08]: https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free
[S09]: https://openrouter.ai/collections/free-models
[S10]: https://developers.openai.com/api/docs/models/gpt-6.1-sol

- **S01:** Google AI Studio — Gemini Developer API pricing, gồm Free/Paid và mốc thay đổi giá.
- **S02:** Google AI Studio — quota RPM/TPM/RPD, giới hạn theo project và quyền truy cập tài khoản.
- **S03:** DeepSeek — model đang cung cấp, giá cao điểm/thấp điểm, JSON và các giao thức API.
- **S04:** Alibaba Cloud Model Studio — giá Qwen theo vùng và điều kiện quota thử nghiệm.
- **S05:** OpenAI — GPT-6 Luna, giá, reasoning, structured outputs và giới hạn.
- **S06:** Claude Platform — giá Haiku 5.5 theo độ dài đầu vào; xem thêm [trang Haiku](https://www.anthropic.com/claude/haiku).
- **S07:** OpenAI — GPT-6.1 Terra, giá và khả năng.
- **S08:** OpenRouter — đúng model ID/biến thể Nemotron 3 Ultra free.
- **S09:** OpenRouter — điều kiện của các model miễn phí và hạn mức tài khoản.
- **S10:** OpenAI — GPT-6.1 Sol, giá và khả năng.

**Phạm vi đợt cập nhật:** chỉ bổ sung tệp Markdown này. Không gọi API mô hình, mua credit, bật billing, tích hợp model, sửa mã, triển khai Vercel hoặc thay báo cáo, Excel, nguồn mẫu và bằng chứng cũ.
