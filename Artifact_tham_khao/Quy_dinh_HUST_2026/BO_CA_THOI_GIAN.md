# Bộ ca kiểm tra thời gian và chuyển tiếp

28 ca giả định để thiết kế hành vi. **Chưa chạy với nguồn thật, chưa có đáp án nghiệp vụ được duyệt.** Không dùng chúng làm bằng chứng tư vấn đúng chính sách HUST.

Mỗi ca trước khi chạy cần bổ sung dữ kiện/ngày cụ thể từ nguồn đã kiểm, đoạn căn cứ, đáp án, xác nhận chủ nội dung và kết quả thực chạy. Ngày hỏi không mặc định là ngày hoạt động. Thử ca ngay trước/đúng/sau mốc với ngày hiệu lực thực đã xác minh.

| Mã | Thẻ | Tình huống | Hành vi mong đợi | Trạng thái |
|---|---|---|---|---|
| TIME-01 | T1 | Đăng ký hiện hành: Tôi muốn đăng ký nhiệm vụ cấp Đại học trong đợt hiện tại. | Hỏi loại/đợt nếu ảnh hưởng; tìm đúng thông báo và mẫu. | not_run |
| TIME-02 | T1 | Đợt đã đóng: Tôi hỏi về đợt đăng ký năm trước. | Xác định đợt được hỏi; không đưa hạn đợt hiện tại thay hạn cũ. | not_run |
| TIME-03 | T1 | Mẫu cũ: Tôi có mẫu tải năm ngoái, còn dùng được không? | Kiểm phiên bản và đợt áp dụng; không xác nhận chỉ từ năm tải. | not_run |
| TIME-04 | T3 | Gia hạn trước hạn: Đề tài của tôi sắp hết hạn, tôi muốn xin gia hạn. | Hỏi hạn hiện tại và dữ kiện mà quy tắc cần; không tự duyệt gia hạn. | not_run |
| TIME-05 | T3 | Nhiệm vụ chuyển tiếp: Đề tài được duyệt trước quy định mới, giờ xin điều chỉnh. | Xét mốc phê duyệt/ký và điều khoản chuyển tiếp; không chọn đơn thuần theo ngày hỏi. | not_run |
| TIME-06 | T3 | Giấy tờ điều chỉnh tồn: Đề nghị điều chỉnh của tôi nộp từ trước nhưng vẫn chưa xử lý. | Hỏi mốc nộp/quyết định/thay đổi nếu ảnh hưởng; thời gian chờ không chứng minh quy định cũ áp dụng. | not_run |
| TIME-07 | T3 | Chủ nhiệm đi học: Tôi đang chủ nhiệm nhiệm vụ và được cử đi nghiên cứu dài hạn. | Đối chiếu KHCN/TCNS; chỉ mở nhánh kinh phí nếu cần. | not_run |
| TIME-08 | T4 | Nghiệm thu hiện hành: Đề tài sắp kết thúc, tôi cần chuẩn bị nghiệm thu. | Chọn đúng loại nhiệm vụ, mốc, sản phẩm và mẫu. | not_run |
| TIME-09 | T4 | Đã gia hạn: Đề tài đã được gia hạn rồi, hạn nghiệm thu tính thế nào? | Dùng hạn sau gia hạn theo khai báo và quy tắc có căn cứ; không giữ hạn cũ. | not_run |
| TIME-10 | T4 | Chờ nghiệm thu: Tôi đã gửi báo cáo từ trước nhưng vẫn đang chờ nghiệm thu. | Kiểm các mốc kết thúc/nộp và chuyển tiếp; không tự xác nhận nghiệm thu hoặc mặc định quá hạn. | not_run |
| TIME-11 | T4 | Mốc nguồn chưa thống nhất: Hai hướng dẫn ghi mốc nghiệm thu khác nhau. | Phân biệt phạm vi; thiếu cách giải quyết được xác nhận thì dừng phần mâu thuẫn. | not_run |
| TIME-12 | T6 | Hiện hành: Tôi đi hội thảo trong nước bằng kinh phí nhiệm vụ. | Hỏi thời điểm/quan hệ nhiệm vụ khi ảnh hưởng; đối chiếu đúng nguồn. | not_run |
| TIME-13 | T6 | Trước mốc thay đổi: Chuyến công tác diễn ra trước ngày quy định mới có hiệu lực. | Kiểm bản trước mốc và chuyển tiếp; không lấy bản mới mặc định. | not_run |
| TIME-14 | T6 | Đúng mốc thay đổi: Chuyến đi của tôi bắt đầu đúng ngày thay đổi quy định. | Đối chiếu chính xác mốc và phạm vi điều khoản; không tự chọn biên hiệu lực. | not_run |
| TIME-15 | T6 | Sau mốc thay đổi: Chuyến đi bắt đầu sau mốc thay đổi quy định. | Kiểm phiên bản và điều kiện chuyển tiếp, không chỉ so ngày. | not_run |
| TIME-16 | T6 | Quyết định và chuyến đi khác thời kỳ: Quyết định cử đi ký trước, chuyến đi bắt đầu sau quy định mới. | Giữ riêng hai ngày; tìm mốc quyết định áp dụng trong nguồn. | not_run |
| TIME-17 | T6 | Chứng từ tồn đọng: Chuyến đi đã từ lâu, chứng từ vẫn đang chờ xử lý. | Tách ngày đi/ngày nộp/ngày hỏi; kiểm nguồn cho từng phần; không khẳng định được chi. | not_run |
| TIME-18 | T6 | Sửa ngày qua mốc: Tôi nói nhầm ngày, chuyến đi thực ra diễn ra trước mốc thay đổi. | Chọn lại nguồn, rút kết luận phụ thuộc và giải thích thay đổi; giữ phần không bị ảnh hưởng. | not_run |
| TIME-19 | T6 | Chỉ nhớ tháng: Tôi chỉ nhớ chuyến đi vào tháng có thay đổi quy định. | Nếu ảnh hưởng kết luận thì hỏi ngày; nếu chưa biết, trả giới hạn/các khả năng có căn cứ. | not_run |
| TIME-20 | T6 | Đổi nguồn đơn vị: Tôi đổi sang dùng hoàn toàn kinh phí đơn vị. | Bỏ kết luận chỉ dành nguồn nhiệm vụ; yêu cầu nguồn đơn vị đúng; không mượn đơn vị khác. | not_run |
| TIME-21 | T6 | Nguồn kết hợp: Một phần từ nhiệm vụ, phần còn lại do đơn vị hỗ trợ. | Làm rõ nguồn thay thế hay kết hợp; xét từng phần và tránh suy đoán hỗ trợ trùng. | not_run |
| TIME-22 | T10 | Cử đi hiện hành: Tôi muốn được cử đi đào tạo hoặc nghiên cứu. | Làm rõ hoạt động/thời hạn theo nhánh, điều kiện, nghĩa vụ và mẫu. | not_run |
| TIME-23 | T10 | Nghĩa vụ từ quyết định cũ: Tôi được cử đi theo quyết định cũ, nay trở về thì nghĩa vụ thế nào? | Xét quyết định/thời gian và chuyển tiếp; không áp nghĩa vụ mới bằng suy đoán. | not_run |
| TIME-24 | T10 | Gia hạn ở nước ngoài: Thời hạn được cử đi sắp hết, tôi muốn xin gia hạn. | Hỏi hạn hiện tại và mốc cần thiết; đối chiếu TCNS và nhiệm vụ nếu có. | not_run |
| TIME-25 | T10 | Giấy tờ trở về còn chờ: Tôi đã về nước nhưng giấy tờ báo cáo vẫn đang chờ xử lý. | Xét mốc trở về/nộp và nghĩa vụ tương ứng; không tự kết luận trạng thái hồ sơ. | not_run |
| TIME-26 | T6 | Thiếu bản lịch sử: Ca của tôi cần quy định cũ mà kho chưa có. | Nêu đúng phần thiếu nguồn và đầu mối; không lấy bản hiện hành thay thế. | not_run |
| TIME-27 | T3 | Tách ngày ban hành/hiệu lực: Nguồn ghi ngày ký và ngày hiệu lực khác nhau. | Không dùng ngày ký/ngày tải thay ngày hiệu lực; kiểm chuyển tiếp. | not_run |
| TIME-28 | T1 | Đổi loại nhiệm vụ: Tôi nói nhầm, đây là nhiệm vụ cấp Bộ chứ không phải cấp Đại học. | Chọn lại phạm vi; chỉ trả nếu nhánh đã được xác nhận, nếu chưa thì nêu giới hạn. | not_run |

Nguồn dữ liệu để cập nhật: [temporal-cases.json](metadata/temporal-cases.json).
