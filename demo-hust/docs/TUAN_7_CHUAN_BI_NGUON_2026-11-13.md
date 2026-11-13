# Bản sửa trước khi nhận dữ liệu — 13/11/2026

Điểm dừng và kết quả: [tổng hợp](../../Artifact_De_tai_chinh/Tuan_7/KET_QUA_13_18_11.md). [Nhận tài liệu/FAQ](../../Artifact_De_tai_chinh/Tuan_7/README.md) và [CONTINUE](../../Artifact_De_tai_chinh/Tuan_7/CONTINUE.json).

## Chạy kiểm tra không gọi API

```sh
npm run typecheck
npm test
node --import tsx scripts/replay-evaluation.ts --input docs/evidence/week6/heldout-gemini.json --output artifacts/NEW-RUN/replay.json
node --import tsx scripts/knowledge-tools.ts validate ../Artifact_De_tai_chinh/Tuan_7/candidate-pack.json
```

Lệnh phát lại chặn `fetch`, dùng đầu vào đã lưu, không gọi adapter và không ghi đè tệp đích. Tách lỗi tái dựng dữ kiện với diễn đạt bị bộ kiểm từ chối. Lượt không có phản hồi/đầu vào đủ không thể đánh lại chất lượng. Các bộ đã xem sau đánh giá chỉ còn là hồi quy; không đổi câu/kỳ vọng để thay điểm.

Bằng chứng mới: `artifacts/week7-2026-11-13/`, không ghi đè thư mục tuần 6. `replay/heldout.json` là trước sửa false positive; các tệp `heldout-after-*` và `replay/final/` là revision sau, không cộng điểm. Kiểm thứ tự, SHA đầu vào/mã nguồn trước khi so sánh.

## Thay đổi mã

`answer-presentation.ts` gom cách lấy kết luận hiện hành và sao chép. `Guidance` chỉ có một narrative chính và mục mở rộng Điều kiện và căn cứ. Fixture giữ thẻ hướng dẫn cũ khi không có narrative. `knowledge-meta.ts` gắn nguồn mẫu và chặn mọi pack chưa kích hoạt; schema/history cũ vẫn đọc được. `knowledge-pack.ts`/`knowledge-tools.ts` là công cụ chuẩn bị gói và truy xuất từ khóa, chưa nối điều kiện thật vào engine.

Validator sửa trường hợp hỏi làm rõ quan hệ và tên Ban Tài chính–Kế hoạch; thêm chặn danh mục chứng từ cụ thể không được trích dẫn hỗ trợ. Các kiểm tra từ khóa không thay xác nhận ngữ nghĩa/chuyên viên. Chẩn đoán API tùy chọn chỉ có pha, loại lỗi và mã lý do; không có raw dữ liệu mô hình hoặc secret. Lỗi cũ không được tự điền thêm pha khi thiếu bằng chứng.

## Kiểm trên Preview bảo vệ

`scripts/with-vercel-session.mjs` chỉ chạy cho đúng project đã cho phép, lấy cookie bằng Vercel CLI và truyền trong bộ nhớ. Không lưu cookie/token vào tệp hoặc tham số CLI. `scripts/protected-fetch.mjs` chỉ gắn cookie cho đúng origin đang kiểm. Trace Playwright bị tắt khi dùng phiên bảo vệ để tránh lưu header/cookie. Không dùng profile Chrome cá nhân.

Ví dụ: đặt `PLAYWRIGHT_BASE_URL` hoặc `DEMO_BASE_URL`, `EVAL_DEPLOYMENT_ID`, `VERCEL_CLI_PATH`, `ALLOW_VERCEL_AUTOMATION=1`, thư mục bằng chứng mới; gọi wrapper với `node node_modules/@playwright/test/cli.js test ...` hoặc với `node --import ./scripts/protected-fetch.mjs --import tsx scripts/verify-live.ts`. Không in cookie ra màn hình.

## Model và điểm dừng

Bộ `tests/week7-development-cases.json` chốt 2 hội thoại khả thi (1 + 3 lượt) và 8 hội thoại phát triển: giấy tờ/có giấy mời; thay nguồn; kết hợp/rút phân định; ngày sai; tình huống mới; thiếu nguồn đơn vị; định mức; ngoài phạm vi/ép duyệt. Đây là ca tự biên soạn, chưa phải FAQ thực tế hoặc heldout. Manifest ghi SHA để không sửa kỳ vọng trong lúc chạy.

Vòng thử `gemini-smoke/` có 2 yêu cầu timeout, 2 lượt phụ thuộc không chạy. Dừng trước 8 hội thoại. Không gọi thêm theo yêu cầu mới nhất, không đổi model hay bật billing để tiếp tục. [Model](https://aistudio.google.com/docs/models/gemini-3.8-flash), [Free pricing](https://aistudio.google.com/docs/pricing#gemini-3.8-flash) được kiểm ngày 13/11; thông tin Free công khai không bảo đảm tài khoản luôn có quota hoặc phản hồi kịp deadline.

## Giới hạn kiểm chứng

168 unit và 3 Python kiểm mã/công cụ; 36 API và 16 browser kiểm Preview fixture v1. Các mock narrative chỉ kiểm UI. Bản sửa cuối về tên tổ chức/chẩn đoán sau Preview v1 được kiểm unit/typecheck/build/offline; chưa chạy lại model hoặc công khai. URL chính không đổi; muốn phát hành phiên bản mới phải kiểm đúng revision, không gọi ảnh mock là model thật.
