# Bàn giao giao diện Stitch — 08/11/2026

## Bản đang chạy

- URL công khai: https://hust-t6-demo.vercel.app.
- Deployment: `dpl_7pHMNbyLfogDEyzSjE2tiPQK2Zji`, `READY`, Production; cùng project `hust-t6-demo` / `prj_oV7GrrsI5vz4UpMb6kKnuUfAxoIF`.
- URL phiên bản: https://hust-t6-demo-bbjtgq0ko-linhozz.vercel.app.
- SHA-256 runtime: `6227c7500170149a90065935429e0794a57dc5e0dc888dddb89f0fa7163de366`; cách tính và từng tệp ở code-version.json (tệp cục bộ/không kèm bản công khai).
- API và trình duyệt được kiểm tra không đăng nhập Vercel, không cookie chủ project hoặc token bypass. Chế độ được API xác nhận là `fixture`, nguồn `SIM-*`; chưa gọi mô hình thật hoặc xác minh chính sách HUST.

## Đã thực hiện

1. Dựng lại sidebar, thanh trên, thẻ câu hỏi, câu trả lời, căn cứ, ô nhập và bảng tình huống theo HTML/ảnh Stitch. Sidebar 232 px; header desktop 56 px; nội dung tối đa 760 px; bảng tình huống 320 px. Giữ cửa sổ cuộn và thao tác chủ động “Xem phản hồi mới”.
2. Giao diện sáng mặc định và tối; lưu bằng `hust-ui-theme`, áp dụng trước khi trang hiển thị và đồng bộ giữa các tab. Inter cho thân bài, Be Vietnam Pro cho tiêu đề; có phông dự phòng khi nguồn phông không tải được.
3. Đồng bộ thư viện và sáu trang đọc tài liệu, giữ liên kết đúng đoạn và tệp Markdown. Bố cục điện thoại và máy tính bảng, ngăn lịch sử/tình huống, focus và Escape đã được kiểm tra.
4. Chia dữ kiện theo trạng thái thật: đã ghi nhận, đang cần bổ sung theo câu hỏi hiện hành và thông tin khác chưa cung cấp. Số đếm không cố định. Dữ kiện của tình huống đang chờ xác nhận tách riêng với tình huống trước. Ngày bị rút lại sau nhập sai được ghi “Chưa xác định”; trường chưa có ở tình huống mới ghi “Chưa cung cấp”.
5. Tìm lịch sử và “Bổ sung” từng trường hiển thị nhưng khóa. Lời giải thích xuất hiện khi trỏ hoặc focus; hướng người dùng nhập trong chat. Các điều khiển này không gửi API, không điền sẵn hoặc đổi dữ kiện.
6. Giữ toàn bộ xử lý tư vấn, nguồn mẫu, API, schema lịch sử và lockfile. Đối chiếu 70 tệp được bảo vệ, gồm báo cáo/source/PDF, xác nhận không đổi. Không commit, push hoặc đưa tài liệu thầy gửi lên web.

## Kiểm chứng

| Nội dung | Kết quả | Bằng chứng |
|---|---|---|
| TypeScript | Đạt | typecheck.log (tệp cục bộ/không kèm bản công khai) |
| Xử lý và mock | 90/90 đạt | unit.log (tệp cục bộ/không kèm bản công khai) |
| Biên dịch Production | Đạt tại máy, Vercel READY | build.log (tệp cục bộ/không kèm bản công khai) và metadata deployment |
| Trình duyệt cục bộ | 50/50 sau dựng giao diện; 9/9 ca giao diện sau tinh chỉnh cuối | `stitch-release-2026-11-08/browser-results.json`, `stitch-release-final-2026-11-08/browser-results.json` |
| Chrome trên URL công khai | 51/51 đạt, 0 bỏ qua/lỗi | browser-results.json (tệp cục bộ/không kèm bản công khai) |
| API ẩn danh trên URL công khai | 23 yêu cầu đạt; 6 trang đọc và 6 tệp tải kiểm tra được | api-transcripts.json (tệp cục bộ/không kèm bản công khai) |
| Đóng gói | 40 tệp có nội dung, chỉ ứng dụng/cấu hình/lockfile và 6 tài liệu mẫu | deployment-inputs.json (tệp cục bộ/không kèm bản công khai), standalone-package.json (tệp cục bộ/không kèm bản công khai) |
| Bảo toàn nội dung | 70 tệp bảo vệ không đổi | protected-file-audit.json (tệp cục bộ/không kèm bản công khai) |

Các ca trình duyệt kiểm tra hỏi bổ sung, sửa nguồn/ngày/hoạt động, tình huống mới, thiếu/mâu thuẫn nguồn, nhiều phiên/tab, lỗi/thử lại/hủy, lưu/xóa/khôi phục lịch sử, mở đúng căn cứ, chuyển theme, điều khiển khóa, cuộn và bố cục. Ảnh tham chiếu ở 1280 × 1024; các màn hình 390 × 844, 768 × 844 và 1440 × 1000 được kiểm tra. Đây là kiểm thử kỹ thuật với dữ liệu mẫu, không phải đánh giá nghiệp vụ được chuyên viên xác nhận hoặc thử trên thiết bị điện thoại vật lý.

## Đối chiếu ảnh và khác biệt có chủ đích

Mở comparison.html (tệp cục bộ/không kèm bản công khai) để xem mẫu và ứng dụng cạnh nhau. Các ảnh URL thật nằm trong thư mục kiểm tra Production (tệp cục bộ/không kèm bản công khai). Không đưa ra phần trăm khớp pixel: nội dung, lịch sử và các trạng thái phụ thuộc dữ kiện có khác biệt.

- Nhãn `T6` thay nhãn AI ở chế độ fixture; không gán sẵn thời gian “Vừa xong” cho lượt chưa lưu thời gian riêng.
- Nhãn cần bổ sung và cảnh báo chỉ dùng dữ kiện thực sự ảnh hưởng câu hỏi; không bắt mọi câu hỏi điền đủ mọi trường.
- Dòng điền sẵn theo trường của Stitch chưa được bật cùng chức năng bổ sung nhanh; người dùng vẫn nhập hoặc sửa trực tiếp trong chat.
- Lịch sử giữ mặc định thu gọn và lựa chọn đã lưu. Không cố định hai hội thoại như ảnh mẫu.
- Khung tím/điểm kéo không được đưa vào ứng dụng. DESIGN.md không được dùng để thêm duyệt hồ sơ hoặc chữ ký.

## Triển khai và tiếp tục công việc

Lượt đầu từ thư mục Git cha bị Vercel chặn theo quyền tác giả commit; bản ghi ở deployment-blocked.json (tệp cục bộ/không kèm bản công khai). Bản thành công được triển khai bằng tài khoản CLI đã xác thực từ gói độc lập chứa đúng 40 tệp được duyệt, cùng `.vercel/project.json`. Không sửa danh tính tác giả hoặc lịch sử Git. Xem [hướng dẫn triển khai CLI](https://vercel.com/docs/deployments) và [quyền tác giả commit](https://vercel.com/docs/git) trước lần cập nhật sau. Không đổi bảo vệ project hoặc tạo token bypass.

Nguồn chính vẫn ở `demo-hust/`. Khi triển khai lại, kiểm tra gói ứng dụng và Vercel project, xử lý thông tin Git cha đúng nguyên nhân nếu gặp lại, rồi kiểm tra URL công khai. Không lấy thư mục tạm triển khai làm source mới.

Bản trước thay UI được giữ tại before-ui.tar.gz (tệp cục bộ/không kèm bản công khai). Dấu tệp trước thay ở `protected-before.json`; các lần thử chưa đạt được lưu riêng, không thay bằng chứng lịch sử.

Việc tiếp theo: triển khai tìm lịch sử và bổ sung theo trường khi được chọn; nếu cần nhãn thời gian từng lượt, bổ sung schema/lịch sử có tương thích bản cũ. Nguồn HUST được xác nhận, mô hình thật và các thẻ T1/T3/T4/T10 thuộc các chặng tiếp theo của đề tài.
