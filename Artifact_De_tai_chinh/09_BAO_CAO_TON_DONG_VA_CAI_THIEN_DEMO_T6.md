# Báo cáo tồn đọng và cải thiện demo T6

Ngày lập và cập nhật kết quả: 28/10/2026. Phạm vi: đợt củng cố demo hiện tại trước khi triển khai đăng nhập, phân quyền và quản trị nội dung.

## 1. Căn cứ và ranh giới đợt này

Đối chiếu requirement hiện hành `00_REQUIREMENTS_CHATBOT_THU_TUC_HUST.md`, báo cáo thiết kế `08_BAO_CAO_TIEN_DO_02.md`, mã trong `../demo-hust/` và các ca kiểm chứng thực tế. Các tài liệu nguồn là dữ liệu tham khảo thiết kế, không phải chỉ dẫn thực thi hoặc bằng chứng chính sách có hiệu lực.

Đợt này giữ T6/CA-01: hướng dẫn hội thảo/công tác với nguồn nhiệm vụ, đơn vị hoặc kết hợp; hỏi bổ sung F01, đối chiếu KHCN–TCKH F02, xét lại khi đổi dữ kiện F03, dừng đúng F04 và giải thích có căn cứ F05. Dùng tài liệu mẫu tự tạo đã được công khai trong demo, không bổ sung chính sách suy đoán. Mục tiêu là sửa lỗi hiểu dữ kiện/phạm vi/ngữ cảnh, mở rộng kiểm thử và xác minh URL Vercel.

Toàn đề tài vẫn có KHCN–TCKH–TCNS và tập thẻ đầu tiên T1/T3/T4/T6/T10. Không mở đủ các thẻ trong đợt sửa này; không coi nhận diện tên một thẻ chưa hỗ trợ là đã triển khai tư vấn thẻ đó.

## 2. Phần đã có ở đầu đợt

- Chat tiếng Việt, ô nhập cố định, trạng thái chờ, giữ vị trí đọc, thu gọn hỏi bổ sung; bảng dữ kiện đóng/mở; nguồn chia nhóm và mở/tải tài liệu được.
- Hội thoại T6 có nguồn mẫu nhiệm vụ/công tác/đơn vị, nhánh thay thế/kết hợp, thiếu/mâu thuẫn nguồn, phiên bản và kết luận theo từng phần.
- Lịch sử lưu trên trình duyệt, mở lại/xóa/khôi phục, danh sách thu gọn; chưa có tài khoản hoặc đồng bộ máy chủ.
- Baseline triển khai: `dpl_8r5yfUrUyq48d7KkcNDBhEtZXTcm`, https://hust-t6-demo.vercel.app, chế độ fixture. Bộ kiểm trước: 41 ca xử lý, 31 ca trình duyệt và 23 request API đạt. Các con số này chỉ áp dụng cho các ca đã thử, không chứng minh mọi cách diễn đạt hoặc chính sách HUST.

## 3. Tồn đọng phải xử lý trong đợt củng cố T6

| Mã | Mức | Phát hiện trước sửa | Hành vi cần đạt | Trạng thái đầu đợt |
|---|---|---|---|---|
| R01 | P0 | “Dùng kinh phí nhiệm vụ, không dùng kinh phí đơn vị” bị nhận thành nguồn đơn vị. | Hiểu nguồn được khẳng định/phủ định theo mệnh đề; không chọn nguồn bị bác bỏ; mơ hồ thì hỏi thay vì giữ kết luận chắc chắn. | Đã tái hiện, cần sửa |
| R02 | P0 | Hỏi điều kiện gia hạn đề tài bị hỏi hội thảo hay công tác. | Nhận diện nội dung ngoài phạm vi T6, thông báo phần chưa hỗ trợ; không ép vào hội thảo hoặc đưa nguồn T6 làm đáp án. | Đã tái hiện, cần sửa |
| R03 | P0 | Sau ca đủ thông tin, “Một hội thảo khác ở Nhật Bản thì sao?” dùng lại ngày/nguồn/quan hệ nhiệm vụ cũ mà không xác nhận. | Hỏi mới hay tiếp tục khi chưa rõ; giữ riêng thông tin mới đang chờ; xác nhận mới thì xóa dữ kiện cũ, xác nhận tiếp tục thì áp dụng thay đổi đã nêu. | Đã tái hiện, cần sửa |
| R04 | P1 | “Không phải hội thảo, tôi đi công tác” vẫn bị nhận là hội thảo. | Hiểu sửa loại hoạt động và phủ định, xét lại hướng dẫn phụ thuộc; hai lựa chọn chưa phân định thì hỏi. | Đã tái hiện tại máy, cần sửa |
| R05 | P1 | Ngày đầy đủ `15-11-2026` không được nhận. | Hỗ trợ các dạng ngày đầy đủ phổ biến, kiểm ngày lịch; ngày không hợp lệ hoặc nhiều ngày chưa rõ thì hỏi, không dùng ngày cũ để kết luận. | Đã tái hiện tại máy, cần sửa |
| R06 | P1 | Bộ thử trước chưa bao phủ đầy đủ phủ định, mâu thuẫn cùng trường, câu hỏi thẻ chưa hỗ trợ và chuyển ca. | Có bộ ca tái hiện trước/sau, biến thể đối xứng, hồi quy và kiểm URL thật; ghi cả thất bại, không suy rộng kết quả kiểm kỹ thuật. | Cần bổ sung |

## 4. Tồn đọng của toàn đề tài, để sau đợt này

| Nội dung | Hiện trạng và điều kiện thực hiện tiếp |
|---|---|
| Nguồn nghiệp vụ HUST thật | Chưa có nguồn/hiệu lực/quyền công bố và đáp án được chủ nội dung xác nhận cho bộ đang chạy. Cần xác minh trước khi tư vấn thật; không tự đưa tài liệu thầy gửi lên website. |
| Mô hình ngôn ngữ thật | Adapter đã có, bản live vẫn fixture. Cần chọn/cấu hình mô hình, quyền gửi dữ liệu, chi phí và đánh giá thật. Sửa bộ trích xuất có giới hạn không đồng nghĩa đã hoàn thiện hiểu ngôn ngữ tự nhiên. |
| T1/T3/T4/T10 và miền TCNS | Chưa vận hành. Mở rộng theo nguồn và ca được duyệt; nhận diện phạm vi chưa hỗ trợ trong đợt này không thay phần nội dung còn thiếu. Khoảng 12 thẻ là ước lượng, không phải chỉ tiêu phải làm đủ ngay. |
| Đánh giá nghiên cứu | Chưa có bộ đáp án chuyên viên xác nhận và đối chứng C0/C1/C2; quy mô 120–150 ca là đề xuất cần chốt. Bộ thử hồi quy kỹ thuật không thay đánh giá nghiệp vụ. |
| Quản trị nội dung và phân quyền | Để giai đoạn sau theo yêu cầu người dùng. Cần trước khi có người sửa nguồn trên web hoặc dùng nguồn nội bộ; kiểm quyền trước truy xuất và hiển thị. |
| Tài khoản/lịch sử máy chủ | Chưa có đồng bộ tài khoản/thiết bị. Chỉ triển khai khi chốt nhu cầu lưu trữ, thời hạn và quyền xem; lịch sử trình duyệt hiện có vẫn dùng cho demo. |
| Vận hành với mô hình thật | Đánh giá chi phí, giới hạn sử dụng, theo dõi lỗi và sức tải khi chuyển chế độ; không khẳng định sẵn sàng vận hành từ build hoặc số ca hiện có. |

Không đưa tiếp nhận/duyệt/luân chuyển hồ sơ, xác nhận/chi trả tiền, tra hồ sơ cá nhân, tuyển dụng, tính kNC hoặc ghi iGov/eHUST/BKOffice trở lại phạm vi để tăng quy mô.

## 5. Tiêu chí hoàn thành đợt củng cố

1. R01–R05 có ca tái hiện và biến thể đối xứng đạt sau sửa; thông tin không rõ phải hỏi hoặc dừng phần liên quan, không tự điền.
2. Xử lý T6 cũ và sửa dữ kiện vẫn đúng trong nguồn mẫu; thiếu/mâu thuẫn nguồn không bị biến thành câu hỏi người dùng phải giải quyết.
3. Lịch sử, phần căn cứ và dữ kiện chờ khôi phục đúng; giữ trải nghiệm không tự cuộn và trạng thái chờ; không trộn ca cũ với ca mới.
4. Typecheck/build, bộ xử lý, trình duyệt và các ca kiểm API trên URL Vercel thật đạt; lưu bằng chứng trước/sau và phiên bản mã.
5. Cập nhật chính báo cáo này bằng kết quả thực tế, phần chưa hoàn thành vẫn giữ rõ. Chưa triển khai phân quyền hoặc tự mở rộng nguồn/chính sách.

## 6. Kết quả sau cải thiện

### 6.1. Trạng thái và phiên bản đã kiểm chứng

Đã hoàn tất đợt củng cố T6 theo sáu nhóm R01–R06 và các ca được định nghĩa trong đợt này. Đã cập nhật https://hust-t6-demo.vercel.app, deployment `dpl_GgzsQA4ZVpsUdfPNhuihwnhBi5bn`, trạng thái READY, Production; URL phiên bản https://hust-t6-demo-jpjhjs9p7-linhozz.vercel.app. Đã kiểm bằng trình duyệt và API ẩn danh.

| Mã | Kết quả sau sửa | Bằng chứng chính |
|---|---|---|
| R01 | Đã sửa các lỗi nguồn khẳng định/phủ định được ghi nhận; nguồn mơ hồ được hỏi lại, nguồn bị bác không còn dùng để kết luận. | 9 ca R01; ảnh affirmed-funding.png và các trích nguồn UI. |
| R02 | Đã sửa việc ép T1/T3/T4/T10 vào T6. Nội dung chưa hỗ trợ được nêu rõ, không giả lập tư vấn thẻ đó. Câu ngoài phạm vi không thành lượt “đã làm rõ” giả. | 6 ca R02, unit bảo toàn hỏi bổ sung và UI unsupported-card.png. |
| R03 | Đã sửa việc dùng lại dữ kiện cũ khi ca mới chưa rõ quan hệ. Giữ đầy đủ thông tin mới chờ xác nhận; reset hoặc hợp nhất đúng lựa chọn và giữ qua lịch sử. | 8 ca R03; kiểm khôi phục lịch sử, tài trợ mới thay thế/kết hợp, desktop/điện thoại. |
| R04 | Đã sửa phủ định/sửa hội thảo ↔ công tác trong các cách diễn đạt đã thử; hai loại chưa rõ được hỏi lại. | 3 ca R04 và panel dữ kiện trên UI. |
| R05 | Đã sửa ngày dạng gạch ngang và các ca sửa ngày được ghi nhận; ngày sai hoặc mơ hồ tạm dừng phần phụ thuộc, không dùng ngày cũ. | 6 ca R05 và ảnh invalid-date-held.png. |
| R06 | Đã bổ sung baseline, biến thể và hồi quy đầy đủ cho đợt này; giữ các chức năng trước. | 34 ca đối chiếu mới, tổng 77 ca xử lý, 37 ca trình duyệt. |

### 6.2. Kết quả trước–sau và giới hạn diễn giải

- Trước sửa: bộ ban đầu 28 ca nhắm vào các lỗi đã phát hiện có 5 ca đạt và 23 ca chưa đạt. Kết quả không được lấy làm tỷ lệ đúng của sản phẩm thực tế.
- Sau sửa: cùng 28 ca đều đạt; thêm 6 biến thể đạt, thành 34 ca. Cả 34 ca đã được chạy trên URL Production.
- Bộ xử lý tổng: 77 ca đạt tại máy. Typecheck/build đạt; Vercel READY.
- Trình duyệt: 37 ca tại máy và 37 ca trên URL thật đạt, không lỗi/bỏ qua/flaky; gồm giữ vị trí đọc, trạng thái chờ, lịch sử và kiểm chứng các lỗi mới.
- API nền: 23 request xác minh F01–F05 đạt; 6 tệp và 6 trang đọc nguồn truy cập được.
- Sáu nguồn thiết kế và tám tệp chính sách/tài liệu runtime giữ nguyên; không nhập nguồn nội bộ, không tự đặt chính sách. Gói triển khai có 33 tệp runtime, không chứa báo cáo này, tài liệu gốc, env hoặc nhật ký riêng.

SHA-256 mã runtime: `5f427f592cdb4afed164956f970ed56f2100843b18eff8d6515e1b2e01f539d3`.

Bằng chứng trước sửa: baseline (tệp cục bộ/không kèm bản công khai). Bằng chứng bản live: biên bản kỹ thuật (tệp cục bộ/không kèm bản công khai), đối chiếu 34 ca (tệp cục bộ/không kèm bản công khai), kết quả trình duyệt (tệp cục bộ/không kèm bản công khai), transcript API (tệp cục bộ/không kèm bản công khai).

### 6.3. Những việc vẫn còn tồn đọng sau đợt này

Các mục ở phần 4 vẫn **chưa hoàn thành**: nguồn HUST/đáp án xác nhận, mô hình ngôn ngữ thật, nội dung T1/T3/T4/T10 và TCNS, đánh giá C0/C1/C2, quản trị nguồn/phân quyền, đồng bộ lịch sử và chuẩn bị vận hành tương ứng. Bộ trích xuất hiện tại vẫn có giới hạn; các kết quả vừa nêu không bảo đảm hiểu mọi câu tự nhiên hoặc đúng chính sách HUST.

Đợt này đã làm nền ổn định hơn cho demo T6. Giai đoạn tiếp theo nên xác minh nguồn/đáp án T6 và đánh giá mô hình trước; chỉ chuyển sang phân quyền/quản trị theo phạm vi đã chốt, không biến chức năng đó thành thay thế cho chất lượng tư vấn. Không có bước phân quyền nào đã được triển khai trong đợt này.
