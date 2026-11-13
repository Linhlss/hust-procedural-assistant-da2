## Cập nhật sau lịch 06:00 — 11/11/2026

URL chính https://hust-t6-demo.vercel.app hiện dùng **fixture**. Bản Gemini https://hust-t6-demo-1d0bcxgl4-linhozz.vercel.app, `dpl_GYYrBcA9DAKcRsdbS9kbrGKtccCZ`, trace=0. Gemini chưa đạt gate công khai: hai câu định mức mới vẫn bị kiểm đầu ra từ chối (GEMINI_SCHEMA). Giữ public fixture; không fallback âm thầm và không gọi là đã phát hành Gemini. 156 unit và typecheck đạt; lượt cuối 8 kiểm tra web, 36 yêu cầu API. Báo cáo tuần 6 có PDF/source riêng. Các kết quả cũ không thay điểm, báo cáo hoàn chỉnh/tuần 4–5/Excel và nguồn mẫu giữ nguyên.

# Hiện trạng 11/11/2026 — Gemini đã chạy, gate công khai còn chờ

- Hoàn thiện tìm lịch sử và nhập dữ kiện trực tiếp; 13 API typed trên Gemini đạt, không gọi mô hình. Bổ sung kiểm Escape/focus/draft qua MCP.
- Gemini trích và soạn thật trên Vercel Free; 138 ca mã và typecheck đạt. Đã chạy hết hai bộ cũ/giữ riêng, đọc 54 phản hồi; giữ tất cả lỗi và không thay kỳ vọng.
- Sau đánh giá sửa thao tác từng trường/đoạn lời khai, ngày sai, định tuyến và thiếu căn cứ định mức. Các vòng 3.1/3.5 mới và hồi quy tách riêng; không gộp số liệu.
- Public vẫn fixture: https://hust-t6-demo.vercel.app. Candidate cuối trace=0: https://hust-t6-demo-624oth83o-linhozz.vercel.app. Hai smoke ngày/định mức lỗi dịch vụ, chưa promote.
- Báo cáo tuần 6 LaTeX/PDF hai trang đã tạo theo mẫu tuần 5, không in ngày/họ tên. Báo cáo cũ và Excel không đổi.
- [Biên bản](GEMINI_VERCEL_2026-11-10.md), [bằng chứng tuyển chọn](evidence/week6/README.md), [rà hai kế hoạch](AUDIT_HAI_KE_HOACH_2026-11-11.md), [tổng hợp tuần 6](../../Artifact_De_tai_chinh/Tuan_6/KET_QUA_TUAN_6.md).

---

# Cập nhật mới nhất — 10/11/2026: chuẩn bị Gemini trên Vercel

- Thêm mode Gemini để trích dữ kiện và soạn phản hồi theo ngữ cảnh, còn engine quản lý điều kiện/nguồn. Lựa chọn trực tiếp không gọi mô hình; lịch sử cũ tương thích.
- 127/127 ca mã, typecheck và build bản thử Vercel đạt. Key Secret đã lưu Preview/Production, đã gọi Gemini thật trên bản riêng; chưa có điểm đánh giá đầy đủ. Production chính vẫn fixture. Free Tier được kiểm tại AI Studio; đang thử 3.5 Flash-Lite do quota 500 RPD. Có lỗi Google 503 tải cao, giữ bằng chứng và retry tối đa một lần; không retry quota 429.
- Đóng băng 30 hội thoại mới/41 lượt, chia 10 phát triển và 20 giữ riêng; giữ 20 hội thoại cũ/39 lượt. Có chấm dữ kiện tự thêm và rubric nội dung.
- Chấm lại phản hồi cũ bằng tiêu chí bổ sung: Ollama 4/20, 9/39; kết quả cũ 6/20, 14/39 vẫn giữ nguyên. Không gọi Ollama mới.
- [Biên bản và bước nhập key](GEMINI_VERCEL_2026-11-10.md); [tổng hợp tuần 6](../../Artifact_De_tai_chinh/Tuan_6/KET_QUA_TUAN_6.md). Tiếp tục cấu hình key trực tiếp trên Vercel rồi chạy thật trong Free Tier.

---

# Cập nhật mới nhất — 10/11/2026: mở chức năng đang khóa

- Đã hoàn thiện tìm toàn bộ lịch sử (có/không dấu, đoạn trích, số kết quả) và Bổ sung/Sửa từng dữ kiện theo kiểu nhập; có rút dữ kiện, giữ bản nháp, lỗi/thử lại/hủy và luồng riêng khi chờ xác nhận tình huống.
- Đầu vào có kiểu được kiểm ở máy chủ, không gọi mô hình cho lựa chọn trực tiếp. Lưu thông tin đã ghi nhận theo lượt, đọc được lịch sử cũ; nguồn/kết luận luôn do engine dựng lại. Không đổi quy tắc và nguồn mẫu.
- Production https://hust-t6-demo.vercel.app, `dpl_9cGiDLnu9587x7K6gfLgMfgahk69`, READY; tiếp tục fixture. Cục bộ http://127.0.0.1:3020 dùng Ollama. Không thay cấu hình riêng của máy lên Vercel.
- 113 kiểm thử mã, build/typecheck đạt; 72 ca hồi quy cục bộ, 17 ca public sáng/tối và 36 yêu cầu API không đăng nhập đạt. Kiểm tra thông báo ở cửa sổ thấp/video cuối đạt. Một ca web đòi model hiểu đổi nguồn chưa đạt vì OLLAMA_SCHEMA; kiểm tra phục hồi bằng lựa chọn tường minh đạt, giữ cả hai bằng chứng.
- Vòng mô hình mới giữ 20 hội thoại/39 lượt: Ollama 6/20, 14/39; fixture 15/20, 33/39. Trung vị 12.40 giây; không cải thiện mức đạt so với vòng trước. Chat tự do còn lỗi, chưa xác nhận nghiệp vụ.
- [Biên bản, cách chạy và video](MO_CHUC_NANG_GIAO_DIEN_2026-11-10.md); artifact `artifacts/demo-runs/unlock-ui-2026-11-10-161016`. 43 tệp bảo vệ không đổi; báo cáo/Excel không chỉnh sửa. Nguồn chính vẫn ở demo-hust, gói triển khai tạm chỉ chứa runtime và nguồn mẫu công khai.

---

# Cập nhật mới nhất — 10/11/2026: thử Ollama tại máy

- Đã thêm adapter `ollama`, dùng `qwen3.5:9b` sẵn có trên M1/16 GiB; không tải model, không mua credits, không triển khai lại Vercel.
- Model chỉ trích ý định/dữ kiện; engine và nguồn mẫu không đổi. Thêm mode vào API/histories, nhãn “AI tại máy”, lỗi rõ ràng, nút Hủy và kiểm giới hạn context; không cắt lịch sử/fallback âm thầm.
- Bộ đóng băng 20 hội thoại, 39 lần gọi: Ollama **7/20 hội thoại, 16/39 tiền tố đạt**; fixture **15/20, 33/39**. Trung vị 12,95 giây, p95 33,36 giây. Ba phản hồi sai schema bị chặn. Còn lỗi suy diễn `related:false`, câu ngắn và chuyển dữ kiện. Đây là kết quả kỹ thuật, chưa xác nhận nghiệp vụ hoặc chứng minh model tốt hơn fixture.
- **100/100** kiểm thử mã; typecheck/build đạt; **65** kiểm thử web fixture, **2** ca hủy trên desktop/điện thoại và **1** kiểm thử web Ollama đạt. Kịch bản web gồm ba lượt thật; lỗi/hủy ở web được giả lập riêng, không cộng vào 39 lần gọi đánh giá.
- Bản cục bộ trong phiên bàn giao: http://127.0.0.1:3020. `.env.local` (Git bỏ qua) đặt `ollama`; khi khởi động lại cần mở Ollama và chạy web. Vercel giữ bản trước đó.
- [Biên bản + hướng dẫn](THU_MO_HINH_OLLAMA_2026-11-10.md), so sánh từng ca (tệp cục bộ/không kèm bản công khai), video (tệp cục bộ/không kèm bản công khai). Bằng chứng mới ở `artifacts/demo-runs/ollama-local-2026-11-10-134830/`; không ghi đè biên bản cũ hoặc sửa LaTeX/PDF/Excel.
- Tiếp theo: sửa lỗi hiểu dữ kiện rồi thử vòng mới với tập độc lập; bổ sung nguồn và đáp án T6 được xác nhận. Chưa mở khóa tìm lịch sử hoặc bổ sung nhanh.

---

# Cập nhật mới nhất — 08/11/2026: than chì và animation

- URL **https://hust-t6-demo.vercel.app**, deployment `dpl_8azYjaE8dNPviyawDDYwAPWRc9xw`, READY / Production.
- Dựng theo bộ Stitch `(1)`: nền than chì, thẻ nổi, công tắc theme dạng gạt; mặc định tối, giữ theme đã lưu. Ô nhập gọn, nút gửi cùng hàng, vùng nội dung tối đa 780 px.
- Animation chung có độ nảy cho điều khiển; bảng, căn cứ, lịch sử, phản hồi và thông báo có chuyển động; Reduced Motion và cuộn chủ động được giữ. Thanh trái 200–360 px, tiêu đề “…” vẫn hoạt động.
- Đạt typecheck/build, 90 ca xử lý/mock, 65 ca trình duyệt cục bộ, 20 ca trình duyệt và 23 yêu cầu API ẩn danh trên URL thật.
- [Biên bản, ảnh đối chiếu, video](GIAO_DIEN_THAN_CHI_MOTION_2026-11-08.md). Bằng chứng ở `artifacts/demo-runs/motion-release-2026-11-08/` và `motion-production-2026-11-08/`.
- Runtime vẫn `fixture` / T6, chưa dùng mô hình hoặc nguồn HUST được xác nhận. API, schema lịch sử và báo cáo được giữ nguyên.

---

# Cập nhật mới nhất — 08/11/2026: thanh trái điều chỉnh độ rộng

- URL **https://hust-t6-demo.vercel.app**, deployment `dpl_58od9tHUjEY5KdGtmqB5K6GqTUu6`, READY / Production.
- Đã bỏ dòng nhắc về dữ liệu cá nhân dưới ô nhập; giữ nút gửi và thông báo đủ 24 lượt.
- Thanh trái kéo ngang 200–360 px, tối đa 35% cửa sổ, mặc định 232 px; lưu lựa chọn, nhấp đúp đặt lại, hỗ trợ bàn phím và Escape hủy kéo. Tiêu đề một dòng có dấu “…”, giữ cỡ chữ và không tràn ngang.
- Typecheck/build đạt; 59 ca trình duyệt tại máy, 19 ca Chrome và 23 yêu cầu API ẩn danh trên URL công khai đều đạt. 83 tệp bảo vệ không đổi; không sửa API, nguồn mẫu hoặc schema lịch sử.
- [Biên bản, ảnh và cách dùng](THANH_TRAI_2026-11-08.md). Bằng chứng mới ở `artifacts/demo-runs/sidebar-local-final-2026-11-08/` và `sidebar-production-2026-11-08/`.

---

# Cập nhật hiện tại — 08/11/2026: giao diện Stitch

- Đã triển khai giao diện mới sáng/tối cho chat, thư viện và trang đọc tài liệu tại **https://hust-t6-demo.vercel.app**.
- Deployment `dpl_7pHMNbyLfogDEyzSjE2tiPQK2Zji`, READY, Production; SHA-256 runtime `6227c7500170149a90065935429e0794a57dc5e0dc888dddb89f0fa7163de366`.
- Đã kiểm tra 90 ca xử lý/mock, 51 ca Chrome và 23 yêu cầu API ẩn danh trên URL công khai. Typecheck/build đạt. Số đếm và thông tin thiếu lấy từ hội thoại thật.
- Tìm lịch sử và “Bổ sung” từng trường hiển thị nhưng khóa; có giải thích khi trỏ/focus. Lịch sử hiện có giữ nguyên, theme lưu riêng bằng `hust-ui-theme`.
- Runtime vẫn là T6 / nguồn mẫu `SIM-*`, `fixture`; chưa gọi mô hình thật hoặc xác nhận nghiệp vụ HUST. Báo cáo, API, nguồn mẫu, lịch sử và lockfile được kiểm dấu tệp, không đổi.
- [Biên bản, ảnh đối chiếu, phạm vi và cách tiếp tục](GIAO_DIEN_STITCH_2026-11-08.md). Bằng chứng mới: `artifacts/demo-runs/stitch-release-final-2026-11-08/` và `stitch-production-2026-11-08/`.
- Lượt triển khai có thông tin Git cha bị chặn; đã triển khai đúng tệp ứng dụng từ gói độc lập dưới tài khoản được xác thực. Không sửa Git hoặc quyền bảo vệ project.

---

Nhật ký dưới đây ghi lại các phiên trước; thông tin hiện hành ở phần trên.

# Tiến độ và điểm tiếp tục của demo

## Tuần 6 — chuẩn bị nguồn và củng cố luồng tư vấn (07/11/2026)

Đã chuẩn bị [phiếu xin dữ liệu](../../Artifact_De_tai_chinh/Tuan_6/PHIEU_XIN_DU_LIEU_2026-11-07.md) gồm 14 mục theo mốc 07/11/2026, năm/đợt, đối tượng và đơn vị; chưa gửi hoặc nhận thêm nguồn. [Bảng căn cứ T6](../../Artifact_De_tai_chinh/Tuan_6/CAN_CU_T6_2026-11-07.md) có 9 điều kiện ứng viên, 5 vị trí OCR chờ kiểm ảnh gốc và 11 ca nghiệp vụ chưa chạy. Kho vẫn thiếu ba bản gốc, quyền dùng và xác nhận chuyên môn; không thay chính sách mẫu.

Đã làm rõ hướng dẫn hiện hành, dữ kiện vừa đổi và câu hỏi đang chờ; giữ cuộn chủ động, căn cứ và lịch sử. Schema adapter bổ sung trường chuyển tình huống/xóa dữ kiện/quan hệ nguồn, kiểm đầu ra không hợp lệ. 90 ca xử lý (13 ca mock mới), 42 ca Chrome và 23 yêu cầu API tại máy đạt; typecheck/build đạt. Chưa gọi mô hình thật hoặc triển khai bản mới lên Vercel. Báo cáo hoàn chỉnh và tuần 5 giữ nguyên.

Bằng chứng: week6-local-2026-11-07-200854 (tệp cục bộ/không kèm bản công khai). Chi tiết và việc còn chờ: [kết quả tuần 6](../../Artifact_De_tai_chinh/Tuan_6/KET_QUA_TUAN_6.md).

## Gộp thư mục làm việc — 07/11/2026

Bộ làm việc chính đã chuyển sang thư mục ĐA 2 theo [nhật ký gộp](../../GOP_PROJECT_2026-11-07.md). Mã xử lý, fixture và source báo cáo giữ nguyên. Không triển khai lại Vercel hoặc tích hợp mô hình mới.

Đã cài phụ thuộc từ lockfile bằng npm ci; typecheck/build đạt. Chạy lại 77 ca xử lý, 37 ca Chrome và 23 yêu cầu API ẩn danh tại máy đều đạt, trình duyệt không có ca lỗi/bỏ qua/flaky. Bằng chứng mới ở migration-2026-11-07 (tệp cục bộ/không kèm bản công khai); các kết quả ngày 28/10 giữ nguyên.

Báo cáo hoàn chỉnh 27 trang và tuần 5 hai trang biên dịch được tại vị trí mới; vị trí chữ của toàn bộ trang khớp bản nguồn. Kho có 127 tệp/trang được kiểm dấu kiểm, 45 nội dung, 10 nhóm/21 mục bổ sung và 28 ca thời gian; vẫn thiếu nguồn, chưa đóng yêu cầu hoặc chạy ca nghiệp vụ mới.

## Nguồn và phạm vi hoàn thành — 02/11/2026

Đã chốt năm nhóm T1/T3/T4/T6/T10 và nhánh phụ thuộc; chưa cam kết sở hữu trí tuệ/hợp tác. Lịch sử theo nhiệm vụ/nghĩa vụ đang tiếp diễn, giấy tờ tồn đọng và điều khoản chuyển tiếp, không gom vô hạn. Đã đồng bộ requirement, nguồn thiết kế và dấu kiểm tệp.

Ngoài ứng dụng đã có 10 nhóm / 21 mục cần bổ sung, sổ xác minh 45 nội dung đã tải, bốn điểm nghiệp vụ chờ xác nhận và 28 ca thiết kế thời gian/chuyển tiếp. Xem [báo cáo triển khai](../../Artifact_De_tai_chinh/11_TRIEN_KHAI_DANH_MUC_DU_LIEU_BO_SUNG_2026-11-02.md). Chưa đóng mục nguồn hoặc chạy ca nghiệp vụ nào; ba bản gốc vẫn thiếu. Kiểm tra cấu trúc/toàn vẹn không phải xác nhận chính sách.

Đợt này không đổi mã hội thoại, fixture runtime hoặc triển khai Vercel. Những kết quả kỹ thuật trước đây ở phần dưới không áp dụng cho 28 ca nghiệp vụ mới. Chỉ chuẩn hóa nội dung thật khi đủ nguồn, quyền dùng, chủ nội dung và đáp án được xác nhận.

Kiểm tra bộ danh mục: 127 tệp/trang khớp mã băm, 13 phép kiểm tính nhất quán/cổng đóng đạt, các liên kết bàn giao hợp lệ. `collection_complete=false`; lệnh yêu cầu hoàn thành trả mã 2 đúng vì còn thiếu nguồn/xác nhận. Không chạy lại kiểm thử ứng dụng vì không sửa mã hoặc dữ liệu runtime.

## Hiện hành — củng cố lỗi tồn đọng T6 trước phân quyền (28/10/2026)

Đã hoàn tất đợt củng cố và kiểm chứng theo báo cáo người dùng yêu cầu: `../Artifact_De_tai_chinh/09_BAO_CAO_TON_DONG_VA_CAI_THIEN_DEMO_T6.md`. Phạm vi chỉ củng cố T6/F01–F05, không triển khai tài khoản/phân quyền, chính sách mới hoặc các thẻ còn lại.

Đã sửa phân tích khẳng định/phủ định theo mệnh đề cho hoạt động/nguồn, ngày đầy đủ có dấu gạch ngang và nhiều ngày mơ hồ; định tuyến tên thẻ chưa hỗ trợ ra khỏi T6. Tình huống mới có dữ kiện chờ riêng, hỏi quan hệ trước khi dùng lại dữ kiện cũ; chọn mới xóa dữ kiện cũ, chọn tiếp tục áp dụng thay đổi và làm rõ quan hệ nguồn nếu cần. Lịch sử giữ dữ kiện chờ và loại phản hồi; câu ngoài phạm vi không bị ghi thành trả lời thành công của câu hỏi đang chờ.

Đã có baseline 28 ca tái hiện (5 ca đạt trước sửa, 23 ca phát hiện lỗi); bộ mở rộng 34 ca đạt tại máy và trên URL thật, tổng 77 ca xử lý đạt. Đây là bộ ca nhắm vào lỗi, không suy ra tỷ lệ đúng trên câu hỏi thực tế. 37 ca Chrome tại máy và 37 ca Chrome Production đạt (0 lỗi/bỏ qua/flaky); 23 request API nền đạt, 6 tệp/6 trang nguồn truy cập được. Đã triển khai https://hust-t6-demo.vercel.app, deployment `dpl_GgzsQA4ZVpsUdfPNhuihwnhBi5bn`, READY; URL phiên bản https://hust-t6-demo-jpjhjs9p7-linhozz.vercel.app.

Tệp chính: `src/lib/language.ts`, `extractor.ts`, `engine.ts`, `types.ts`, `history.ts`, `timeline.ts`; `tests/robustness-cases.ts`, `robustness.test.ts`, `tests/browser/robustness.spec.ts`, `scripts/audit-robustness.ts`. Bằng chứng ở `artifacts/demo-runs/robustness-local-2026-10-28/`. Bằng chứng Production ở `artifacts/demo-runs/robustness-production-2026-10-28/ACCEPTANCE.md`, deployment.json và các transcript; mã SHA-256 `5f427f592cdb4afed164956f970ed56f2100843b18eff8d6515e1b2e01f539d3`. Gói có 33 tệp runtime; sáu nguồn thiết kế và tám tệp chính sách/tài liệu runtime giữ nguyên. Báo cáo tổng hợp đã có kết quả trước/sau và phần còn tồn đọng; chưa triển khai phân quyền, nguồn HUST thật hoặc mô hình thật.

## Lịch sử — giữ vị trí đọc, trạng thái rà soát và hỏi mẫu đúng ngữ cảnh (28/10/2026)

**Trạng thái:** đã triển khai và kiểm chứng ẩn danh trên https://hust-t6-demo.vercel.app. Deployment `dpl_8r5yfUrUyq48d7KkcNDBhEtZXTcm`, READY, Production; URL phiên bản https://hust-t6-demo-lz864bpy8-linhozz.vercel.app. 41 ca xử lý, 31 ca trình duyệt tại máy và 31 ca trình duyệt URL thật đạt.

- Bỏ hiệu ứng tự cuộn khi gửi/nhận/đổi busy; focus ô nhập dùng preventScroll. Có nút Xem phản hồi mới do người dùng chủ động bấm. Nút chuyển vị trí tức thời để không còn hoạt ảnh cuộn tiếp tục can thiệp khi gửi ngay câu mới.
- Khi gửi, hiển thị câu người dùng đang chờ và biểu tượng đang rà soát ngay trong hội thoại lẫn phía trên ô nhập. API bắt đầu xử lý ngay; trạng thái chờ tối thiểu 650ms cho phản hồi nhanh, không có các bước xử lý giả. Chỉ hiện kết quả sau khi API xong; lỗi/hủy/chuyển cuộc dọn trạng thái chờ, không ghi đáp án cũ.
- Sửa đường tắt trả lời chung của câu hỏi mẫu giấy tờ/các bước/thời điểm: hỏi hoạt động, nguồn và ngày còn thiếu để chọn hướng dẫn. Không hỏi địa điểm/quan hệ nhiệm vụ nếu chúng không đổi danh mục chuẩn bị. Câu cá nhân cần làm gì vẫn đi qua đối chiếu điều kiện T6 đầy đủ. Yêu cầu tổng quan rõ ràng/tìm tài liệu được trả trực tiếp; không thể cung cấp thì nêu giới hạn.
- Giữ requestedTopic/preparationOnly qua lượt trả lời ngắn/lịch sử để cuối chuỗi vẫn trả đúng giấy tờ, bước hoặc thời điểm ban đầu. Hướng dẫn chọn đúng nguồn nhiệm vụ/đơn vị theo ngày/profile; không trích nguồn riêng đã thiếu/hết khoảng áp dụng. Nguồn và quy tắc gốc không đổi.
- Lịch sử ở thanh bên mặc định thu gọn, bấm tiêu đề để mở/đóng; nhớ lựa chọn trên trình duyệt. Điện thoại vẫn có mở/đóng bảng lịch sử. Thu gọn không xóa hội thoại.

Tệp chính: `src/components/Chat.tsx`, `src/app/globals.css`, `src/lib/engine.ts`, `clarification.ts`, `extractor.ts`, `types.ts`, `history.ts`. Thêm `tests/feedback.test.ts` (6 ca) và `tests/browser/feedback.spec.ts` (7 ca); cập nhật các assertion cũ tương ứng mục tiêu mới. Kiểm rà soát/no-auto-scroll gồm phản hồi nhanh, lỗi, hủy và gửi tiếp sau thao tác xem phản hồi.

Bằng chứng cục bộ: `artifacts/demo-runs/feedback-local-2026-10-28/`; 31 ca Chrome đạt, 0 lỗi/bỏ qua/flaky; unit-results.txt ghi 41 ca đạt, typecheck/build đã chạy. Gói kiểm có 32 tệp runtime, không env/tài liệu gốc/nhật ký riêng; SHA-256 mã `17ee63716b6d31e44e87cb34038d9085ef7248bd6e86ad02320f896d41e22285`. Sáu nguồn thiết kế giữ nguyên. URL thật: 31 ca Chrome đạt (0 lỗi/bỏ qua/flaky), 23 request API xác minh, 6 tệp + 6 trang nguồn truy cập được. Biên bản, deployment và ảnh ở `artifacts/demo-runs/feedback-production-2026-10-28/ACCEPTANCE.md`; kết quả chi tiết ở browser-results.json và api-transcripts.json. Không còn bước triển khai/kiểm chứng đang chờ cho yêu cầu này. Tải lại URL để nhận bản mới; chế độ vẫn fixture/tài liệu mẫu, chưa xác minh chính sách HUST hoặc mô hình AI thật.

## Lịch sử — ô nhập cố định, hội thoại gọn và căn cứ theo nhóm (28/10/2026)

Đã triển khai https://hust-t6-demo.vercel.app, deployment `dpl_FNZkPuMbj6ueyjzN8LpR7TpuV8jS`, READY, Production; URL phiên bản https://hust-t6-demo-ku9frbl8k-linhozz.vercel.app. Đã xác minh truy cập và hội thoại bằng trình duyệt/API ẩn danh.

- Ô nhập cố định ở đáy cửa sổ khi cuộn lên/xuống, căn theo chiều rộng bảng tình huống; đo chiều cao để nội dung cuối không bị che, có xử lý safe area và bàn phím điện thoại.
- `src/lib/timeline.ts` nhóm chuỗi hỏi bổ sung thành một khối hiển thị. Chỉ câu đang hỏi có thẻ đầy đủ; câu đã trả lời thành một dòng. Khi đủ thông tin, luồng chính còn câu ban đầu và hướng dẫn cuối, các lượt làm rõ chuyển vào căn cứ. Toàn bộ lịch sử gốc vẫn được lưu; các lần tư vấn/sửa sau không mất câu trả lời hoàn chỉnh trước đó, vẫn giữ thay đổi nghiệp vụ thật.
- `src/components/Evidence.tsx` chia Nguồn tài liệu / Thông tin đã làm rõ; nhóm theo văn bản, mỗi lần mở một văn bản, thông tin phiên bản và liên kết chỉ hiện một lần. Nút số mở đúng đoạn; tab làm rõ có bảng tóm tắt và mở lại nguyên văn.
- Bỏ mục Chủ đề/thẻ T6 cố định ở thanh bên. Nhãn dự án thể hiện KHCN–TCKH–TCNS, ca đang dùng nằm ở bảng tình huống. Thông tin bản trải nghiệm phân biệt ba Ban của đề tài với ca T6 KHCN–TCKH hiện vận hành; chưa bổ sung chính sách/thẻ TCNS.
- Các nhãn mô phỏng lặp và banner dài đã bỏ; chỉ giữ thông tin chế độ trong Bản trải nghiệm cùng chú thích ngắn tại câu trả lời/tài liệu.

### Kiểm chứng bản hiện hành

| Hạng mục | Kết quả | Bằng chứng |
|---|---|---|
| Typecheck/build | Đạt; Vercel READY | Chạy thật trước triển khai. |
| Bộ xử lý/hội thoại | 35 ca đạt, gồm 5 ca timeline mới | `tests/timeline.test.ts`, các bộ thử trước; transcript local. |
| Trình duyệt tại máy | 24 ca đạt | `artifacts/demo-runs/compact-local-2026-10-28/browser-results.json`. |
| Trình duyệt URL thật | 24 ca đạt, 0 lỗi/bỏ qua/flaky | `compact-production-2026-10-28/browser-results.json`; desktop và điện thoại. |
| API URL thật | 22 request đạt | `compact-production-2026-10-28/api-transcripts.json`. |
| Tài liệu | 6 tệp + 6 trang đọc truy cập được | `api-transcripts.json/documentChecks`; mở/tải UI đạt. |
| Gói và phiên bản mã | 32 tệp runtime, không dữ liệu riêng hoặc tài liệu gốc; sáu nguồn thiết kế giữ nguyên | `compact-local-2026-10-28/deployment-inputs.json`; SHA-256 `23a730b85c1f3a2b859bff20454c56c732fedc13860b2d9a8d0ab55c27187134`. |

Biên bản và ảnh: `artifacts/demo-runs/compact-production-2026-10-28/ACCEPTANCE.md`. Tệp chính: `Chat.tsx`, `Guidance.tsx`, `Evidence.tsx`, `globals.css`, `timeline.ts`. Chế độ vẫn fixture/tài liệu mẫu, chưa có mô hình thật hoặc xác nhận chính sách HUST. Tải lại URL để nhận bản mới; chạy thử mới đặt `HUST_TEST_ARTIFACT_DIR` riêng để giữ bằng chứng. Các mục sau là lịch sử.

## Lịch sử — sửa luồng hỏi đáp và không gian tình huống (28/10/2026)

Đã triển khai **https://hust-t6-demo.vercel.app** với deployment `dpl_8mkkVRpBn785mocPXvaPF5CMUXJo` (`READY`, Production), URL phiên bản https://hust-t6-demo-4zeix9n9g-linhozz.vercel.app. Đã xác minh bằng Chrome và API ẩn danh.

### Thay đổi theo yêu cầu mới

- Hỏi bổ sung từng bước: tách câu cá nhân “cần làm gì” khỏi câu hỏi thông tin chung; chọn một dữ kiện cần thiết mỗi lượt, giải thích lý do, có lựa chọn nhanh và ô chọn ngày. Phần đã có không hỏi lại; có thể nhập nhiều dữ kiện một lần, trả lời ngắn theo câu đang hỏi, từ chối bổ sung hoặc thử lại khi lỗi. Lịch sử giữ được câu đang chờ.
- Sau ca đã đủ dữ kiện, nếu mô tả trường hợp mới chưa rõ quan hệ với ca cũ, hỏi tiếp tục hay bắt đầu mới trước khi dùng ngày/nguồn cũ. Không tự điền thông tin còn thiếu hoặc coi thiếu căn cứ là một dữ kiện người dùng cần khai.
- Phần hướng dẫn có thứ bậc rõ, các ý chuẩn bị và bước tiếp theo. Citation có vùng riêng, đóng mặc định; bấm [1]/[2] mở đúng đoạn. Trích dẫn có nhãn, nền và cỡ chữ riêng, vẫn giữ dữ kiện/lý do đối chiếu, phiên bản và liên kết tài liệu. Chuyển chủ đề thông tin không tạo bảng gạch bỏ đoạn hướng dẫn dài như thay đổi nghiệp vụ.
- “Không gian tình huống” chuyển thành bảng phải mặc định đóng; nút bật/tắt ngay trái “Bản trải nghiệm” trên thanh trên. Có ×, Escape, khôi phục focus và nền đóng trên điện thoại; desktop dành chỗ cho bảng, đóng bảng trả lại không gian đọc. Dữ kiện và hội thoại không bị xóa khi đóng.
- Ví dụ đầu tiên đổi thành “Bắt đầu tư vấn từng bước” để người xem thấy ngay luồng hỏi bổ sung.

### Kiểm chứng bản hiện hành

| Hạng mục | Kết quả | Artifact |
|---|---|---|
| Typecheck/build | Đạt; Vercel READY | Đã chạy thật trước deploy. |
| Bộ kiểm xử lý | 30 ca đạt | `tests/dialogue.test.ts` bổ sung 7 ca cho luồng theo ảnh, ngữ cảnh, đủ/thiếu, lịch sử và trường hợp mới; giữ các bộ thử trước. |
| Trình duyệt tại máy | 17 ca đạt | `artifacts/demo-runs/dialogue-local-2026-10-28/browser-results.json`. |
| Trình duyệt URL thật | 17 ca đạt, 0 lỗi/bỏ qua/flaky | `artifacts/demo-runs/dialogue-production-2026-10-28/browser-results.json`. |
| API URL thật | 22 request xác minh đạt | `dialogue-production-2026-10-28/api-transcripts.json`; G01 là chuỗi hỏi theo câu nguyên văn trong ảnh. |
| Tài liệu | 6 tệp + 6 trang đọc truy cập được | `api-transcripts.json/documentChecks`; mở/tải thực tế qua UI vẫn đạt. |
| Gói và dấu mã | Không env, nhật ký riêng hoặc tài liệu gốc | `dialogue-local-2026-10-28/deployment-inputs.json`; SHA-256 `cac84e20edf3c49dd7f0780fd5c1cdaf2ec016f467bc62317b4d87cb08246ac2`. |

Biên bản: `dialogue-production-2026-10-28/ACCEPTANCE.md`; ảnh guided-question, readable-answer, citations-open, situation-panel và mobile-drawer. Tệp chính: `src/lib/clarification.ts`, `extractor.ts`, `engine.ts`, `types.ts`, `history.ts`, `src/components/Guidance.tsx`, `Chat.tsx`, CSS và ca thử. Chế độ vẫn fixture/tài liệu mẫu; chưa có mô hình thật hoặc đánh giá chính sách HUST.

### Cách kiểm tra lại

Tải lại trang, chọn “Bắt đầu tư vấn từng bước”, gửi câu và lần lượt chọn nguồn/địa điểm/ngày/quan hệ nhiệm vụ khi được hỏi. Có thể cung cấp đủ ngay đầu để thấy bot không hỏi thừa. Nút Không gian tình huống mở/đóng bảng phải; bấm số nguồn để xem citation riêng.

Khi chạy thử tiếp, đặt `HUST_TEST_ARTIFACT_DIR` thành thư mục mới; các lệnh và `PLAYWRIGHT_BASE_URL`/`DEMO_BASE_URL` vẫn ở README. Không sửa tài liệu gốc hoặc phục hồi mục đã bỏ trong báo cáo đã nộp. Những phần tiếp theo là lịch sử các bản trước.


## Lịch sử — bản sửa nhãn, lịch sử và tài liệu mẫu (28/10/2026)

**Trạng thái tại lần triển khai này:** đã sửa và triển khai đủ ba vấn đề: nhãn lặp, lịch sử hội thoại, tài liệu mẫu đầy đủ. URL giữ nguyên **https://hust-t6-demo.vercel.app**; deployment `dpl_EC8UVud1GYhicv2TRayXS1a4ocgu`, trạng thái `READY`, Production; URL phiên bản https://hust-t6-demo-hx8mcgtma-linhozz.vercel.app. Đã xác minh bằng truy cập ẩn danh.

### Thay đổi đã làm

- Bỏ banner cảnh báo dài, nhãn MÔ PHỎNG ở từng lượt và các dấu chỉ demo bị lặp. Gom thông tin chế độ vào “Bản trải nghiệm”. Mỗi câu trả lời còn một chú thích ngắn về tài liệu mẫu; nguồn và trang đọc vẫn nói rõ nguồn gốc. Không biến bộ mẫu thành chính sách HUST.
- Lịch sử dùng localStorage, có danh sách tên/ngày/số lượt ở thanh bên và bảng lịch sử trên điện thoại. Mở lại và tiếp tục được sau đóng trang/trình duyệt, hội thoại mới giữ cuộc cũ. Có xóa từng cuộc/khôi phục, lọc dữ liệu hỏng, tối đa 20 cuộc/30 ngày khi đọc/ghi, giới hạn dung lượng; dữ liệu v1 được nhập một lần. Các tab cập nhật danh sách, giữ cuộc đang mở riêng; nếu cùng sửa một cuộc, lưu nhánh để tránh ghi đè. Trình duyệt chặn lưu trữ được báo rõ, chat vẫn dùng được. Chưa có đồng bộ tài khoản/thiết bị.
- Bộ mặc định `standard` đầy đủ nguồn nhiệm vụ, công tác và đơn vị; `missing-unit` giữ ca thiếu nguồn cũ, `conflict` giữ ca mâu thuẫn. Đây là điều chỉnh trải nghiệm theo yêu cầu mới của người dùng; không xóa năng lực dừng đúng F04.
- Tạo 6 tài liệu Markdown tự biên soạn và 6 trang đọc với anchor, từ một nguồn JSON; thư viện hiện 5 tài liệu hướng dẫn, tệp xung đột dùng cho kiểm thử. Căn cứ mở/tải được. Bổ sung nguồn đơn vị, nguồn kết hợp và sổ tay giấy tờ/các bước/thời điểm. Câu hỏi hướng dẫn chung không ép người dùng cung cấp mọi trường tình huống; không tự đặt hạn chót hay hạn mức.
- Tệp chính: `src/data/documents.json`, `src/lib/documents.ts`, `sources.ts`, `history.ts`, `engine.ts`, `extractor.ts`, `src/components/Chat.tsx`, `Guidance.tsx`, các trang `/tai-lieu`, `public/tai-lieu/*.md`, các ca thử bổ sung. Mã SHA-256 (src/public/config): `fd1ea52751bd0da3eab083ae58021de3525795c904a1552659960bba4fd7e436`.

### Kết quả thực tế của bản chỉnh sửa

| Kiểm chứng | Kết quả | Bằng chứng |
|---|---|---|
| Typecheck, build | Đạt; Vercel READY | Lệnh thật chạy trước triển khai. |
| `npm test` | 23 ca đạt | `tests/behavior.test.ts`, `tests/revision.test.ts`; transcript bộ điều kiện ở artifact local mới. |
| Trình duyệt local | 11 ca đạt | `artifacts/demo-runs/revision-local-2026-10-28/browser-results.json`. |
| Trình duyệt URL thật, không đăng nhập | 11 ca đạt, không lỗi/bỏ qua | `artifacts/demo-runs/revision-production-2026-10-28/browser-results.json`; gồm phục hồi lịch sử, hai tab, xóa/khôi phục, tải file, điện thoại và lưu trữ bị chặn. |
| API URL thật | 17 request xác minh đạt | `revision-production-2026-10-28/api-transcripts.json`. |
| Tệp và trang nguồn URL thật | 6 tệp + 6 trang đọc trả 200 | `api-transcripts.json/documentChecks`; tải tệp thực tế trong Chrome. |
| Gói triển khai | 29 tệp, có 6 tài liệu tự tạo; không env, tài liệu gốc, lịch sử riêng, tests/report | `revision-local-2026-10-28/deployment-inputs.json`. |

Chi tiết: `revision-production-2026-10-28/ACCEPTANCE.md`, ảnh và `deployment.json`. Bộ thử F01–F05 vẫn giữ thiếu dữ kiện, đổi nguồn, phiên bản, không đáp ứng, thiếu/mâu thuẫn nguồn, ngoài phạm vi, lỗi và chỉ dẫn không tin cậy. Kết quả chỉ xác nhận hành vi trên nguồn giả định; chưa có đánh giá chính sách HUST hoặc mô hình thật.

### Tiếp tục và giới hạn

- Mở lại/tải lại URL để nhận bản mới. Lịch sử thuộc trình duyệt hiện tại; không hứa khôi phục sau khi xóa dữ liệu trình duyệt hoặc đồng bộ trên thiết bị khác.
- Nguồn chính: `src/data/documents.json`; khi sửa, chạy `node --import tsx scripts/generate-documents.ts`, `npm test`, build và kiểm lại nguồn/ca liên quan. Tệp `.md` và trích đoạn phải khớp nhau.
- Khi chạy lại kiểm thử, đặt `HUST_TEST_ARTIFACT_DIR` sang thư mục mới để giữ bằng chứng lần này. Các lệnh vẫn ở README; dùng `PLAYWRIGHT_BASE_URL` và `DEMO_BASE_URL` cho URL thật.
- Chế độ trích xuất vẫn `fixture`, chưa dùng mô hình AI. Vẫn cần nguồn gốc/hiệu lực/quyền dùng và chủ nội dung duyệt trước khi tư vấn chính sách thật. Không đổi phạm vi T6 hoặc ba miền của toàn đề tài.

## Lịch sử — lần xây dựng và triển khai đầu tiên

Nội dung dưới đây là biên bản lần đầu, không phải trạng thái mặc định hiện hành (đặc biệt phần thiếu nguồn đơn vị và sessionStorage đã được thay như trên).

**Cập nhật:** 28/10/2026. **Trạng thái:** đã xây dựng, kiểm thử và triển khai **demo mô phỏng T6/CA-01** lên Vercel. Chưa kiểm chứng tư vấn chính sách HUST hoặc mô hình ngôn ngữ thật.

## URL và hiện trạng đã xác minh

- URL Production: **https://hust-t6-demo.vercel.app**.
- Project: `linhozz/hust-t6-demo`, ID `prj_oV7GrrsI5vz4UpMb6kKnuUfAxoIF`.
- Deployment: `dpl_DXAhbv8oqvfu4AZLbuZ2nvyUnzX4`, trạng thái `READY`, target `production`.
- URL phiên bản: https://hust-t6-demo-k6bwh9wur-linhozz.vercel.app.
- Người nhận link dùng được: đã chạy 5 ca Chrome và 15 request API trên URL Production bằng phiên không đăng nhập, không dùng token chủ project hoặc bypass bảo vệ. Không thay đổi bảo vệ project khác.
- Runtime cấu hình Node 22.x, Next.js 16.4.3, React 19.3.1, TypeScript; có `package-lock.json`. Công cụ chạy kiểm thử tại máy ghi nhận Node 24.16.0, npm 11.13.0.
- Chế độ: `fixture`, nguồn giả định `SIM-*`; chưa gọi mô hình. Adapter OpenAI tùy chọn đã có, chỉ thử bằng mock, chưa cấu hình key/model thật.
- Workspace không phải kho Git. Dấu SHA-256 của mã và cấu hình runtime: `594a0a2b15503187cbe5bb1f1b24ee1bb06e333c385a959893647d4c0878529a` (phương pháp trong artifact `code-version.json`).

## Đã làm

1. Đọc ba skill dự án, phạm vi, hợp đồng nguồn, luồng trạng thái và ca nghiệm thu. Đối chiếu SHA-256 của cả sáu nguồn thiết kế trong `source-manifest.json`: không thay đổi; không sửa requirement/báo cáo đã có.
2. Chuẩn hóa thẻ T6 và nguồn tự tạo trong `src/lib/sources.ts`: điều kiện nhiệm vụ, nguồn chung 2025/2026, nhánh mâu thuẫn, thiếu nguồn đơn vị. Chi tiết ở [hợp đồng dữ liệu đang chạy](DU_LIEU_MO_PHONG.md).
3. Xây giao diện hội thoại tiếng Việt, ví dụ điền vào ô nhập, dữ kiện tự khai, kết luận theo phần, căn cứ mở được, phần đã thay thế và tóm tắt có nguồn để tự trao đổi. Có bố cục điện thoại.
4. API kiểm schema, độ dài/lượt, chọn lại nguồn theo ngày và kinh phí, giữ phần chung; không tin kết luận từ trình duyệt. Phiên nằm trong sessionStorage của từng tab, máy chủ không có kho phiên toàn cục. Yêu cầu cũ bị hủy khi bắt đầu mới; lỗi giữ nguyên câu nhập/dữ kiện và không tạo đáp án giả.
5. Adapter fixture có nhãn; adapter OpenAI dùng Structured Outputs, một lần trích cả lịch sử mỗi request, timeout, schema và kiểm số lượt. API key chỉ phía máy chủ; lỗi không tự chuyển sang fixture.
6. Tự rà soát và sửa: kiểm origin theo host thực tế của trình duyệt; ngừng dùng ngày cũ khi sửa ngày không hợp lệ; giữ mốc so sánh kết luận qua lượt ngoài phạm vi; làm rõ thay thế/kết hợp; tăng cỡ chữ, độ tương phản và thêm nguồn vào tóm tắt.
7. Người dùng hoàn tất đăng nhập/cấp quyền CLI Vercel. Kiểm tài khoản, danh sách project trống, tạo project demo riêng, liên kết đúng thư mục rồi triển khai Production.

## Kết quả đã chạy

| Kiểm chứng | Kết quả thực tế | Bằng chứng |
|---|---|---|
| `npm run typecheck` | Đạt | TypeScript không báo lỗi trong lần kiểm cuối trước deploy. |
| `npm test` | 17 ca đạt, 0 lỗi | `tests/behavior.test.ts`; transcript D01–D11 trong artifact local. |
| `npm run build` | Đạt tại máy; Vercel báo deployment READY | Không dùng build để thay bằng chứng hội thoại. |
| `npm run test:e2e` tại máy | 5 ca đạt | Desktop/mobile, đổi nguồn, mâu thuẫn, nhiều phiên, thử lại/hủy yêu cầu cũ. |
| Chrome trên URL Production | 5 ca đạt, 0 bỏ qua/lỗi | `production-2026-10-28/browser-results.json`, ảnh desktop/mobile/đổi nguồn. |
| API ẩn danh trên URL Production | 15 request xác minh đạt | `production-2026-10-28/api-transcripts.json`; bao gồm request không hợp lệ bị từ chối 400. |
| Gói triển khai | Chỉ mã/cấu hình và lockfile; loại tài liệu gốc, env, docs, tests và transcript | `local-2026-10-28/deployment-inputs.json`, được kiểm bằng `vercel deploy --dry --json`. |

### F01–F05 trong phạm vi fixture

| Tiêu chí | Kết quả | Bằng chứng/lý do |
|---|---|---|
| F01 | Đạt trên bộ thử | D01 hỏi địa điểm/ngày còn thiếu, D02 không hỏi lại khi đủ. Ca từ chối cung cấp thêm trả giới hạn có điều kiện. |
| F02 | Đạt trên bộ thử | D01-b tách SIM-NV/KHCN và SIM-CT/TCKH; D05 giữ điều kiện nhiệm vụ khi điều kiện chung xung đột. |
| F03 | Đạt trên bộ thử | D03 loại nguồn nhiệm vụ và đánh dấu kết luận cũ đã thay thế, giữ điều kiện chung; D06 chọn phiên bản mới theo ngày hoạt động. |
| F04 | Đạt trên bộ thử | D03 thiếu SIM-DV, D05 mâu thuẫn dừng đúng phần, D07 không đáp ứng khác thiếu căn cứ; D08 giữ giới hạn thẩm quyền. |
| F05 | Đạt trên bộ thử | Kết luận có dữ kiện, lý do, đoạn nguồn, vị trí, phiên bản/khoảng áp dụng giả định và bước tiếp theo; mở được trong trình duyệt. |

Các kết quả này không phải nghiệm thu chuyên môn HUST, không phải đánh giá trên 120–150 ca của toàn đề tài, không chứng minh giảm tải/tần suất/vượt trội. D10 gồm timeout/sai schema bằng mock tại máy và phản hồi lỗi bằng chặn request trong trình duyệt trên URL thật; **chưa thử lỗi của nhà cung cấp mô hình thật**, vì deployment chưa dùng mô hình.

## Vị trí bằng chứng và cách chạy lại

- `artifacts/demo-runs/local-2026-10-28/`: transcript bộ điều kiện, ảnh local, dấu mã, kiểm gói triển khai.
- `artifacts/demo-runs/production-2026-10-28/`: kết quả trình duyệt JSON, transcript API, ảnh URL thật, metadata deployment và biên bản.
- Kiểm trình duyệt: đặt `PLAYWRIGHT_BASE_URL=https://hust-t6-demo.vercel.app`, `HUST_TEST_ARTIFACT_DIR=artifacts/demo-runs/<lần-mới>`, rồi `npm run test:e2e`.
- Kiểm API: đặt `DEMO_BASE_URL=https://hust-t6-demo.vercel.app`, `HUST_TEST_ARTIFACT_DIR=artifacts/demo-runs/<lần-mới>`, rồi `node --import tsx scripts/verify-live.ts`.
- Mở dữ kiện/căn cứ; gõ tình huống, bổ sung ngày/địa điểm, thử đổi nguồn; nút ví dụ chỉ điền câu vào ô, không phát lại kịch bản sẵn.
- Triển khai lại đúng project đã liên kết: `vercel deploy --prod --scope linhozz` từ `demo-hust/`; rà soát gói và chạy lại ca trọng yếu khi đổi mã/nguồn.

## Giới hạn và bước tiếp theo

- Hoàn tất bản demo kỹ thuật mô phỏng và URL chia sẻ. Chưa phải demo tư vấn đúng chính sách hiện hành.
- Cần văn bản gốc được phép, hiệu lực, đoạn nguồn, chủ nội dung và đáp án duyệt trước khi thay fixture bằng dữ liệu nghiệp vụ. Không đưa tài liệu thầy gửi lên website.
- Bộ hiểu câu fixture có giới hạn, nhận ngày đầy đủ và một số diễn đạt tương đương. Cần cấu hình nhà cung cấp/key/model và kiểm thử thực tế để đánh giá hiểu ngôn ngữ rộng hơn. Việc bật mô hình không giải quyết thiếu căn cứ nghiệp vụ.
- Chỉ xây T6/CA-01 trong bản đầu tiên; chưa triển khai T1/T3/T4/T10. Phạm vi đề tài ba Ban vẫn được giữ.
- Chưa có đánh giá chuyên viên, đối chứng C0/C1/C2, đo công việc giảm hoặc số liệu tần suất.
- Không ghi key/token, nội dung nghiên cứu hoặc dữ liệu cá nhân vào tiến độ. `.env.local` do Vercel CLI tạo bị loại khỏi upload; không gửi tệp này lên Git.


## 13/11/2026 — hoàn thành phần trước khi nhận dữ liệu, dừng theo yêu cầu

Đã gộp cách hiển thị/sao chép narrative, chuẩn bị nhận nguồn và FAQ, kiểm gói nguồn/truy xuất từ khóa, thêm metadata kho và công cụ phát lại không gọi API. 168 unit, 3 Python đạt; Preview fixture v1 có 36 API và 16 browser đạt. Gemini 3.8 Flash thử trên Vercel trả 2 timeout; 2 lượt phụ thuộc và 8 hội thoại phát triển chưa chạy. Nguồn HUST/FAQ mới chưa nhận, chưa kích hoạt gói thật. Giữ URL chính fixture; không sửa báo cáo/Excel hoặc bằng chứng cũ. [Chi tiết, revision và điểm tiếp tục](TUAN_7_CHUAN_BI_NGUON_2026-11-13.md).
