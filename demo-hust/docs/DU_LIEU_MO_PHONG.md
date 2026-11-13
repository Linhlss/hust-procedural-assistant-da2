# Hợp đồng dữ liệu đang chạy — T6/CA-01

Bộ dữ liệu này **tự tạo để kiểm chứng hành vi**, không phải quy định HUST. Không chứa trích đoạn từ tài liệu thầy gửi, hạn mức chi hoặc hồ sơ cá nhân. Toàn đề tài giữ KHCN–TCKH–TCNS và tập T1/T3/T4/T6/T10; bản chạy này chỉ thực hiện T6 giữa KHCN–TCKH.

## Thẻ, nguồn, điều kiện — bản cập nhật theo phản hồi

Thẻ T6 giữ KHCN–TCKH. Bộ nguồn chuẩn hóa từ nội dung **tự tạo** ở `src/data/documents.json`; `src/lib/documents.ts` và `sources.ts` dựng nguồn/đoạn. Mỗi đoạn có ID, phiên bản, khoảng áp dụng giả định, vị trí, provenance `synthetic_fixture`, quyền `demo_generated`, chủ nội dung `null` và liên kết tài liệu/đoạn.

- `SIM-NV-1` và `SIM-NV-PREP`: quan hệ phục vụ nhiệm vụ và nội dung chuẩn bị; khoảng mẫu 2025–2028.
- `SIM-CT-2025`: điều kiện địa điểm trong nước cho bản 2025.
- `SIM-CT-2026`: điều kiện trong nước/nước ngoài cho bản 2026; khoảng mẫu 2026–2028. Khác biệt giữa hai bản là quy tắc kiểm thử, không mô tả thay đổi chính sách HUST.
- `SIM-DV-1`, `SIM-DV-COMBINE`, `SIM-DV-PREP`: phạm vi nguồn đơn vị, điều kiện phân định nguồn kết hợp và giấy tờ cần chuẩn bị; khoảng mẫu 2025–2028.
- `SIM-HD-DOCS`, `SIM-HD-STEPS`, `SIM-HD-TIME`: sổ tay giấy tờ, bước tiếp theo, thời điểm chuẩn bị; không tự đặt hạn chót hoặc hạn mức tiền.
- `SIM-CT-CONFLICT`: nguồn mâu thuẫn có chủ ý cho chế độ kiểm thử.

**Profile:** `standard` đầy đủ tài liệu và là mặc định; `missing-unit` lọc nguồn đơn vị khỏi đối chiếu để giữ ca dừng CA-01 cũ; `conflict` thêm nguồn xung đột cùng phạm vi. Việc thiếu/mâu thuẫn chỉ là cách bố trí bộ kiểm thử.

**Tệp thật của bộ mẫu:** 6 tệp `.md` trong `public/tai-lieu/`, tạo bằng `scripts/generate-documents.ts` từ cùng dữ liệu JSON. Thư viện `/tai-lieu` hiển thị 5 tài liệu hướng dẫn; tài liệu xung đột truy cập qua ca kiểm thử. `/tai-lieu/<id>` có trang đọc, từng đoạn có anchor và nút tải file. Test kiểm mọi trích đoạn giống nội dung tệp để không dẫn nguồn không tồn tại.

Không có Điều 14/16/24 thật, hạn mức chi, thông tin cá nhân hoặc nội dung sao chép từ tài liệu thầy gửi trong bộ này. “Tài liệu mẫu tự tạo” xuất hiện ở trang đọc/tệp, và câu trả lời có chú thích ngắn. Không diễn đạt nguồn này như chính sách được xác minh.

## Dữ kiện và phụ thuộc

| Dữ kiện tự khai | Tác động |
|---|---|
| Loại hoạt động | Chọn thẻ T6 hội thảo/công tác. |
| Địa điểm | Điều kiện chung KL2; “quốc tế” không chứng minh ở nước ngoài. |
| Ngày hoạt động | Chọn lại các nguồn theo khoảng áp dụng; không dùng ngày hỏi làm ngày hoạt động. |
| Nguồn kinh phí | KL1; nguồn nhiệm vụ, đơn vị hay kết hợp. |
| Quan hệ phục vụ nhiệm vụ | Chỉ hỏi khi nhánh nhiệm vụ có nguồn đang áp dụng. |
| Phân định các nguồn kết hợp | Chỉ hỏi khi nguồn kết hợp và ảnh hưởng hướng dẫn; không hỏi số tiền. |

Kết luận chứa dữ kiện phụ thuộc, nguồn thực sự dùng, lý do và bước tiếp theo. Lịch sử câu người dùng được gửi riêng từ phiên trình duyệt; máy chủ trích và dựng lại dữ kiện/kết luận từ đầu, không tin kết luận gửi lên. Lịch sử localStorage có tối đa 20 cuộc/30 ngày; giới hạn dung lượng có thể giảm số cuộc cũ hơn. Tải lại trang hay đóng/mở lại trình duyệt không chủ động xóa lịch sử; xóa dữ liệu trình duyệt sẽ mất lịch sử. Không có đồng bộ giữa thiết bị. Transcript kiểm thử lưu từng lượt, dữ kiện trước/sau, nguồn và các kết luận đã thay thế.

## Điểm dừng

Thiếu dữ kiện thì hỏi; người hỏi không biết/không cung cấp thì nêu khả năng có điều kiện. Thiếu nguồn hoặc mâu thuẫn nguồn thì dừng đúng phần, giữ phần đủ căn cứ và chỉ đầu mối. Ở profile thiếu nguồn, không trả các đoạn riêng nguồn đơn vị. Nguồn đơn vị mới chưa rõ thay thế/kết hợp thì hỏi làm rõ, không tự loại nguồn nhiệm vụ. Khi thay thế hoàn toàn, ngừng dùng nguồn/kết luận chỉ dành cho nhiệm vụ; giữ điều kiện chung. Ngày/địa điểm sửa mơ hồ khiến phần liên quan chuyển về chưa đủ căn cứ.

## Hai chế độ hiểu câu

- `fixture` (mặc định): bộ trích xuất tiếng Việt có giới hạn; hiểu một số diễn đạt tương đương, ngày ISO hoặc ngày/tháng/năm, các nhánh thay thế/kết hợp. Không phải mô hình ngôn ngữ; không cam kết hiểu mọi diễn đạt tự nhiên. Không gọi dịch vụ mô hình.
- `openai`: adapter Responses API theo [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs). Chỉ trích các bản cập nhật dữ kiện của cả lịch sử trong một request có timeout; mã kiểm schema, số lượt, ngày và tái dựng kết luận. `store:false`. Cấu hình máy chủ bằng `CHAT_ADAPTER`, `OPENAI_API_KEY`, `OPENAI_MODEL`; không tự chuyển về fixture khi lỗi. Đã thử bằng phản hồi mô phỏng, **chưa kiểm chứng API/mô hình thật**, chưa cấu hình key cho deployment.

Cả hai chế độ đều dùng nguồn giả định; bật mô hình không biến demo thành tư vấn chính sách được xác minh. Chưa có nguồn gốc/đáp án được chủ nội dung HUST duyệt.

## Bổ sung luồng hội thoại ngày 28/10/2026

`src/lib/clarification.ts` xác định câu hỏi tiếp theo từ dữ kiện thực sự còn thiếu và nguồn đang áp dụng. Mỗi lượt có tối đa một câu hỏi, lý do, lựa chọn trả lời và field đang chờ; ngày có ô chọn. `converse` dựng lại trạng thái từ lịch sử user để hiểu câu ngắn theo câu vừa hỏi, không nhận kết luận từ trình duyệt. Câu cá nhân “cần làm gì” không còn bị nhánh hỏi hướng dẫn chung bỏ qua thu thập dữ kiện; câu hỏi tham khảo chung vẫn trả trực tiếp.

Lịch sử lưu cả trạng thái câu hỏi đang chờ. Không có nguồn đơn vị trong profile `missing-unit` thì không hỏi phân định như thể người dùng bổ sung là có thể thay việc xác minh nguồn. Có thể từ chối cung cấp; ngày không hợp lệ hoặc trả lời chưa hiểu giữ đúng câu cần làm rõ. Khi mô tả trường hợp cá nhân mới sau ca đã đủ dữ kiện, bot hỏi tiếp tục hay tình huống mới trước khi dùng lại dữ kiện.

Nội dung hướng dẫn được diễn đạt riêng, có các ý chuẩn bị; trích nguyên văn chỉ nằm trong phần nguồn. Bấm số căn cứ mở đoạn tương ứng. Thay đổi chủ đề thông tin không còn tạo kết luận nghiệp vụ “đã thay thế” giả; thay đổi nguồn/dữ kiện thực sự vẫn đánh dấu phần phụ thuộc.

## Thu gọn hội thoại và căn cứ

`src/lib/timeline.ts` chỉ tạo mô hình hiển thị từ các lượt gốc, không xóa hoặc ghi lại lịch sử user/API. Chuỗi liên tiếp đang hỏi được hiển thị bằng một câu đang chờ và các dòng dữ kiện đã trả lời. Khi hoàn tất, chỉ hiện câu trả lời cuối; các cặp hỏi–đáp chuyển vào tab thông tin của căn cứ. Thay đổi kết luận nghiệp vụ so với tình huống trước vẫn được giữ, nhưng không lặp các cập nhật trung gian trong quá trình thu thập dữ kiện ban đầu.

`src/components/Evidence.tsx` nhóm đoạn theo tài liệu, chỉ mở một nhóm, tách nguồn với dữ kiện tự khai. Các số tham chiếu vẫn ứng với từng đoạn chính xác; liên kết toàn văn giữ anchor của đoạn đang được xem. Chưa đổi thẻ/nguồn/chính sách hoặc thêm nghiệp vụ TCNS.

## Phản hồi và câu hỏi chuẩn bị sau góp ý mới

Mặc định câu hỏi giấy tờ/các bước/thời điểm đi qua làm rõ hoạt động, nguồn kinh phí và ngày để chọn nguồn chuẩn bị đúng phạm vi/thời gian. Không hỏi địa điểm, quan hệ nhiệm vụ hoặc phân định nội dung nếu chỉ cần danh mục chuẩn bị; các trường đó vẫn được hỏi khi đánh giá điều kiện cần chúng. `requestedTopic`/`preparationOnly` giữ mục tiêu ban đầu qua trả lời ngắn và lịch sử. Nguồn chuẩn bị được lọc theo ngày/profile, thiếu nguồn dừng đúng phần. Yêu cầu tổng quan rõ ràng và tìm thư viện vẫn trực tiếp; từ chối cung cấp được tôn trọng. Thay đổi này thay thế hành vi trả chung mặc định mô tả trong các mục lịch sử ở trên.

UI không tự cuộn khi gửi hoặc nhận đáp án. API bắt đầu xử lý ngay; phản hồi chờ hiện tối thiểu 650ms, kết quả chỉ hiện sau khi API hoàn tất. Lỗi/hủy/đổi cuộc không tạo kết quả giả hoặc giữ loader. Lịch sử đóng/mở được, lựa chọn hiển thị được lưu riêng với dữ liệu hội thoại.

## Ranh giới dữ kiện sau củng cố T6

Phủ định hoạt động/nguồn được xét theo mệnh đề; nguồn/hoạt động/ngày mơ hồ không giữ giá trị cũ để kết luận. Các dạng ngày đầy đủ dd/mm/yyyy, dd.mm.yyyy, dd-mm-yyyy, ISO và ngày viết bằng chữ được kiểm ngày lịch; không tự điền năm hoặc suy ra ngày từ “tháng sau”. Các thẻ T1/T3/T4/T10 chỉ được nhận diện để thông báo chưa hỗ trợ, không bổ sung nguồn hoặc chính sách cho chúng.

Khi chưa rõ ca mới hay sửa ca cũ, `pendingSituation` giữ toàn bộ dữ kiện mới riêng với dữ kiện đang dùng; chọn ca mới xóa thông tin cũ, chọn tiếp tục hợp nhất phần mới và hỏi thêm quan hệ nguồn khi chưa rõ thay thế/kết hợp. `pendingSituationAction` và `intent` là metadata tùy chọn, lịch sử cũ vẫn đọc được. Phản hồi ngoài phạm vi không được ghi như đã trả lời thành công câu hỏi đang chờ.
