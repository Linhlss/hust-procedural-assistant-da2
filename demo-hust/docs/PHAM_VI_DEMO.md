# Phạm vi xây demo

Trích từ requirement hiện hành và báo cáo tiến độ 02, đối chiếu ngày 27/10/2026. Danh mục và dấu kiểm toàn vẹn nằm trong [nguồn thiết kế](NGUON_THIET_KE.md); không dùng các gói A/B1, KT2 hoặc N01–N03 làm phạm vi mới.

## Điều chỉnh sau phản hồi ngày 28/10/2026

Người dùng yêu cầu giảm nhãn lặp, lưu lịch sử và chuẩn bị tài liệu mẫu đầy đủ. Trải nghiệm mặc định hiện dùng tập `standard` có nguồn đơn vị cùng các hướng dẫn chuẩn bị. CA-01 với nguồn đơn vị vắng mặt ở phần dưới được giữ như **biến thể kiểm thử `missing-unit`**, không ép người dùng thông thường luôn gặp thiếu nguồn. Nhánh `conflict` vẫn dùng để kiểm dừng đúng khi nguồn mâu thuẫn.

Nhãn nguồn giả định được diễn đạt gọn là “tài liệu mẫu”, có một chú thích ở câu trả lời và tại tài liệu đầy đủ. Thông tin chế độ nằm trong “Bản trải nghiệm”. Lịch sử lưu trên trình duyệt hiện tại, có danh sách mở lại/xóa; chưa có đồng bộ tài khoản. Ranh giới tư vấn, thẩm quyền và phạm vi T6 không thay đổi.

## Điều chỉnh hỏi bổ sung và phản hồi theo góp ý tiếp theo

Câu mẫu hỏi giấy tờ/các bước/thời điểm không mặc định trả danh sách chung nữa. Với yêu cầu chuẩn bị, làm rõ hoạt động, nguồn kinh phí và thời điểm khi còn thiếu để chọn tài liệu áp dụng, giữ nguyên mục tiêu qua các lượt trả lời. Không yêu cầu địa điểm/quan hệ nhiệm vụ nếu chúng không đổi danh mục chuẩn bị. Luồng kiểm điều kiện T6 vẫn hỏi các trường phụ thuộc nguồn; yêu cầu tổng quan rõ ràng, tìm tài liệu hoặc từ chối cung cấp được xử lý có giới hạn. Đây là điều chỉnh trải nghiệm F01, không bổ sung chính sách hoặc phạm vi hành chính.

Khi gửi/nhận câu trả lời, trang giữ vị trí đọc. Trạng thái đang rà soát hiển thị trong lúc yêu cầu thực sự xử lý, có nút chủ động xem phản hồi mới; lịch sử có đóng/mở.

## 1. Mục tiêu

Chứng minh chatbot có thể làm rõ một tình huống, đối chiếu quy định thuộc KHCN–TCKH và kiểm tra lại hướng dẫn khi người hỏi đổi dữ kiện. Người xem mở website trên Vercel, nhập tiếng Việt, xem câu trả lời và đoạn căn cứ tương ứng. Đây là demo đầu tiên của đề tài chatbot ba Ban, không phải toàn bộ sản phẩm trong 11 tuần.

## 2. Tình huống trình diễn chính: T6 / CA-01

**Tình huống mô phỏng:** cán bộ hỏi về việc tham dự hội thảo bằng kinh phí nhiệm vụ; chưa nêu đủ địa điểm/thời điểm. Sau khi được hướng dẫn, người hỏi đổi sang kinh phí đơn vị, thay thế hoàn toàn nguồn nhiệm vụ.

| Chặng | Hành vi cần xây | Kết quả người xem thấy |
|---|---|---|
| Nhận yêu cầu | Nhận diện tư vấn hội thảo/công tác, ghi dữ kiện người hỏi đã cung cấp. | Câu hỏi tiếp nối phù hợp, không bắt khai danh tính hay nộp hồ sơ. |
| Làm rõ | Hỏi dữ kiện còn thiếu chỉ khi điều kiện trong nguồn cần chúng. | Không hỏi lại thông tin đã có; hiểu được cách diễn đạt tương đương. |
| Đối chiếu | Tách phần nhiệm vụ và phần tài chính, chọn đúng nguồn theo phạm vi và thời điểm. | Kết luận theo từng phần, dữ kiện sử dụng và căn cứ. |
| Đổi thông tin | Xác định nguồn mới thay thế hay kết hợp; chọn lại thẻ/nguồn, đánh giá kết luận phụ thuộc. | Phần đã thay đổi và lý do; kết luận cũ không tiếp tục được trình bày như còn áp dụng. |
| Dừng có căn cứ | Trong CA-01, quy định riêng của đơn vị chưa có trong tập thử. | Phần cần nguồn này được ghi chưa đủ căn cứ; phần quy định chung còn đủ căn cứ vẫn được trả lời. |

Việc thiếu nguồn riêng của đơn vị là **cách bố trí ca thử**, không phải kết luận HUST thiếu văn bản. Mọi nội dung định mức, hạn hoặc điều kiện cụ thể phải có nguồn đã kiểm tra; nếu dùng quy tắc giả định, hiển thị rõ chế độ mô phỏng.

## 3. Năm năng lực bắt buộc

| Mã | Yêu cầu quan sát được |
|---|---|
| F01 | Hỏi bổ sung có mục đích, đủ dữ kiện quyết định và không hỏi thừa. |
| F02 | Đối chiếu nguồn đúng phần của cùng tình huống; không ghép thêm Ban không liên quan. |
| F03 | Sau khi sửa dữ kiện, chọn lại thẻ/nguồn rồi kiểm kết luận phụ thuộc; giữ phần vẫn đúng và đánh dấu phần đã thay thế. |
| F04 | Phân biệt đáp ứng theo khai báo / không đáp ứng theo khai báo / chưa đủ căn cứ cho từng kết luận điều kiện. Kết luận về khả năng áp dụng nguồn cần mô tả riêng, không gán nhãn đủ điều kiện tài chính cho toàn bộ ca. |
| F05 | Mỗi kết luận có dữ kiện, điều kiện, đoạn nguồn, phiên bản/mốc áp dụng nếu biết, giới hạn và bước tiếp theo. Không bịa metadata còn thiếu. |

## 4. Đầu vào, xử lý, đầu ra

- **Đầu vào:** câu hỏi, thông tin người dùng cung cấp và lịch sử riêng của phiên; thẻ T6; nguồn đã phân loại; quy tắc có bằng chứng hoặc quy tắc giả định được tách riêng.
- **Xử lý:** nhận diện ý định → cập nhật dữ kiện → chọn thẻ/nguồn → hỏi nếu thiếu dữ kiện quyết định → đối chiếu điều kiện → trả lời theo từng phần. Nếu thiếu/mâu thuẫn căn cứ chưa giải quyết, dừng phần liên quan. Sửa dữ kiện quay lại chọn thẻ/nguồn.
- **Đầu ra:** nội dung tư vấn; thông tin đang dùng; kết luận và trạng thái; trích đoạn hỗ trợ; nội dung thay đổi; phần chưa thể kết luận và bản tóm tắt để người dùng tự trao đổi với đầu mối phụ trách.

Mô hình ngôn ngữ hỗ trợ hiểu và diễn đạt; mã nghiệp vụ kiểm tra dữ kiện, phạm vi nguồn và trạng thái kết luận. Không dùng câu trả lời tự do của mô hình làm quyết định cuối không kiểm tra.

## 5. Ranh giới phải giữ

- Không truy xuất hồ sơ cá nhân sinh viên/nhân sự, tuyển dụng hoặc tính kNC/đánh giá cá nhân.
- Không xác nhận tiền, lương thực nhận, số dư, ghi sổ hoặc chi trả. Không cần công cụ tính trong demo.
- Không nhận hoặc tiền kiểm bộ hồ sơ; không tạo ticket, luân chuyển, duyệt/ký/nộp thay hoặc ghi iGov/eHUST/BKOffice.
- Không bắt buộc form, nhắc hạn, kiến trúc nhiều agent, cơ sở dữ liệu lớn hay mô phỏng hệ thống HUST.
- Không tự gửi thông tin cho cán bộ/người hướng dẫn. Người dùng tự chuyển bản tóm tắt khi cần.
- Không gọi dữ liệu mô phỏng là nghiệp vụ đã xảy ra; không suy ra tần suất, giảm tải hoặc vượt sản phẩm khác từ một demo.

## 6. Phần đề tài đầy đủ được giữ lại

**Chốt ngày 02/11/2026:** người làm đề tài chọn năm nhóm T1/T3/T4/T6/T10 và các nhánh phụ thuộc làm phạm vi hoàn thành. Chưa cam kết sở hữu trí tuệ/hợp tác; nguồn lịch sử thu theo nhiệm vụ/nghĩa vụ đang tiếp diễn hoặc giấy tờ tồn đọng và chuyển tiếp. Xem [danh mục triển khai ngoài ứng dụng](../../Artifact_De_tai_chinh/11_TRIEN_KHAI_DANH_MUC_DU_LIEU_BO_SUNG_2026-11-02.md). Runtime demo vẫn chỉ là T6.

T10 giữ miền TCNS; không cố đưa TCNS vào hội thoại T6. Có thể chia nhỏ thẻ trong năm nhóm để tổ chức tri thức nhưng không tự thêm chủ đề. Khoảng 12 thẻ là ước lượng cũ, không phải số bắt buộc. Khoảng 120–150 ca vẫn là quy mô đánh giá đề xuất trong 11 tuần, chưa phải bộ đáp án đã xác nhận hoặc yêu cầu hoàn thành trước demo đầu tiên.

C0/C1/C2 là cấu hình đối chứng về sau, không phải mã thẻ. Không đổi T1 thành C1 hoặc dựng đầy đủ ba cấu hình chỉ để trình diễn CA-01.

## 7. Điều kiện gọi demo là đã hoàn thành

Có ứng dụng chạy thực; hội thoại T6 thể hiện F01–F05 với bằng chứng và nhãn nguồn phù hợp; vượt qua ca trọng yếu về thay đổi dữ kiện, thiếu/mâu thuẫn căn cứ, nhiều phiên và lỗi mô hình; build thành công và dùng được trên URL Vercel của người nhận link. Demo mô phỏng có thể chứng minh hành vi nhưng chưa chứng minh tư vấn đúng chính sách HUST hiện hành. Kết quả chỉ được ghi sau khi chạy.
