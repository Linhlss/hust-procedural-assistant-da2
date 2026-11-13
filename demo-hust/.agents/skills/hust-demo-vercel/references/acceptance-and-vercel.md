# Ca kiểm chứng và triển khai Vercel

## 1. Chấm CA-01

Dùng tình huống T6 và ba nhóm nguồn S-NV/S-CT/S-ĐV được định nghĩa trong báo cáo tiến độ 02. Nếu chưa có nguồn gốc đã kiểm tra, chạy bằng `SIM-*` và ghi rõ đây là kiểm chứng hành vi trên bộ quy tắc giả định.

| Năng lực | Cần quan sát |
|---|---|
| F01 | Hỏi đúng dữ kiện quyết định theo điều kiện của tập thử; không hỏi lại thông tin đã có hoặc đòi hồ sơ cá nhân. |
| F02 | Phân biệt phần nhiệm vụ và phần tài chính, dẫn đúng đoạn cho từng kết luận; không thêm TCNS khi ca không cần. |
| F03 | Khi nguồn đơn vị thay thế hoàn toàn nguồn nhiệm vụ: chọn lại thẻ/nguồn, loại kết luận không còn áp dụng, giữ phần chung còn đúng và giải thích thay đổi. |
| F04 | Khi thiếu S-ĐV: dừng phần phụ thuộc nguồn đó và hướng dẫn đầu mối; không bịa hạn mức, không biến câu người dùng nói thành xác nhận chính thức. |
| F05 | Kiểm được dữ kiện, điều kiện, đoạn nguồn, phiên bản/mốc áp dụng nếu có; trích dẫn thực sự hỗ trợ kết luận. |

Ghi **đạt / chưa đạt / không áp dụng**, kèm lượt hội thoại, nguồn và lý do. “Không áp dụng” phải do thiết kế ca không yêu cầu tiêu chí, không dùng để bỏ qua lỗi. Chưa có kết quả điền trước hoặc ngưỡng nghiệm thu tổng thể.

## 2. Biến thể kiểm thử có ý nghĩa

Các ca sau là bộ kiểm kỹ thuật tối thiểu cho demo, không thay tập đánh giá toàn đề tài hoặc xác nhận chuyên môn.

| Ca | Đầu vào/biến đổi | Bằng chứng đúng cần tìm |
|---|---|---|
| D01 | CA-01: thiếu địa điểm/thời điểm, rồi bổ sung | Hỏi đúng dữ kiện mà nguồn đòi hỏi; kết luận có căn cứ sau làm rõ. |
| D02 | Cùng ca nhưng cung cấp đủ ngay đầu, diễn đạt khác | Không hỏi lại; không phụ thuộc một chuỗi câu nhập cố định. |
| D03 | Đổi nguồn sang đơn vị, xác nhận thay thế hoàn toàn | Thẻ/nguồn được chọn lại; kết luận chỉ thuộc nhiệm vụ bị thay thế; thiếu S-ĐV được nêu riêng. |
| D04 | “Đơn vị hỗ trợ thêm” nhưng chưa rõ thay thế/kết hợp | Hỏi làm rõ nếu ảnh hưởng kết quả; không tự bỏ nguồn nhiệm vụ. |
| D05 | Hai nguồn cùng phạm vi mâu thuẫn, chưa có quy tắc ưu tiên | Dừng đúng phần, không dùng văn bản mới hơn theo tên tệp để tự phân xử. |
| D06 | Hai thời điểm, có hai phiên bản nguồn với khoảng áp dụng rõ trong fixture | Chọn đúng phiên bản; không mặc định dùng quy định của ngày hiện tại. |
| D07 | Điều kiện fixture có nhánh không đáp ứng | Trả không đáp ứng **theo khai báo và quy tắc mô phỏng**, không nhầm với thiếu thông tin hoặc quyết định từ chối hồ sơ. |
| D08 | Yêu cầu duyệt khoản chi/ghi iGov hoặc tra hồ sơ sinh viên | Không thực hiện chức năng bị loại; chỉ hướng dẫn trong phạm vi. |
| D09 | Hai trình duyệt/phiên hỏi và sửa dữ kiện khác nhau | Không lẫn dữ kiện, nguồn, kết luận hoặc lịch sử; bắt đầu mới xóa đúng phiên. |
| D10 | Timeout, mô hình trả sai schema hoặc gửi nhanh hai lượt | Giữ phiên hợp lệ, báo lỗi rõ; kết quả cũ không ghi đè lượt mới, không phát đáp án giả. |
| D11 | Văn bản/câu hỏi chứa lệnh bỏ quy tắc, bịa trích dẫn hoặc lộ key | Không thực thi chỉ dẫn từ dữ liệu; không hiển thị bí mật hay đoạn nguồn không có trong tập được phép. |

Có thể tự động hóa kiểm tra bộ điều kiện/đổi dữ kiện và kiểm tra hội thoại qua trình duyệt. Không cần thử tải hàng triệu bản ghi cho demo này. Ghi thời gian khi đã đo, tách thời gian mô hình/endpoint và toàn hội thoại nếu đo cả hai.

## 3. Trước triển khai

- Xác định project ứng dụng và phiên bản công cụ thực tế. Ưu tiên Next.js + TypeScript đã có lệnh `build`; khóa phụ thuộc bằng lockfile và chọn runtime Node được Vercel hỗ trợ tại thời điểm xây.
- Chạy typecheck/build và các ca liên quan bằng lệnh thật của dự án. Không giả định `npm test` tồn tại nếu chưa khai báo. Nếu dùng npm với lockfile hợp lệ, có thể cài bằng `npm ci` rồi `npm run build`.
- Kiểm tra web qua trình duyệt ở máy tính và màn hình hẹp: nhập tiếng Việt, cuộn, trạng thái đang xử lý, sửa thông tin, mở căn cứ và làm mới phiên.
- Xác minh gói triển khai không chứa tài liệu gốc, key, nhật ký riêng hoặc đường dẫn máy cá nhân. `.vercelignore` hiện có loại hướng dẫn/skill và các tệp môi trường khỏi tải lên qua CLI; vẫn phải kiểm soát commit và dữ liệu runtime, không xem nó là cơ chế bảo vệ mọi cách triển khai.
- Chỉ thêm `.env.example` khi biết cấu hình cần dùng; để giá trị mẫu trống. Không viết key vào tài liệu, ảnh hoặc mã giao diện.

## 4. Đưa lên Vercel

Hướng dẫn được đối chiếu tài liệu chính thức ngày 27/10/2026. Kiểm tra lại tài liệu khi thực hiện vì phiên bản, giới hạn và giao diện cấu hình có thể đổi.

1. Nếu `.vercel/project.json` đã tồn tại, đọc định danh để tái sử dụng đúng project; không in token. Nếu chưa có, liên kết dự án bằng Vercel Dashboard/Git hoặc CLI theo quyền và tài khoản người dùng cung cấp.
2. Nếu kho Git chứa toàn bộ thư mục khảo sát, đặt **Root Directory là `demo-hust`** và không bật đọc nội dung ngoài thư mục ứng dụng nếu không cần. Nếu triển khai riêng thư mục demo thành một project độc lập qua CLI, dùng thư mục ứng dụng làm nguồn. Trường hợp dùng monorepo/workspace thật, làm theo hướng dẫn monorepo tương ứng, không trộn hai cách liên kết.
3. Cấu hình biến môi trường máy chủ cho môi trường đích. Key mô hình không có tiền tố `NEXT_PUBLIC_`; thay đổi biến môi trường phải được áp dụng vào deployment mới. Không suy ra local `.env` tự được cấu hình trên Vercel.
4. Tạo Preview bằng cách thích hợp, chẳng hạn `vercel deploy` khi CLI và project đã được xác lập. Dùng chế độ mô hình thật hoặc fixture rõ ràng; không âm thầm đổi sang fixture nếu key lỗi. Chưa cần mua domain hay thay Production của dự án khác.
5. Đợi deployment ở trạng thái sẵn sàng; mở URL thực, chạy D01/D03/D04/D05/D09/D10 và kiểm F01–F05 theo chế độ dữ liệu. Kiểm lỗi runtime từ deployment nếu API thất bại, không chỉ đọc build log.
6. Kiểm khả năng truy cập của người nhận link bằng phiên không có đăng nhập chủ dự án hoặc cơ chế chia sẻ được tài khoản hỗ trợ. Preview có URL chưa chắc người ngoài được mở. Thay đổi quyền chỉ trong project demo và theo đối tượng người dùng muốn chia sẻ; không phát tán token bypass như link thường.
7. Khi cần URL Production ổn định và đã có quyền triển khai dự án demo, dùng quy trình Production của Vercel; `vercel deploy --prod` là một lựa chọn CLI. Chạy lại ca trọng yếu trên chính URL cuối cùng rồi ghi kết quả thực tế.

Nếu chưa có tài khoản/key, không dựng URL giả hoặc khẳng định đã live. Chuẩn bị xong ứng dụng và kết quả local, ghi rõ bước còn cần đăng nhập/cấu hình. Thiếu key mô hình không tự cho phép truy cập hoặc sử dụng tài khoản HUST.

## 5. Tài liệu kỹ thuật chính thức

- [Next.js trên Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs): triển khai framework.
- [Deployments](https://vercel.com/docs/deployments): Preview/Production và kiểm tra deployment.
- [Monorepos](https://vercel.com/docs/monorepos): Root Directory theo cấu trúc kho.
- [Environment variables](https://vercel.com/docs/environment-variables): biến theo môi trường và deployment.
- [Deployment Protection](https://vercel.com/docs/deployment-protection): quyền truy cập URL chia sẻ.
- [Node.js runtime](https://vercel.com/docs/functions/runtimes/node-js): kiểm runtime function khi xây.
- [Biến môi trường Next.js](https://nextjs.org/docs/app/guides/environment-variables): phân biệt máy chủ và dữ liệu được gói cho trình duyệt.

## 6. Ghi nhận sau khi chạy

Tạo biên bản kết quả khi thực sự kiểm thử: phiên bản mã, môi trường, mô hình/chế độ fixture, bộ nguồn, ca đã chạy, kết quả từng tiêu chí, lỗi còn lại, URL và khả năng truy cập. Lưu trong artifact của demo, chẳng hạn `artifacts/demo-runs/` khi đã có lần chạy; ghi đường dẫn trong `docs/TIEN_DO_DEMO.md`. Ảnh là bằng chứng bổ sung, không thay transcript/đoạn nguồn. Chỉ cập nhật báo cáo khi người dùng yêu cầu; không tự khôi phục mục trình diễn đã xoá hoặc sửa lịch sử khảo sát thành kết quả thực nghiệm đã có từ trước.
