# Báo cáo khảo sát và đề xuất đề tài Đồ án 2

**Tên đề tài đề xuất:** Chatbot tư vấn thủ tục theo tình huống cho Ban Khoa học–Công nghệ, Ban Tài chính–Kế hoạch và Ban Tổ chức–Nhân sự tại HUST.

**Định hướng hiện tại:** tập trung xây dựng và đánh giá chatbot tiếng Việt có hỏi bổ sung, đối chiếu điều kiện và giải thích căn cứ. Không đặt mục tiêu tìm hoặc thực hiện một quy trình hành chính tự động mới. Danh mục nội dung cụ thể và tiêu chí nghiệm thu được trình người hướng dẫn xác nhận trước khi triển khai.

## 1. Bài toán

Khi chuẩn bị một hoạt động nghiên cứu hoặc thủ tục công tác, một cán bộ HUST có thể bắt đầu bằng câu hỏi ngắn như “Trường hợp của tôi áp dụng quy định nào và cần làm gì tiếp?”. Để trả lời, người tư vấn cần biết thêm loại hoạt động, đơn vị, thời điểm và nguồn kinh phí. Một số tình huống chỉ cần quy định của một Ban; những tình huống khác cần đối chiếu nội dung của nhiều Ban. Nếu người hỏi bổ sung hoặc thay đổi dữ kiện, hướng dẫn trước đó có thể phải xem lại.

Đề tài tập trung vào công việc **làm rõ tình huống và tư vấn có căn cứ** trước khi người dùng thực hiện thủ tục tại hệ thống hoặc đầu mối có thẩm quyền. Đối tượng sử dụng là cán bộ, giảng viên và chuyên viên hỗ trợ; mỗi Ban có một chủ nội dung chịu trách nhiệm xác nhận nguồn và đáp án thuộc phạm vi mình phụ trách. Đây là mô hình sử dụng đề xuất, chưa phải xác nhận các Ban đã nhận vận hành sản phẩm.

## 2. Vấn đề và căn cứ khảo sát

Hai tài liệu định hướng do người hướng dẫn cung cấp đã liệt kê các nhóm câu hỏi, thẻ thủ tục, điều kiện và điểm giao giữa nghiên cứu, tài chính và công tác cán bộ. Chúng cũng chỉ ra nhu cầu bổ sung văn bản thủ tục gốc, phân biệt dự thảo với bản chính thức và xác định phạm vi áp dụng theo đơn vị. **Tài liệu phân tích không thay thế quy định có hiệu lực hoặc xác nhận nghiệp vụ thực tế.**

Các vấn đề cần giải quyết trong sản phẩm:

- **Câu hỏi thiếu dữ kiện:** truy xuất đúng chủ đề vẫn có thể dẫn đến hướng dẫn sai nếu chưa biết điều kiện quyết định đáp án.
- **Nhiều quy định cùng liên quan:** phải xác định từng nguồn áp dụng cho phần nào, thay vì ghép các đoạn văn thành một câu trả lời thiếu nhất quán.
- **Thông tin thay đổi qua hội thoại:** kết luận đã trả có thể không còn phù hợp sau khi người hỏi đổi thời điểm, loại đơn vị hoặc nguồn kinh phí.
- **Giới hạn của căn cứ:** thông tin khai báo không chứng minh tình trạng hồ sơ thật; nguồn thiếu hoặc mâu thuẫn phải dẫn đến một điểm dừng rõ ràng.
- **Khó kiểm tra câu trả lời:** đường dẫn tài liệu chung chưa đủ; người đọc cần thấy dữ kiện, điều kiện và đoạn nguồn hỗ trợ từng kết luận.

HUST đã có HUST Assistant; MISA có các chức năng hỏi đáp từ tài liệu và đồng bộ nguồn. Vì vậy, giao diện chat, dẫn nguồn hoặc mở thêm một miền nội dung **không được coi là điểm mới độc lập**. Đề tài dự kiến đóng góp ở cách tổ chức và đánh giá hội thoại tư vấn theo điều kiện trong tập tình huống HUST hữu hạn, không khẳng định đây là chức năng chưa từng tồn tại.

**Về tần suất:** chưa có thống kê lượt hỏi theo tháng hoặc thời gian chuyên viên dành cho từng nhóm. Các nhóm dưới đây là ứng viên nội dung, chưa được gọi là nhóm hỏi nhiều nhất. Trong khảo sát tiếp theo, ưu tiên câu hỏi đã ẩn danh hoặc xếp hạng của chuyên viên; chỉ báo cáo mức giảm thời gian khi có số đo phù hợp. Việc có nhiều văn bản hay chatbot chạy thường xuyên không chứng minh nhu cầu hỗ trợ phát sinh đều quanh năm.

## 3. Giải pháp và sản phẩm đề xuất

Sản phẩm là một **web/chatbot tiếng Việt độc lập**, dùng hội thoại làm giao diện chính. Thẻ nguồn, dữ kiện đang sử dụng và bản giải thích hỗ trợ người dùng kiểm tra câu trả lời. Nguyên mẫu không cần quyền ghi vào iGov, eHUST hoặc BKOffice.

Luồng tư vấn dự kiến:

**Câu hỏi → nhận diện tình huống và nguồn được phép → hỏi dữ kiện quyết định còn thiếu → đối chiếu điều kiện → trả kết luận kèm căn cứ và bước tiếp theo.**

Khi người dùng đổi dữ kiện, hệ thống quay lại bước đối chiếu và cập nhật các kết luận liên quan. Nếu thiếu nguồn, mâu thuẫn hoặc cần xác nhận tình trạng thực, chatbot nêu điểm chưa xác minh và tạo bản tóm tắt để người dùng trao đổi với chuyên viên; không tự gửi hồ sơ hoặc giao việc.

### 3.1. Năm năng lực bắt buộc

| Năng lực | Cách xử lý và kết quả phải thể hiện | Cách kiểm chứng |
|---|---|---|
| **F01. Hỏi bổ sung có mục đích** | Xác định dữ kiện có thể làm thay đổi hướng dẫn, chẳng hạn đối tượng, loại nhiệm vụ, đơn vị, thời điểm hoặc nguồn kinh phí. Chỉ hỏi dữ kiện còn thiếu và có ảnh hưởng tới kết quả; không bắt người dùng khai toàn bộ thông tin của mọi thủ tục. Nếu người hỏi không cung cấp, nêu giới hạn hoặc trả các trường hợp có điều kiện. | So sánh hai ca chỉ khác một dữ kiện quyết định; kiểm tra bot có hỏi đúng thông tin cần thiết, tránh hỏi lại dữ kiện đã có và tránh câu hỏi không phục vụ đáp án. |
| **F02. Đối chiếu điều kiện giữa các Ban** | Chọn đúng quy định cho từng phần của cùng tình huống, kiểm tra chúng theo cùng bộ dữ kiện và trình bày hướng dẫn nhất quán. Nêu rõ điều kiện thuộc KHCN, TCKH hay TCNS; không suy ra câu hỏi giao nguồn là hồ sơ bắt buộc đi qua các Ban. | Ca một Ban và ca giao Ban có bộ nguồn/đáp án chuẩn; kiểm tra việc chọn nguồn, áp dụng điều kiện và phát hiện kết luận không tương thích. |
| **F03. Kiểm tra lại khi dữ kiện thay đổi** | Lưu các dữ kiện và kết luận trong phiên tư vấn. Khi người dùng sửa dữ kiện, xét lại thẻ và nguồn đang áp dụng rồi kiểm tra các kết luận phụ thuộc dữ kiện đó; chỉ rõ nội dung thay đổi và lý do. Kết luận cũ được đánh dấu đã thay thế, không tiếp tục hiển thị như vẫn áp dụng. Đây là cập nhật tư vấn, không phải cập nhật hồ sơ nghiệp vụ. | Hội thoại nhiều lượt đổi thời điểm, loại đơn vị hoặc nguồn kinh phí; kiểm tra kết quả cuối dựa trên dữ kiện mới và không làm thay đổi vô cớ những kết luận không liên quan. |
| **F04. Phân biệt mức kết luận** | Với từng kết luận điều kiện, trả một trong ba trạng thái: **đáp ứng theo thông tin khai báo / không đáp ứng theo thông tin khai báo / chưa đủ căn cứ**. Nêu dữ kiện chưa xác minh, nguồn mâu thuẫn và điều kiện cần chuyên viên xác nhận. Nếu một phần rõ và một phần chưa rõ, phân tách kết luận thay vì gán cả câu trả lời là đủ điều kiện. | Ca đạt, không đạt, thiếu dữ kiện, thiếu nguồn, mâu thuẫn và yêu cầu vượt thẩm quyền. Phân biệt đúng theo khai báo với xác nhận đủ điều kiện chính thức. |
| **F05. Giải thích có thể kiểm tra** | Mỗi kết luận có dữ kiện đã dùng, điều kiện áp dụng, văn bản/điều khoản, đoạn nguồn và phiên bản hoặc mốc hiệu lực liên quan; kèm thông tin còn thiếu và bước tiếp theo. Nguồn phải hỗ trợ nội dung kết luận, không chỉ gần chủ đề. | Người chấm mở được đoạn nguồn, đối chiếu kết luận và nhận diện giả định. Kiểm tra lỗi dẫn nguồn đúng tên nhưng không hỗ trợ câu trả lời. |

Các câu hỏi chỉ cần tra thông tin trực tiếp được trả lời ngay nếu đủ căn cứ; không ép mọi câu hỏi đi qua toàn bộ năm bước. Thẻ thủ tục là cấu trúc quản trị nội dung, không phải một quy trình tiếp nhận/duyệt hồ sơ.

### 3.2. Phạm vi nội dung của ba Ban

| Miền | Nội dung dự kiến chọn trong tập được duyệt | Ranh giới |
|---|---|---|
| **KHCN** | Điều kiện, mốc và hướng dẫn thủ tục nhiệm vụ nghiên cứu; thay đổi, gia hạn, nghiệm thu; hướng dẫn công khai về sở hữu trí tuệ/hợp tác nếu đủ nguồn. | Không xét chọn, phê duyệt, nghiệm thu, chấm liêm chính hoặc xử lý công bố tự động. Không mở lại họ câu hỏi quy đổi kNC đã loại. |
| **TCKH** | Hướng dẫn quy định tài chính, nguồn kinh phí, định mức áp dụng, thành phần chứng từ và đầu mối theo từng loại tình huống được duyệt. | Không nhận/tiền kiểm bộ chứng từ, thẩm định khoản chi, xác nhận số dư, tính lương thực nhận, ghi sổ hoặc chi trả. Liệt kê hồ sơ chỉ là hướng dẫn. |
| **TCNS** | Phạm vi hẹp về cử cán bộ đi đào tạo/nghiên cứu/công tác theo quy định: đối tượng, điều kiện, thời hạn và nghĩa vụ. Chỉ thêm chủ đề khác khi có nguồn, người duyệt và thời gian. | Không tuyển dụng, hồ sơ nhân sự cá nhân, đánh giá/xếp loại, tính kNC hay quyết định chế độ thực nhận. Không cam kết bao phủ toàn Ban. |

**Câu hỏi giao Ban** được chọn theo nguồn và ca hỏi thực tế, không theo mục tiêu đủ bảy tổ hợp. Các hướng để xác nhận gồm:

- KHCN–TCKH: quy định nhiệm vụ và hướng dẫn tài chính cùng áp dụng cho một hoạt động nghiên cứu dự kiến.
- TCNS–KHCN: đi đào tạo/nghiên cứu trong khi đang tham gia nhiệm vụ, cần làm rõ điều kiện và đầu mối nào.
- TCNS–TCKH: điều kiện chung của hỗ trợ đào tạo/công tác theo loại đối tượng và nguồn được phép.
- Cả ba: chỉ bổ sung khi một tình huống có căn cứ thực sự cần ba miền; không mặc định là nội dung bắt buộc.

Các ví dụ trên là **ứng viên kiểm thử**, chưa phải tuyến nghiệp vụ hoặc đáp án HUST đã xác nhận. Việc hướng dẫn thủ tục mua sắm/thanh toán không được trình bày là xây lại quy trình iGov.

### 3.3. Khối lượng và phần ngoài phạm vi

**Mốc lập kế hoạch trong 11 tuần:** khoảng **12 thẻ nội dung**, không chia đều bắt buộc theo Ban; khoảng **bốn nhóm tình huống giao Ban** dùng lại nguồn của các thẻ này; khoảng **120–150 ca đánh giá**. [Báo cáo tiến độ 02](08_BAO_CAO_TIEN_DO_02.md) đặc tả trước T1/T3/T4/T6/T10 từ tài liệu nguồn; tập ban đầu này không thay phạm vi cuối và chưa được triển khai thành chương trình. Số lượng cuối cùng phụ thuộc nguồn chính thức và khả năng duyệt đáp án. Bốn nhóm giao Ban không được cộng thành bốn quy trình hành chính hoặc bốn thẻ độc lập nếu chỉ dùng lại cùng quy tắc.

Ngoài phạm vi: tiếp nhận và luân chuyển hồ sơ, tạo ticket nghiệp vụ, duyệt/ký, gửi thông báo thay chuyên viên, ghi dữ liệu hệ thống HUST, tiền kiểm hồ sơ trước nộp, tuyển dụng, tra hồ sơ cá nhân sinh viên, truy hồ sơ nhân sự/sổ kế toán và xử lý giao dịch thật. Không cam kết công cụ tính, điền biểu mẫu hoặc nhắc hạn trong phiên bản này. N01–N03 và KT2 chỉ là tài liệu khảo sát tham khảo, không phải chức năng sẽ xây.

## 4. Đầu vào, xử lý và đầu ra

### Đầu vào

- Câu hỏi tiếng Việt, lịch sử hội thoại và dữ kiện người dùng tự cung cấp cho tình huống; không mặc định lưu lâu dài thông tin nhạy cảm.
- Văn bản chính thức được phép dùng, hướng dẫn/biểu mẫu đã xác minh và thẻ thủ tục có chủ nội dung. Mỗi nguồn lưu đơn vị phụ trách, trạng thái, mốc hiệu lực, phiên bản, phạm vi áp dụng và đoạn căn cứ.
- Bộ điều kiện đã được kiểm tra với chủ nội dung. Các bản phân tích hoặc dự thảo chỉ phục vụ khảo sát, không làm căn cứ kết luận chính sách đang có hiệu lực.

### Xử lý

Nhận diện miền và điều kiện còn thiếu; tìm nguồn trong phạm vi được phép; hỏi bổ sung khi cần; đối chiếu quy tắc theo dữ kiện; kiểm tra mâu thuẫn/giới hạn; lập câu trả lời có bằng chứng. Mô hình ngôn ngữ hỗ trợ hiểu và diễn đạt; bộ dữ kiện và kiểm tra điều kiện giúp kết quả có thể kiểm thử. Quy tắc chưa rõ không được tự chuyển thành một quyết định chắc chắn.

### Đầu ra

- Câu trả lời trực tiếp hoặc hướng dẫn phân theo phần việc của các Ban liên quan.
- Dữ kiện/giả định đang dùng; trạng thái của từng kết luận; điều kiện được và chưa được xác minh.
- Đoạn nguồn hỗ trợ từng kết luận, mốc áp dụng, thông tin cần bổ sung và bước/đầu mối tiếp theo.
- Khi người dùng sửa thông tin: kết luận đã cập nhật và lý do thay đổi. Khi phải dừng: bản tóm tắt câu hỏi, dữ kiện, nguồn đã kiểm tra và vấn đề cần chuyên viên xác nhận, để người dùng tự chuyển tiếp.

Đầu ra là **kết quả tư vấn**, không phải quyết định hành chính, chứng từ, trạng thái phê duyệt hoặc xác nhận khoản tiền.

## 5. Phương pháp thực hiện và dữ liệu kiểm chứng

1. **Chuẩn hóa phạm vi và nguồn:** đối chiếu tài liệu định hướng được cung cấp với văn bản gốc, chọn thẻ ưu tiên và người xác nhận từng miền. Ưu tiên nguồn HUST công khai từ 2024 đến hiện tại; các tình huống cần bản nguồn hoặc hiệu lực chưa xác minh phải được ghi rõ.
2. **Mô hình hóa tình huống:** định nghĩa dữ kiện quyết định, điều kiện và quan hệ phụ thuộc giữa dữ kiện–kết luận; xác định trường hợp trả lời ngay, hỏi lại hoặc dừng. Không mặc định cần một hệ thống nhiều agent.
3. **Xây chatbot:** kết hợp truy xuất tài liệu, bộ kiểm tra điều kiện và trạng thái phiên hội thoại. Phân tách nguồn với nội dung người dùng cung cấp; kiểm tra quyền trước khi truy xuất tài liệu nội bộ nếu thử nghiệm được cấp loại nguồn này.
4. **Xây bộ đánh giá:** chuyên viên xác nhận nguồn/đáp án của các ca chính; chuẩn bị ca thông thường, giao Ban, thiếu dữ kiện, thay đổi giữa hội thoại, khác thời điểm, mâu thuẫn và ngoài phạm vi.
5. **Thử nghiệm và hoàn thiện:** đo kết quả trên tập kiểm thử đã tách, sửa lỗi trên tập phát triển, tổ chức dùng thử nhỏ khi có đầu mối; báo cáo rõ mức cải thiện và giới hạn.

**Dữ liệu thật:** văn bản, hướng dẫn và biểu mẫu HUST được phép sử dụng; câu hỏi thực tế đã ẩn danh khi được cung cấp. **Dữ liệu mô phỏng:** tình huống, đối tượng/nguồn kinh phí khai báo và các biến thể kiểm thử chưa có ca thật; gắn nhãn riêng. Không biến một ca mô phỏng thành bằng chứng tần suất hoặc sự cố đã xảy ra. Không cần mô phỏng toàn bộ eHUST/BKOffice hoặc hàng chục nghìn hồ sơ sinh viên.

## 6. Thiết kế đánh giá và mức đóng góp

So sánh ba cấu hình trên cùng nguồn, mô hình nền và tập kiểm thử:

- **C0:** hỏi đáp truy xuất tài liệu cơ bản, không có cơ chế hỏi bổ sung và kiểm tra điều kiện được thiết kế riêng.
- **C1:** C0 bổ sung hỏi làm rõ theo tình huống.
- **C2:** C1 kết hợp kiểm tra điều kiện, đối chiếu giao Ban và cập nhật kết luận khi đổi dữ kiện.

C0–C2 là các cấu hình thử nghiệm để so sánh tác động của việc hỏi bổ sung và nhóm cơ chế kiểm tra/cập nhật kết luận. Giữ cùng giới hạn truy cập, ngân sách xử lý và cấu hình sinh câu trả lời để so sánh có ý nghĩa; ghi lại các yếu tố chưa kiểm soát được. Nếu được quyền, đối chiếu thêm HUST Assistant/MISA trên cùng ca và ghi đúng phiên bản/chức năng thực sự truy cập được. Chưa được tiếp cận không phải bằng chứng hệ thống thiếu tính năng.

**Cách tổ chức chấm:** mỗi ca có câu hỏi, dữ kiện quyết định, nguồn/phiên bản áp dụng, kết luận mong đợi và điều kiện phải hỏi lại hoặc dừng. Chuyên viên xác nhận bộ đáp án trước khi đánh giá cuối. Ba cấu hình nhận cùng câu hỏi và dữ kiện ban đầu; dùng cùng bộ phản hồi người dùng đã chuẩn bị để trả lời khi hệ thống hỏi bổ sung. Ghi lại các lượt hỏi và phần thông tin đã nhận để giải thích chênh lệch. Với ca đổi dữ kiện, chấm cả kết luận cuối và cách xử lý kết luận cũ. Báo cáo lỗi theo từng năng lực, không chỉ đưa một tỷ lệ đúng chung.

Chỉ số báo cáo riêng:

- Độ đúng và đầy đủ của kết luận; độ đúng điều kiện/nguồn theo đối tượng và thời điểm.
- Tỷ lệ dẫn chứng hỗ trợ đúng kết luận; khả năng nhận diện thiếu/mâu thuẫn căn cứ.
- Số câu hỏi bổ sung cần thiết và thừa, dựa trên bộ dữ kiện chuyên viên xác nhận.
- Tính nhất quán sau khi sửa dữ kiện; tỷ lệ giữ lại kết luận cũ không còn phù hợp.
- Khả năng dừng đúng, số kết luận vượt căn cứ/thẩm quyền, thời gian phản hồi và thời gian người dùng hoàn thành tình huống.

Tách tập phát triển và kiểm thử theo **nhóm tình huống gốc**; các câu diễn đạt lại của cùng ca không nằm ở cả hai tập và không được đếm là những ca nghiệp vụ độc lập. Phân tích riêng câu hỏi một Ban và giao Ban. Ngưỡng nghiệm thu thống nhất trước đợt đánh giá cuối; không cam kết sẵn một tỷ lệ đúng hoặc mức tiết kiệm chưa được đo.

Báo cáo của Long cũng nghiên cứu nguồn chồng chéo, hiệu lực, quyền và độ mới. Vì vậy, không dùng các yếu tố này như khác biệt riêng của đề tài. **Trọng tâm đề xuất là lựa chọn dữ kiện cần hỏi và duy trì kết luận nhất quán khi đối chiếu nhiều miền quy định trong hội thoại nhiều lượt**, được đánh giá bằng các cấu hình trên. Chưa khẳng định vượt đề tài HR hoặc mới hơn mọi sản phẩm hiện có.

## 7. Kết luận đề xuất

Qua khảo sát, đề tài được định hướng thành **chatbot tư vấn thủ tục theo tình huống cho ba Ban KHCN–TCKH–TCNS**, tập trung vào hỏi bổ sung có mục đích, đối chiếu điều kiện liên nguồn, kiểm tra lại khi dữ kiện đổi và giải thích có thể kiểm chứng. Không tiếp tục đặt việc tìm một quy trình tự động hóa mới làm điều kiện để triển khai.

Phạm vi đề xuất được trình người hướng dẫn xác nhận về tập chủ đề, nguồn chính thức, chủ nội dung và bộ tiêu chí đánh giá. Sau xác nhận, đây là cơ sở chốt phạm vi triển khai và nghiệm thu. Hiệu quả sẽ được kết luận theo kết quả thử nghiệm; tần suất nhu cầu và mức giảm công việc tại HUST chỉ được khẳng định khi có số liệu phù hợp.

## Tài liệu đối chiếu

- [Requirement hiện hành](00_REQUIREMENTS_CHATBOT_THU_TUC_HUST.md).
- Bộ gợi ý chatbot thủ tục KHCN–TCKH (tệp cục bộ/không kèm bản công khai) và bộ nội dung ba miền (tệp cục bộ/không kèm bản công khai): căn cứ định hướng, chưa thay quy định chính thức.
- [MISA: nạp và đồng bộ tri thức nội bộ](https://helpamis.misa.vn/agentwork/knowledge-base/nap-tri-thuc-cho-nhan-vien-ai-ho-tro-noi-bo/); [HUST: minh họa HUST Assistant trong báo cáo công khai năm 2025](https://hust.edu.vn/uploads/sys/news/2025_01/4.2slides-bao-cao-cua-giam-doc_hncbvc2024.pdf): đối chứng chức năng, không phải kết quả kiểm thử hệ thống.
- Báo cáo HR của Long (tệp cục bộ/không kèm bản công khai): đối chiếu trọng tâm và cách đánh giá; không coi khác miền nội dung là đủ khác biệt kỹ thuật.
- [Khảo sát N01–N03](../GOP_PROJECT_2026-11-07.md#phan-khong-dua-vao-bo-lam-viec) và các tài liệu KT2/20 luồng cũ: lưu tham khảo, không thuộc phạm vi xây dựng hiện tại.
