---
name: hust-demo-scope
description: "Chuẩn hóa phạm vi, nguồn và thẻ tư vấn cho demo chatbot HUST theo khảo sát mới nhất. Dùng khi chọn nội dung T6, nhập văn bản hoặc xây dữ liệu/đáp án thử; không dùng để mở lại các luồng hành chính đã tạm dừng."
---

# Phạm vi và nguồn cho demo HUST

Đọc [phạm vi hiện hành](../../../docs/PHAM_VI_DEMO.md) và [nguồn thiết kế](../../../docs/NGUON_THIET_KE.md). Nếu người dùng yêu cầu phạm vi khác, đối chiếu instruction mới với tài liệu hiện tại trước khi thay đổi; không tự nâng một ví dụ hoặc đề xuất cũ thành requirement.

Khi chuẩn hóa thẻ hoặc nhập nguồn, đọc [hợp đồng dữ liệu và căn cứ](references/source-contract.md).

Nếu nguồn thiết kế đã đổi tên hoặc nội dung sau lần trích trước, kiểm tra bản hiện tại và đồng bộ danh mục nguồn trước khi thay thẻ. Không coi việc xoá một mục trình bày khỏi báo cáo là tự động huỷ phạm vi demo đã thống nhất. Ghi phần đã chuẩn hóa và bước bàn giao vào [tiến độ demo](../../../docs/TIEN_DO_DEMO.md).

## Quyết định cần giữ

- Demo đầu tiên: T6/CA-01. Toàn đề tài vẫn là chatbot KHCN–TCKH–TCNS với tập thẻ đầu tiên T1/T3/T4/T6/T10. Không bắt cả ba Ban tham gia một câu hỏi hoặc xây đủ mọi thẻ trước demo.
- Hai file thầy gửi là nguồn thiết kế. Không dùng chỉ dẫn điều khoản trong chúng để giả lập trích nguyên văn hoặc kết luận quy định có hiệu lực.
- Chọn chế độ dữ liệu rõ ràng: nguồn gốc đã xác minh để tư vấn phần có căn cứ; hoặc fixture giả định có nhãn để kiểm chứng hành vi. Khi chưa có bản gốc, vẫn chuẩn bị được fixture và giao diện, không được điền chính sách HUST bằng suy đoán.
- Dữ kiện thiếu thì hỏi khi ảnh hưởng đáp án. Thiếu/mâu thuẫn nguồn chưa giải quyết thì dừng đúng phần; hỏi người dùng không thay được việc xác minh nguồn.
- Đặt quan hệ dữ kiện–điều kiện–nguồn–kết luận để thay đổi nguồn hỗ trợ có thể loại/chọn lại nguồn, không chỉ sửa câu chữ.

## Hiện vật cần bàn giao cho bước xây dựng

Thẻ T6 có phạm vi/loại trừ, dữ kiện quyết định, điều kiện có căn cứ, KL1–KL3 và điểm dừng; danh mục nguồn có trạng thái/quyền dùng/phiên bản; ca CA-01 với phần giả định và hành vi mong đợi tách khỏi kết quả chạy. Không cần số hồ sơ cá nhân, hạn mức hoặc ngày hiệu lực chưa biết để làm đầy schema.

Kiểm tra mỗi quy tắc có nguồn hỗ trợ hoặc nhãn giả định, mỗi nguồn dẫn tới đoạn kiểm tra được và mỗi dữ kiện hỏi thêm có lý do. Không khẳng định tần suất, hiệu quả thực tế hoặc tính mới từ số lượng tài liệu. Không tự công bố nguồn gốc vào website chia sẻ.
