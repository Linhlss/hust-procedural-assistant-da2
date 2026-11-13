# HUST Procedural Assistant — Đồ án 2

Chatbot tư vấn theo tình huống về thủ tục khoa học–công nghệ, tài chính và nhân sự tại Đại học Bách khoa Hà Nội.

## Trạng thái

Phạm vi đề tài: đăng ký nhiệm vụ (T1), điều chỉnh/gia hạn (T3), nghiệm thu (T4), hội thảo/công tác (T6), cử đi đào tạo/nghiên cứu (T10). Nguyên mẫu hiện triển khai T6 với nguồn mẫu tự tạo; chưa xác nhận độ đúng nghiệp vụ HUST.

Đã có hỏi bổ sung, đối chiếu điều kiện, cập nhật dữ kiện, tìm lịch sử, sửa/rút dữ kiện, dẫn nguồn và giao diện sáng/tối. Mô hình trích dữ kiện/diễn đạt; máy chủ quản lý nguồn và kết luận. Khi có narrative hợp lệ, kết luận engine nằm trong mục mở rộng “Điều kiện và căn cứ”.

Bản công khai trên [Vercel](https://hust-t6-demo.vercel.app) hiện dùng fixture. Gemini từng được thử trên Preview; **chưa đạt kiểm chứng để phát hành công khai**. Vòng 13/11 có hai timeout với Gemini 3.8 Flash; không chuyển chúng thành ca đạt. Tài liệu và FAQ mới đang chờ, gói nguồn thật chưa kích hoạt.

## Chạy ứng dụng

Cần Node.js 22.x và npm. Tại thư mục gốc:

```sh
cd demo-hust
npm ci
npm run dev
```

Mở http://127.0.0.1:3000. Mặc định `fixture`, không cần key hoặc API trả phí. Để chạy bản tối ưu: `npm run build`, rồi `npm start`. Muốn thử provider khác, tự tạo `.env.local` từ `.env.example` và điền cấu hình máy chủ. Không commit key, bật billing hoặc coi ChatGPT Plus là API credits.

```sh
npm run typecheck
npm test
npm run build
```

Các kiểm thử mã dùng mock khi cần, không gọi model thật. Playwright cần Chrome và một ứng dụng đang chạy; `PLAYWRIGHT_BASE_URL` chọn đúng URL. Không chạy lại các bộ hội thoại model chỉ để thay điểm lịch sử.

## Các phần của project

| Nội dung | Điểm bắt đầu |
|---|---|
| Ứng dụng và kiểm thử | [demo-hust](demo-hust/README.md) |
| Phạm vi và đặc tả | [Requirement](Artifact_De_tai_chinh/00_REQUIREMENTS_CHATBOT_THU_TUC_HUST.md) |
| Tiến độ hiện tại | [Nhật ký demo](demo-hust/docs/TIEN_DO_DEMO.md) |
| Phần chuẩn bị trước tài liệu mới | [Tổng hợp 13–18/11](Artifact_De_tai_chinh/Tuan_7/KET_QUA_13_18_11.md) |
| Nhận tài liệu/FAQ | [Hướng dẫn](Artifact_De_tai_chinh/Tuan_7/README.md) |
| Source báo cáo hoàn chỉnh | [main.tex](output/latex/Bao_cao_giua_ky_LaTeX_theo_mau_DA1/main.tex) |
| Source báo cáo tuần 4 | [main.tex](Artifact_De_tai_chinh/Bao_cao_tien_do_02_LaTeX/main.tex) |
| Source báo cáo tuần 5 | [main.tex](Artifact_De_tai_chinh/Bao_cao_tuan_5_LaTeX/main.tex) |
| Source báo cáo tuần 6 | [main.tex](Artifact_De_tai_chinh/Bao_cao_tuan_6_LaTeX/main.tex) |
| Danh mục tài liệu cần bổ sung | [Tài liệu](Artifact_De_tai_chinh/De_nghi_du_lieu_2026-11-13/Danh_muc_tai_lieu_can_bo_sung.md) · [FAQ](Artifact_De_tai_chinh/De_nghi_du_lieu_2026-11-13/De_nghi_cung_cap_FAQ_va_vuong_mac_thuc_te.md) |
| Kiểm chứng bản công khai | [PUBLIC_VERIFICATION.json](PUBLIC_VERIFICATION.json) |

## Biên dịch báo cáo

Source công khai dùng thông tin sinh viên mẫu; bản gốc riêng tại máy không thay đổi. Cài MacTeX/TeX Live có latexmk; chạy `Bien_dich.command` trong đúng thư mục báo cáo. Báo cáo hoàn chỉnh dùng pdfLaTeX/Biber; tuần 5–6 dùng XeLaTeX. PDF sinh ra không được Git theo dõi. Những báo cáo đề xuất/tuần 4 chỉ có `main.tex` thì dùng `latexmk -xelatex main.tex` theo khai báo TEX trong source. Không coi báo cáo đề xuất cũ là phạm vi sản phẩm hiện hành.

## Dữ liệu và bằng chứng

Chỉ nguồn mẫu được đóng gói trong ứng dụng. Danh mục, metadata và ca thử không chứng minh văn bản có hiệu lực hoặc được phép công bố. Bản gốc, OCR, tài liệu thầy chưa rõ quyền sử dụng, dữ liệu nhận riêng tư, PDF/Excel có định danh và artifact nặng được giữ ngoài repo. Các công cụ kiểm toàn vẹn kho nguồn cần các bản gốc riêng; việc chúng không có trong repo công khai không được ghi thành “đủ dữ liệu”.

Bằng chứng lịch sử đã chọn nằm trong `demo-hust/docs/evidence/week6`; bản tổng hợp 13/11 nằm trong `demo-hust/docs/evidence/week7`. Giữ nguyên lỗi và phân biệt kiểm kỹ thuật với xác nhận nghiệp vụ. Một số đường dẫn artifact lịch sử chỉ tồn tại tại máy và được ghi rõ, không phải liên kết tải công khai.

## Cập nhật bản công khai

Đây là snapshot có lịch sử Git mới, không mang lịch sử repo cũ hoặc cấu hình Vercel. Workspace riêng vẫn là nguồn làm việc chính. Xem [hướng dẫn đồng bộ](PUBLIC_EXPORT.md) và công cụ `tools/export_public.py`. Việc đẩy GitHub không tự triển khai website.
