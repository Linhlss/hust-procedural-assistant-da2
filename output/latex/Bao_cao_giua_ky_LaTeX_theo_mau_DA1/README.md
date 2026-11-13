# Báo cáo giữa kỳ theo đúng source Đồ án 1

Bản này dùng trực tiếp cấu hình trong `Bao_cao_DA_1/DoAn.tex`, `Bia.tex`, `Bia_lot.tex` và định dạng đề mục con trong `Chuong/1_Gioi_thieu.tex` do người dùng cung cấp. Không còn dùng form dựng từ mẫu trên mạng. Trong bộ làm việc mới chỉ giữ PDF Đồ án 1 để đối chiếu; cấu hình cần biên dịch đã nằm đầy đủ trong thư mục báo cáo này. Source Đồ án 1 gốc vẫn ở bản khảo sát lưu lại. Cách căn tiêu đề mục và tiểu mục được cập nhật đồng bộ theo lựa chọn của người dùng: nhãn rộng 8 mm, cách chữ 3 mm, cùng căn từ lề trái.

## Nội dung và thông tin cần điền

PDF gồm bìa, bìa lót, mục lục, danh mục hình, danh mục bảng, danh mục thuật ngữ, Chương 1 và tài liệu tham khảo. Chương 1 gồm 7 mục chính, 25 đề mục con, 4 sơ đồ TikZ và 5 bảng. Phần ứng dụng và thực nghiệm vẫn dành cho Chương 2.

- Điền họ tên, email, MSSV, chuyên ngành, giảng viên và tháng báo cáo tại `config/thong_tin.tex`. Họ tên, email, MSSV và chuyên ngành đã điền theo báo cáo Đồ án 1; giảng viên hướng dẫn là TS. Tạ Anh Sơn.
- `LoaiBaoCao` hiện là **BÁO CÁO ĐỒ ÁN II**; có thể đổi thành nhãn học phần tương ứng.
- `TieuDeBia` trình bày tên đề tài đã chốt trên ba dòng. `TenDeTai` lưu cùng tên đầy đủ trong metadata: **Chatbot tư vấn theo tình huống về thủ tục khoa học–công nghệ, tài chính và nhân sự tại Đại học Bách khoa Hà Nội**. Khoảng trống trước khối giảng viên được giảm tương ứng chiều cao tên đề tài tăng thêm để giữ vị trí khối ký và ngày báo cáo.
- Sửa nội dung từ mục 1.2 trong `chapters/`; mục 1.1 là bản người dùng đã chốt. Các chú thích `% TRIỂN KHAI` không in ra PDF.
- Sửa sơ đồ trong `figures/`, thêm tài liệu ở `references.bib` và dùng `\cite{...}`.

## Bố cục hiện hành và mốc giữ nguyên

- 1.1: Bối cảnh và lý do lựa chọn đề tài — giữ nguyên bản người dùng đã hoàn thiện.
- 1.2: Phát biểu bài toán, mục tiêu và phạm vi.
- 1.3: Phân tích yêu cầu hệ thống.
- 1.4: Kiến trúc tổng thể và tổ chức tri thức.
- 1.5: Cơ chế tư vấn theo tình huống.
- 1.6: Định hướng kiểm thử và đánh giá.
- 1.7: Kết luận chương.

`chapters/01_boi_canh.tex` và `figures/boi_canh.tex` là mốc đã chốt: không sửa khi biên tập các mục còn lại. Phần nguyên lý công nghệ nằm tại thành phần hoặc cơ chế sử dụng nó. Bảng yêu cầu F01–F05 đặt tập trung ở 1.3. Cấu hình chạy và kết quả thực nghiệm dành cho Chương 2.

## Biên dịch và bản PDF chính

Đây là thư mục làm việc chính cho báo cáo. **`main.pdf` ngay cạnh `main.tex` là bản PDF chính**, được biên dịch từ toàn bộ source tại đây.

Trên Mac, nhấp đúp **`Bien_dich.command`**. Tệp này tự chạy pdfLaTeX, Biber và các lượt LaTeX cần thiết rồi mở `main.pdf`.

Nếu dùng Terminal, mở tại thư mục này và chạy:

```sh
latexmk -pdf main.tex
```

Dùng pdfLaTeX và Biber như Đồ án 1. Cần MacTeX/TeX Live có VnTeX, latexmk và Biber. Trong trình soạn thảo, chọn chuỗi biên dịch **latexmk / pdfLaTeX + Biber**. Nút chỉ chạy pdfLaTeX một lượt chưa tạo đủ mục lục, danh mục, trích dẫn và tài liệu tham khảo.

`.latexmkrc` ghi kết quả vào chính thư mục hiện tại, không chuyển sang `build/`. Đường dẫn `output/pdf/Bao_cao_giua_ky_Chuong_1_theo_mau_DA1.pdf` trong workspace là liên kết đến `main.pdf` này, nên mỗi lần biên dịch sẽ tự cập nhật bản được mở từ chat. Liên kết chỉ phục vụ workspace; source vẫn biên dịch độc lập khi chuyển sang máy khác.

Nếu biên dịch thủ công, cần đủ chuỗi:

```sh
pdflatex -interaction=nonstopmode -halt-on-error main.tex
biber main
pdflatex -interaction=nonstopmode -halt-on-error main.tex
pdflatex -interaction=nonstopmode -halt-on-error main.tex
```

Trên Overleaf: tải toàn bộ source, chọn `main.tex` làm Main document và compiler **pdfLaTeX**. Không cần font hệ thống, shell escape hoặc thư mục mẫu gốc.

## Cấu hình hiện hành và các thành phần kế thừa từ mẫu

| Thành phần | Cấu hình hiện hành |
|---|---|
| Khổ và lề | A4; trên 20 mm, dưới 30 mm, trái 35 mm, phải 25 mm |
| Chữ thân bài | VnTeX mặc định, 13 pt qua `scrextend`; không nạp `times` hoặc `fontspec` |
| Đoạn văn | `onehalfspacing`, cách đoạn 6 pt, thụt đầu dòng 15 pt |
| Tên chương | Giữa trang, đậm 18/22 pt, tiền tố CHƯƠNG; khoảng trước −20 pt, sau 20 pt |
| Mục chính | Đậm 16/20 pt; cột nhãn 8 mm và khoảng cách 3 mm; cách trước/sau 12/6 pt |
| Đề mục con Chương 1 | Đậm 14/18 pt; a), b)…; cùng cột nhãn 8 mm và khoảng cách 3 mm; cách trước/sau 9/4 pt |
| Header và footer | Header tên chương ở trái có đường kẻ; số trang ở giữa chân trang; trang mở chương dùng plain |
| Bìa và bìa lót | Khối chữ, cỡ chữ và các khoảng cách lấy từ hai tệp bìa gốc; bìa lót có chỗ ký GVHD; chú thích được căn giữa dưới dòng ký bằng một cột riêng |
| Mục lục | Tiền tố CHƯƠNG; khoảng 0,3 cm giữa mục; đề mục con lùi 1 cm; dấu dẫn chấm |
| Danh mục | Hình và bảng tách trang riêng; thuật ngữ dùng `superraggedheaderborder` |
| Hình và bảng | Đánh số theo chương; caption đậm nhãn và dấu hai chấm; bảng có khung, caption dưới bảng |
| Tham khảo | `biblatex`, backend Biber, style IEEE; chỉ xuất tài liệu đã trích |

Tên đề tài, tên chương, số lượng nội dung và giảng viên hướng dẫn và thời gian được cập nhật theo báo cáo mới. Không sao chép nội dung lập kế hoạch sản xuất, các chương thực nghiệm cũ, nhận xét GVHD hoặc lời cảm ơn cũ vào đề tài chatbot.

Cách căn tiêu đề dùng chung nằm trong `config/preamble.tex`; `config/chuong_mot_style.tex` chỉ đặt ký hiệu a), b)… cho Chương 1. Không còn định dạng riêng trong mục 1.2. Các nhãn nhóm không đánh số dùng `\NhomTuVan{...}` để giữ cùng cách căn trái và khoảng cách.

Các bảng và sơ đồ vẫn là mã LaTeX/TikZ có thể chỉnh sửa. Căn cứ nghiệp vụ HUST chưa xác minh không được đưa thành quy tắc chính thức.

## Khi bổ sung Chương 2

Tạo tệp nội dung riêng và thêm vào `main.tex` trước phần tài liệu tham khảo. Trước các subsection của Chương 2, khôi phục kiểu số `\thechapter.\arabic{section}.\arabic{subsection}`; kiểu chữ a), b)… chỉ dành cho Chương 1 theo mẫu gốc. Với nhãn số dài hơn, điều chỉnh độ rộng cột nhãn chung cho đủ chiều dài trước khi biên dịch.

## Kiểm tra bản bàn giao

`verification.json` ghi compiler, số trang, dấu kiểm source/PDF, thông số so sánh với PDF Đồ án 1, kiểm tra tràn lề và rà từng trang. Việc sửa nội dung sau đó cần biên dịch và kiểm tra lại PDF.

Mẫu gốc dùng các cỡ Computer Modern không có font riêng ở một số kích thước toán và small caps; TeX dùng dạng thay thế như trong cấu hình gốc. Giữ các thông số dàn trang của mẫu; không đổi phông thân bài để che cảnh báo. Không còn lỗi biên dịch, tham chiếu chưa xác định hoặc đoạn tràn lề trong bản đã kiểm.

## Sửa căn lề chữ ký

Khối ký ở `frontmatter/bia_lot.tex` dùng cột rộng 3 cm cho cả dòng kẻ và chú thích, thay cho khoảng cách cố định của mẫu. Chú thích vẫn căn giữa khi thay tên giảng viên. Phông và cỡ chữ được đối chiếu trực tiếp với PDF Đồ án 1.
