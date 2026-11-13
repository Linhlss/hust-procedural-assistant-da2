#!/usr/bin/env python3
"""Build the two teacher-facing HUST data-request PDFs; never modify source registers."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether,
    CondPageBreak, PageBreak,
)

TOPIC = ('Chatbot tư vấn theo tình huống về thủ tục khoa học-công nghệ, tài chính '
         'và nhân sự tại Đại học Bách khoa Hà Nội')
DATE = '13/11/2026'
DOCUMENTS_FILE = 'Danh_muc_tai_lieu_can_bo_sung.pdf'
FAQ_FILE = 'De_nghi_cung_cap_FAQ_va_vuong_mac_thuc_te.pdf'

# Edit the Vietnamese content below and rerun this file to regenerate both PDFs.
REQUESTS = [
    dict(id='D01', section='3', title='Quy định nhiệm vụ KHCN và đổi mới sáng tạo cấp Đại học',
         scope='T1, T3, T4, T6; liên quan T10 khi cán bộ đang chủ trì nhiệm vụ.',
         owner='Ban Khoa học-Công nghệ (KHCN).', priority='Ưu tiên nhận trước.',
         have='Đã có tài liệu phân tích định hướng do giảng viên hướng dẫn cung cấp và văn bản Nhà nước liên quan; chưa có toàn bộ bản ký của quy định HUST.',
         need=[
             'Quyết định ban hành, toàn văn quy định, danh mục và toàn bộ phụ lục; bản sửa đổi, bổ sung hoặc thay thế nếu có.',
             'Bộ biểu mẫu cấp Đại học: đăng ký/đề xuất, thuyết minh, xét chọn; điều chỉnh/gia hạn; báo cáo, đánh giá và nghiệm thu. Xin file Word/Excel trống nếu có.',
             'Phần quy định về đối tượng, loại nhiệm vụ, kinh phí; phụ lục về mức độ sẵn sàng công nghệ (TRL), hạng mục kinh phí, hệ số tài trợ khi thực sự áp dụng.',
         ],
         reference='Tài liệu phân tích gọi bộ này là “4411/2026”, mô tả 25 điều, 4 phụ lục và 12 biểu mẫu. Đây là chỉ dẫn cần xác nhận, chưa phải số hiệu hoặc số lượng đã kiểm trên bản ký. Xin cung cấp đủ theo danh mục chính thức, kể cả khi khác các số trên.'),
    dict(id='D02', section='3', title='Quy chế Chi tiêu nội bộ',
         scope='T6; các nhánh tài chính thuộc T1, T3, T4, T10 khi liên quan.',
         owner='Ban Tài chính-Kế hoạch (TCKH).', priority='Ưu tiên nhận trước.',
         have='Đã có một số văn bản công khai dẫn chiếu quy chế và nguồn tài chính Nhà nước; chưa có toàn bộ quy chế nội bộ cùng phụ lục.',
         need=[
             'Quyết định ban hành, toàn văn quy chế, tất cả phụ lục; các văn bản sửa đổi/bổ sung và bản thay thế đang áp dụng.',
             'Phần liên quan đến hội thảo/công tác trong và ngoài nước, kinh phí nhiệm vụ, nguồn đơn vị, đào tạo/nghiên cứu; phạm vi đối tượng, điều kiện, định mức và chứng từ tương ứng.',
             'Thông tin ngày hiệu lực, văn bản bị thay thế và cách áp dụng với hoạt động hoặc chứng từ có trước thời điểm thay đổi.',
         ],
         reference='Đầu mối tra cứu hiện có: QĐ 1616/QĐ-ĐHBK ngày 10/02/2026; tài liệu phân tích nêu 6 phụ lục. Số hiệu/ngày đã có dẫn chiếu gián tiếp, nhưng nội dung, số phụ lục và mốc áp dụng vẫn cần kiểm bản gốc.'),
    dict(id='D03', section='3', title='Quy chế Công tác cán bộ',
         scope='T10; giao T3 khi việc cử đi ảnh hưởng nhiệm vụ đang chủ trì.',
         owner='Ban Tổ chức-Nhân sự (TCNS).', priority='Ưu tiên nhận trước.',
         have='Đã có tài liệu phân tích và dẫn chiếu gián tiếp; chưa có toàn bộ bộ quy chế gốc, phụ lục và mẫu hiện hành.',
         need=[
             'Quyết định ban hành, toàn văn quy chế, toàn bộ phụ lục và biểu mẫu; bản sửa đổi hoặc thay thế đang áp dụng.',
             'Phần điều kiện và thủ tục cử cán bộ đi đào tạo, nghiên cứu, công tác; ngắn hạn/dài hạn, trong nước/nước ngoài; cam kết, nghĩa vụ, gia hạn, trở về và báo cáo.',
             'Điều khoản áp dụng với quyết định cử đi trước đó còn nghĩa vụ; phần có liên hệ với nhiệm vụ nghiên cứu và hỗ trợ tài chính.',
         ],
         reference='Đầu mối tra cứu hiện có: QĐ 1606/QĐ-ĐHBK ngày 09/02/2026; tài liệu phân tích nêu 3 phụ lục. Xin xác nhận bản đang áp dụng và đủ thành phần theo bản ký.'),
    dict(id='D04', section='4', title='T1 - Đăng ký nhiệm vụ khoa học và công nghệ',
         scope='Trọng tâm là nhiệm vụ cấp Đại học; từng loại/chương trình cần đúng bộ nguồn của loại đó.',
         owner='Ban KHCN.', priority='Cần trước khi hoàn thiện nội dung T1.',
         have='Đã tải một số thông báo, mẫu cấp Bộ, Edge AI và NAFOSTED; chưa có bộ đầy đủ đúng cấp Đại học.',
         need=[
             'Thông báo mở đợt, kế hoạch và hướng dẫn đăng ký năm 2026; bổ sung đợt nhiệm vụ thực hiện từ năm 2027 nếu đã được công bố. Ghi riêng năm đăng ký và năm bắt đầu nhiệm vụ.',
             'Đối tượng, loại nhiệm vụ, điều kiện đăng ký/chủ trì; thành phần tài liệu, tên và phiên bản biểu mẫu, mốc mở/đóng đợt và đầu mối giải đáp.',
             'Các mẫu xác nhận hoặc đề xuất kèm đăng ký, nếu đang áp dụng và chưa có trong bộ gốc; chỉ rõ mẫu nào dùng cho từng đối tượng hoặc loại nhiệm vụ.',
             'Hướng dẫn thao tác đăng ký/nộp của đơn vị, đường dẫn hệ thống và các bước cần chuẩn bị trước khi nộp nếu đã có hướng dẫn chính thức.',
             'Phần hướng dẫn hệ số tài trợ hoặc định mức thù lao người học chỉ khi ảnh hưởng việc đăng ký và đã có căn cứ; không xin công cụ tính kNC.',
         ]),
    dict(id='D05', section='4', title='T3 - Điều chỉnh, gia hạn và thay đổi nhiệm vụ',
         scope='Nội dung, tiến độ, chủ nhiệm, kinh phí; trường hợp chủ nhiệm đi đào tạo/nghiên cứu.',
         owner='Ban KHCN; phối hợp TCKH hoặc TCNS theo nội dung.', priority='Cần trước khi hoàn thiện nội dung T3.',
         have='Đã có đặc tả thẻ và văn bản nền; chưa có bộ hướng dẫn HUST và mẫu đủ để xác nhận điều kiện, hạn hoặc ngoại lệ.',
         need=[
             'Hướng dẫn và biểu mẫu đề nghị thay đổi nội dung, sản phẩm, tiến độ, gia hạn, chủ nhiệm hoặc kinh phí; tên mẫu và thành phần tài liệu kèm theo.',
             'Mẫu hoặc tài liệu giải trình đi kèm đề nghị điều chỉnh, nhất là thay đổi nội dung hoặc kinh phí, nếu đang áp dụng và chưa có trong bộ gốc.',
             'Điều kiện được đề nghị, mốc tính thời hạn, thời điểm phải gửi, giới hạn và trường hợp ngoại lệ nếu có; đầu mối và thẩm quyền được văn bản quy định.',
             'Cách đối chiếu khi đổi cơ cấu/nguồn kinh phí; phạm vi khoán, hệ số tài trợ hoặc thù lao người học nếu nhánh đang hỏi thực sự cần.',
             'Hướng dẫn khi chủ nhiệm đi học/nghiên cứu hoặc vắng mặt: tiếp tục thực hiện, điều chỉnh, bàn giao hay thay chủ nhiệm theo trường hợp; chỉ xin phần hướng dẫn và mẫu trống.',
         ],
         reference='Các chỉ dẫn về điều 14/16 và mẫu 6 trong tài liệu phân tích cần được đối chiếu bản nhiệm vụ gốc; chưa coi đó là tên mẫu hoặc điều kiện đã xác minh.'),
    dict(id='D06', section='4', title='T4 - Đánh giá và nghiệm thu nhiệm vụ',
         scope='Chuẩn bị nghiệm thu, sản phẩm, báo cáo, các mốc và thành phần tài liệu.',
         owner='Ban KHCN.', priority='Cần trước khi hoàn thiện nội dung T4.',
         have='Đã có tài liệu thiết kế và văn bản nền; các mốc nghiệm thu và bộ mẫu HUST chưa được xác nhận đầy đủ.',
         need=[
             'Hướng dẫn đề nghị nghiệm thu; điều kiện về sản phẩm, báo cáo, minh chứng và thành phần tài liệu cần chuẩn bị.',
             'Hướng dẫn xác định và chuẩn bị minh chứng cho từng loại sản phẩm; cách ghi địa chỉ đơn vị, lời cảm ơn tài trợ hoặc mã nhiệm vụ nếu nguồn chính thức yêu cầu. Xin phần đang áp dụng và chưa có đầy đủ trong bộ gốc.',
             'Đủ mẫu báo cáo, phiếu đánh giá, biên bản và tài liệu liên quan theo danh mục ban hành; xin mẫu trống, không xin hồ sơ cá nhân hoặc phiếu đánh giá có thông tin riêng.',
             'Căn cứ xác định các mốc đề nghị, báo cáo, tổ chức nghiệm thu và hoàn thiện sau nghiệm thu; điểm bắt đầu tính hạn, ngoại lệ, ca chậm/tồn nếu được hướng dẫn.',
             'Văn bản hoặc giải thích nghiệp vụ được xác nhận cho những mốc chưa thống nhất giữa tài liệu; ghi rõ vị trí điều/mục thay vì tự chọn một mốc.',
         ],
         reference='Tài liệu phân tích dẫn điều 15, 19-22 và mẫu 7-12. Các chỉ dẫn này dùng để tìm đúng phần cần xin, chưa xác nhận bộ mẫu thực tế.'),
    dict(id='D07', section='4', title='T6 - Hội thảo/công tác: hướng dẫn, định mức và chứng từ',
         scope='Dự hội thảo hoặc đi công tác trong/nước ngoài; phân biệt với tổ chức hội thảo khi điều kiện khác nhau.',
         owner='Ban TCKH; phối hợp KHCN và TCNS khi nội dung cần đối chiếu.', priority='Ưu tiên cho nguyên mẫu đang triển khai.',
         have='Đã có nguồn Nhà nước về kinh phí nhiệm vụ, công tác phí/hội nghị, công tác nước ngoài; có tin giới thiệu quy trình số. Chưa có bộ hướng dẫn nội bộ HUST đầy đủ.',
         need=[
             'Hướng dẫn áp dụng cho hội thảo/công tác trong và ngoài nước: đối tượng, điều kiện, nguồn chi, nội dung và định mức; các trường hợp cần xác nhận riêng.',
             'Danh mục giấy tờ trước hoạt động, chứng từ phải giữ trong/sau hoạt động; tên biểu mẫu, nội dung cần điền, đường dẫn lấy mẫu và đầu mối hướng dẫn.',
             'Các mẫu đang dùng cho đề nghị/quyết định cử đi, kế hoạch và dự toán tham dự hội thảo/công tác, nếu áp dụng cho trường hợp này và chưa có đầy đủ trong bộ gốc; xin mẫu trống hoặc phần được phép chia sẻ.',
             'Hướng dẫn tạm ứng, hoàn ứng/quyết toán: mốc thời hạn và cách tính, thành phần chứng từ, trường hợp bổ sung hoặc chứng từ tồn đọng; chỉ phần dùng để tư vấn chuẩn bị.',
             'Căn cứ làm rõ đoàn ra, nội dung thuộc/không thuộc khoán và quan hệ giữa quy định nhiệm vụ với quy chế chi tiêu khi ảnh hưởng hướng dẫn.',
         ],
         reference='Tin tập huấn tháng 10/2026 đề cập bộ 18 phụ lục thanh toán. Xin danh mục chính thức và các phụ lục liên quan phạm vi trên; chưa coi số 18 là số file cần xin hoặc yêu cầu gửi toàn bộ phần không liên quan.'),
    dict(id='D08', section='4', title='T6 - Quy định áp dụng cho kinh phí của đơn vị',
         scope='Một đơn vị cụ thể được chọn để kiểm chứng nhánh nguồn đơn vị; hỗ trợ T10 nếu liên quan.',
         owner='Đơn vị áp dụng, phối hợp Ban TCKH.', priority='Cần trước khi xác nhận hỗ trợ nhánh nguồn đơn vị.',
         have='Chưa có quy định riêng và chưa chốt đơn vị kiểm chứng; chưa có xác nhận dùng hoàn toàn quy định chung.',
         need=[
             'Nhờ giới thiệu/chọn một đơn vị phù hợp. Với đơn vị đó, xin quy chế hoặc phụ lục chi tiêu, quyết định/văn bản thông qua và mọi sửa đổi đang áp dụng.',
             'Phần đối tượng, điều kiện, mức hỗ trợ, giấy tờ và đầu mối cho hội thảo/công tác; ghi rõ ngày bắt đầu áp dụng và nguồn kinh phí.',
             'Nếu dùng hoàn toàn quy định chung, xin xác nhận và căn cứ quy định chung được áp dụng. Nếu chỉ một phần dùng chung, chỉ rõ phần chung và phần riêng.',
         ]),
    dict(id='D09', section='4', title='T6 - Phối hợp hoặc thay đổi nguồn kinh phí',
         scope='Nguồn nhiệm vụ, nguồn đơn vị, nguồn tài trợ khi thực sự liên quan; một nguồn thay thế hoặc nhiều nguồn cùng hỗ trợ.',
         owner='Ban TCKH, KHCN và đơn vị có nguồn hỗ trợ.', priority='Ưu tiên để xác nhận nhánh T6 đang có trong nguyên mẫu.',
         have='Đã có thiết kế xử lý thay/kết hợp nguồn; chưa có căn cứ nghiệp vụ được xác nhận cho việc phân định và hỗ trợ trùng.',
         need=[
             'Quy định/hướng dẫn phân định nội dung do từng nguồn chi trả, điều kiện phối hợp và tránh đề nghị hỗ trợ trùng nếu có quy định.',
             'Thành phần tài liệu hoặc nội dung cần trình bày khi nguồn đơn vị thay thế nguồn nhiệm vụ, hoặc hỗ trợ bổ sung; đầu mối xác nhận từng phần.',
             'Văn bản áp dụng khi nguồn tài trợ/hợp đồng có điều kiện riêng. Nếu hướng dẫn đã nằm trong quy định chung, chỉ cần chỉ rõ điều/mục và bản áp dụng.',
         ]),
    dict(id='D10', section='4', title='T10 - Cử cán bộ đi đào tạo, nghiên cứu và nghĩa vụ liên quan',
         scope='Cán bộ/giảng viên; loại hoạt động, ngắn/dài hạn, trong/nước ngoài và chương trình có điều kiện riêng.',
         owner='Ban TCNS; phối hợp KHCN hoặc TCKH khi có nhiệm vụ/hỗ trợ liên quan.', priority='Ưu tiên đầu mối TCNS; cần trước khi hoàn thiện T10.',
         have='Đã có một số thông tin chương trình trao đổi và nguồn tài chính đào tạo/bồi dưỡng; chưa có bộ điều kiện TCNS, hướng dẫn và mẫu hiện hành đầy đủ.',
         need=[
             'Hướng dẫn điều kiện cử đi, phân loại hoạt động, thời gian và thành phần tài liệu; mẫu đơn/đề nghị, quyết định cử đi và tài liệu kèm theo thực tế đang dùng, nếu chưa có đầy đủ trong bộ gốc.',
             'Kế hoạch hoặc thông báo đào tạo/cử đi theo chương trình, năm hoặc đợt, nếu việc có trong kế hoạch hoặc thuộc đúng chương trình quyết định điều kiện cử đi. Xin phần đang áp dụng, chưa có trong bộ gốc và được phép chia sẻ; không cần danh sách hay hồ sơ cá nhân.',
             'Mẫu cam kết, nghĩa vụ trong/sau thời gian đi, gia hạn, trở về, báo cáo và hướng dẫn khi chưa hoàn thành nghĩa vụ; căn cứ cho các thời hạn liên quan.',
             'Phần xử lý liên hệ với nhiệm vụ đang chủ trì/tham gia; bàn giao, điều chỉnh hoặc phối hợp với Ban KHCN theo trường hợp.',
             'Phần hỗ trợ tài chính gắn với đối tượng, chương trình và nguồn; đầu mối cần xác nhận. Chỉ ghi khóa/đợt tuyển sinh nếu quy định chương trình thực sự phân biệt điều kiện theo khóa/đợt đó.',
         ]),
    dict(id='D11', section='5', title='Quy chế Quản lý tài chính và nguyên tắc áp dụng nguồn',
         scope='Nhánh tài chính của năm nhóm thủ tục khi câu trả lời phụ thuộc nguồn, phân cấp hoặc thẩm quyền.',
         owner='Ban TCKH.', priority='Thu sớm để đối chiếu các nguồn.',
         have='Đã có văn bản công khai dẫn chiếu; chưa có toàn văn và các cập nhật đủ để xác định nội dung áp dụng.',
         need=[
             'Toàn văn quy chế, quyết định/nghị quyết ban hành, sửa đổi, bản hợp nhất hoặc thay thế nếu có.',
             'Phần liên quan nguồn kinh phí, phân cấp, trách nhiệm và quan hệ với quy chế chi tiêu nội bộ hoặc quy định đơn vị; chỉ rõ các phần cần đối chiếu.',
         ], reference='Đầu mối tra cứu: NQ 04/NQ-ĐHBK ngày 02/02/2024. Xin xác nhận phiên bản đang áp dụng, không mặc định bản 2024 còn nguyên hiệu lực.'),
    dict(id='D12', section='5', title='Tổ chức, hoạt động và phân cấp thẩm quyền',
         scope='Các phần ảnh hưởng đầu mối hoặc thẩm quyền trong T1/T3/T4/T6/T10.',
         owner='Văn phòng hoặc đầu mối quản trị văn bản; phối hợp các Ban.', priority='Bổ sung phần có liên quan trực tiếp.',
         have='Đã có dẫn chiếu và tài liệu giới thiệu; chưa có đủ bản quy chế, sửa đổi hoặc bản thay thế được xác nhận.',
         need=[
             'Quy chế Tổ chức và hoạt động cùng nghị quyết ban hành; sửa đổi/bản hợp nhất/bản thay thế đang áp dụng.',
             'Phần phân cấp, thẩm quyền và quan hệ phối hợp trực tiếp liên quan nội dung chatbot. Có thể cung cấp trích phần được phép cùng thông tin nhận diện bản gốc.',
         ], reference='Đầu mối tra cứu: NQ 40/NQ-ĐHBK ngày 02/12/2024; tài liệu phân tích còn dẫn NQ 11 và NQ 32/2025. Quan hệ sửa đổi phải kiểm trên văn bản.'),
    dict(id='D13', section='5', title='Chức năng, nhiệm vụ và đầu mối của các đơn vị',
         scope='Xác định đúng đơn vị cần trao đổi theo từng nội dung, không suy ra tuyến duyệt hồ sơ.',
         owner='Văn phòng/đầu mối văn bản; KHCN, TCKH, TCNS và đơn vị liên quan.', priority='Cần cho các đầu mối được nêu trong hướng dẫn.',
         have='Đã tải trang giới thiệu các Ban; thông tin này chưa thay văn bản phân công và cập nhật hiện hành.',
         need=[
             'Quy định chức năng, nhiệm vụ và cập nhật liên quan; danh mục đầu mối công việc hoặc kênh liên hệ công vụ đang dùng.',
             'Chỉ rõ nội dung do TCNS, KHCN, TCKH hay đơn vị tiếp nhận giải đáp; không cần thông tin liên hệ cá nhân không được phép chia sẻ.',
         ], reference='Đầu mối tra cứu: QĐ 9768/QĐ-ĐHBK ngày 23/10/2023 và các cập nhật; xin xác nhận bản hiện hành.'),
    dict(id='D14', section='5', title='Phiên bản cũ và hướng dẫn chuyển tiếp',
         scope='Nhiệm vụ từ đợt trước còn thực hiện/chưa nghiệm thu; quyết định cử đi còn nghĩa vụ; hoạt động hoặc chứng từ còn tồn.',
         owner='Ban chủ nội dung; KHCN/TCKH/TCNS và đầu mối văn bản.', priority='Thu theo phụ thuộc thực tế; không yêu cầu toàn bộ lịch sử.',
         have='Đã có một số văn bản Nhà nước và đầu mối số hiệu; chưa xác nhận đầy đủ bản HUST cũ và quan hệ thay thế.',
         need=[
             'Bản bị thay thế trực tiếp, phụ lục/mẫu cũ và điều khoản chuyển tiếp liên quan khi bản hiện hành dẫn tới hoặc công việc còn tồn cần áp dụng.',
             'Điều/mục xác định mốc quyết định áp dụng: ngày phê duyệt nhiệm vụ, quyết định cử đi, ngày hoạt động, ngày hoàn thành/nộp chứng từ tùy quy định.',
             'Văn bản sửa đổi từng phần, đính chính hoặc hướng dẫn xử lý khoảng chuyển tiếp nếu có; ghi rõ phần được sửa và phần tiếp tục áp dụng.',
         ], reference='Các đầu mối 5299/2023, 4788/2025, 1471/2025 mới được ghi nhận để kiểm tra. Không coi quan hệ thay thế hoặc khoảng hiệu lực là đã xác nhận; giấy tờ chờ lâu không tự quyết định dùng bản cũ.'),
    dict(id='D15', section='5', title='Văn bản dẫn chiếu và giải thích nghiệp vụ còn thiếu',
         scope='Các dẫn chiếu quyết định điều kiện, đối tượng, định mức, biểu mẫu, thời hạn hoặc cách áp dụng trong năm nhóm.',
         owner='Ban chủ nội dung hoặc cơ quan/đơn vị ban hành.', priority='Bổ sung khi đối chiếu bản gốc phát hiện thiếu.',
         have='Đã có một phần nguồn Nhà nước phụ thuộc; chưa thể lần hết dẫn chiếu khi chưa nhận đủ các bộ gốc.',
         need=[
             'Văn bản được quy chế/hướng dẫn dẫn tới nhưng kho hiện chưa có, chưa đủ phụ lục hoặc chưa đúng phiên bản; chỉ phần thực sự ảnh hưởng hướng dẫn.',
             'Văn bản giải thích/đính chính hoặc ý kiến chuyên môn được xác nhận cho điểm chưa rõ: mốc nghiệm thu, đoàn ra/khoán, nguồn kết hợp và chuyển tiếp.',
             'Nếu giải thích là trao đổi chuyên viên, ghi riêng với quy định chính thức; chỉ rõ căn cứ, đơn vị có thể xác nhận và phần còn cần kiểm tra.',
         ]),
]

SCOPE_ROWS = [
    ['T1', 'Đăng ký nhiệm vụ khoa học và công nghệ.'],
    ['T3', 'Điều chỉnh, gia hạn; thay đổi nội dung, tiến độ, chủ nhiệm hoặc kinh phí.'],
    ['T4', 'Đánh giá, nghiệm thu; sản phẩm, báo cáo, mốc và tài liệu chuẩn bị.'],
    ['T6', 'Dự hội thảo/công tác; nguồn nhiệm vụ, đơn vị hoặc kết hợp; giấy tờ và chứng từ.'],
    ['T10', 'Cử cán bộ đi đào tạo/nghiên cứu; điều kiện, nghĩa vụ và nội dung liên quan.'],
]

HAVE_ROWS = [
    ['Tài liệu định hướng', 'Hai tài liệu phân tích do giảng viên hướng dẫn cung cấp.',
     'Định hướng bài toán; chưa thay bản quy định gốc và phụ lục.'],
    ['Văn bản nền KHCN', 'Luật 93/2025/QH15; NĐ 267/2025/NĐ-CP; NĐ 125/2026/NĐ-CP.',
     'Đã tải để đối chiếu; chưa thay điều kiện nội bộ HUST.'],
    ['Tài chính liên quan', 'TT 39/2025/TT-BKHCN; TT 03/2023 và TT 65/2024/TT-BTC; TT 40/2017 và TT 12/2025/TT-BTC; TT 140/2025; TT 100/2025/TT-BTC.',
     'Cần kiểm đúng nguồn, đối tượng và phiên bản. Bản TT 12 đã tải là bản đăng lại, cần đối chiếu bản cơ quan ban hành.'],
    ['Cấp Bộ/chương trình', 'TT 15/2024/TT-BGDĐT; TT 44/2026/TT-BGDĐT; một số thông báo, mẫu cấp Bộ, Edge AI và NAFOSTED.',
     'Không thay bộ đăng ký, điều chỉnh và nghiệm thu cấp Đại học.'],
    ['Dẫn chiếu và đầu mối', 'QĐ 2102/2026, 3040/2026, 658/2026; trang giới thiệu KHCN, TCKH, TCNS và tin triển khai quy trình số.',
     'Chỉ giúp nhận diện văn bản/đầu mối; chưa cung cấp đủ nội dung các quy chế được dẫn.'],
]

FAQ_GROUPS = [
    ('TCNS - Cử đi đào tạo/nghiên cứu (T10)', [
        'Những câu hỏi thường gặp trước khi đề nghị cử đi; cách phân biệt đào tạo/nghiên cứu/công tác, ngắn hạn và dài hạn.',
        'Điểm thường thiếu hoặc nhầm trong tài liệu, cam kết, nghĩa vụ; các câu về gia hạn, trở về, báo cáo hoặc quyết định cử đi trước đó.',
        'Trường hợp cán bộ đang chủ trì nhiệm vụ hoặc có hỗ trợ tài chính: cần hỏi thêm gì và trao đổi với đơn vị nào.',
    ]),
    ('KHCN - Đăng ký nhiệm vụ (T1)', [
        'Câu hỏi về đối tượng, điều kiện, loại/cấp nhiệm vụ, đợt đăng ký; thông tin nào người hỏi thường chưa phân biệt được.',
        'Biểu mẫu/tài liệu thường bị thiếu, sai phiên bản hoặc hiểu nhầm nội dung cần điền; mốc đăng ký và đầu mối.',
    ]),
    ('KHCN, phối hợp TCKH/TCNS - Điều chỉnh/gia hạn (T3)', [
        'Các yêu cầu đổi tiến độ, nội dung, chủ nhiệm, kinh phí; câu hỏi hay gặp về điều kiện, thời hạn và phần tài liệu cần bổ sung.',
        'Trường hợp chủ nhiệm đi học/nghiên cứu, việc còn tồn hoặc nguồn kinh phí thay đổi; chỗ chuyên viên thường phải giải thích nhiều lượt.',
    ]),
    ('KHCN - Nghiệm thu (T4)', [
        'Vướng mắc về sản phẩm, báo cáo, minh chứng và mẫu; cách người hỏi hiểu các mốc đề nghị, nghiệm thu và hoàn thiện.',
        'Trường hợp chưa đủ sản phẩm, chưa rõ mốc áp dụng, quá hạn hoặc phải bổ sung; nội dung có thể hướng dẫn và nội dung phải xác nhận riêng.',
    ]),
    ('TCKH, phối hợp KHCN và đơn vị - Hội thảo/công tác (T6)', [
        'Câu hỏi trước chuyến đi: điều kiện, giấy tờ, biểu mẫu, nguồn kinh phí; phân biệt trong/nước ngoài và loại hoạt động.',
        'Câu hỏi trong/sau hoạt động: chứng từ cần giữ, tạm ứng/quyết toán, mốc hoàn thiện và các vướng mắc thường gặp.',
        'Thay thế hoặc kết hợp nguồn nhiệm vụ/đơn vị/tài trợ; điều kiện tránh hỗ trợ trùng nếu có; nhánh nào thường phải trao đổi qua nhiều đầu mối.',
    ]),
]

FAQ_FIELDS = [
    ['Câu hỏi thực tế', 'Giữ cách diễn đạt của người hỏi sau khi ẩn danh. Nếu đã biên tập hoặc do chuyên viên tự xây dựng, xin ghi rõ.'],
    ['Bối cảnh cần thiết', 'Nhóm thủ tục, vai trò/đối tượng, giai đoạn công việc, loại nhiệm vụ, đơn vị và nguồn kinh phí khi chúng ảnh hưởng câu trả lời.'],
    ['Thông tin phải hỏi thêm', 'Dữ kiện còn thiếu mà chuyên viên cần làm rõ; lý do dữ kiện ấy ảnh hưởng hướng dẫn.'],
    ['Cách giải đáp hiện tại', 'Kết luận theo từng phần; việc cần làm, tài liệu/biểu mẫu, nội dung cần chuẩn bị, mốc và đầu mối khi có căn cứ.'],
    ['Căn cứ áp dụng', 'Tên/số văn bản, điều/mục, biểu mẫu hoặc đường dẫn; phiên bản/thời điểm áp dụng. Chưa rõ thì ghi phần cần kiểm tra.'],
    ['Chỗ hay vướng hoặc dễ sai', 'Điểm hiểu nhầm, thông tin/tài liệu hay thiếu, bước phải hỏi lại nhiều lần hoặc nguyên nhân phải chuyển chuyên viên.'],
    ['Mức thường gặp', 'Thường gặp / thỉnh thoảng / ít gặp / chưa rõ theo kinh nghiệm; nếu có thống kê, kèm số liệu, khoảng thời gian và phạm vi ghi nhận.'],
    ['Độ khó và ảnh hưởng', 'Khó ở bước nào; sai hướng dẫn có thể gây bổ sung giấy tờ, chậm việc, nhầm mốc/nguồn hoặc ảnh hưởng nghĩa vụ ra sao.'],
    ['Trạng thái xác nhận', 'Đã được đơn vị/chuyên viên xác nhận; đang là cách giải đáp tham khảo; hoặc còn điểm cần kiểm tra.'],
    ['Quyền sử dụng', 'Được dùng để nghiên cứu, đánh giá chatbot, gửi tới dịch vụ mô hình, trích đoạn hoặc chia sẻ trên demo đến mức nào.'],
]

PRIORITY_ROWS = [
    ['Được hỏi nhiều', 'Những câu lặp lại thường xuyên hoặc tăng theo đợt công việc. Có thể đánh dấu các câu nổi bật, không cần thống kê mới.'],
    ['Hay phải hỏi lại', 'Người hỏi thường thiếu dữ kiện nào; chuyên viên phải trao đổi bao nhiêu bước nếu đã có ghi nhận.'],
    ['Khó hoặc dễ nhầm', 'Nhiều điều kiện, nhiều nguồn, sửa đổi/chuyển tiếp, ý kiến chưa thống nhất hoặc câu hỏi diễn đạt mơ hồ.'],
    ['Ảnh hưởng khi sai', 'Có thể làm nhầm tài liệu, lỡ mốc, dùng sai nguồn hoặc hiểu sai nghĩa vụ; mô tả bằng kinh nghiệm thực tế nếu có.'],
    ['Cần phối hợp', 'Nội dung cần trao đổi với Ban/đơn vị nào và vì sao; không mặc định mọi trường hợp phải qua cả ba Ban.'],
    ['Đã có tài liệu hỗ trợ', 'Có FAQ, hướng dẫn hoặc mẫu sẵn hay chưa; phần nào dù đã có tài liệu vẫn thường phải giải thích.'],
]


def register_fonts():
    base = Path('/System/Library/Fonts/Supplemental')
    names = {'TNR': 'Times New Roman.ttf', 'TNR-Bold': 'Times New Roman Bold.ttf',
             'TNR-Italic': 'Times New Roman Italic.ttf', 'TNR-BoldItalic': 'Times New Roman Bold Italic.ttf'}
    for family, filename in names.items():
        pdfmetrics.registerFont(TTFont(family, str(base / filename)))
    pdfmetrics.registerFontFamily('TNR', normal='TNR', bold='TNR-Bold', italic='TNR-Italic', boldItalic='TNR-BoldItalic')


def normalize(text):
    return str(text).replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', '-')


def inline(text):
    value = escape(normalize(text))
    return re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', value)


def make_styles():
    base = dict(fontName='TNR', fontSize=12, leading=16, textColor=colors.black,
                alignment=TA_LEFT, spaceAfter=5, allowWidows=0, allowOrphans=0)
    return {
        'body': ParagraphStyle('body', **base),
        'keep': ParagraphStyle('keep', **{**base, 'keepWithNext':True}),
        'title': ParagraphStyle('title', **{**base, 'fontName':'TNR-Bold', 'fontSize':16, 'leading':20,
                                         'spaceAfter':9, 'keepWithNext':True}),
        'section': ParagraphStyle('section', **{**base, 'fontName':'TNR-Bold', 'fontSize':14, 'leading':18,
                                             'spaceBefore':11, 'spaceAfter':6, 'keepWithNext':True}),
        'sub': ParagraphStyle('sub', **{**base, 'fontName':'TNR-Bold', 'fontSize':12, 'leading':16,
                                     'spaceBefore':8, 'spaceAfter':5, 'keepWithNext':True}),
        'bullet': ParagraphStyle('bullet', **{**base, 'leftIndent':12, 'firstLineIndent':0,
                                           'bulletIndent':1, 'bulletFontName':'TNR',
                                           'bulletFontSize':12, 'spaceAfter':4}),
        'table': ParagraphStyle('table', **{**base, 'spaceAfter':0, 'leading':15.2}),
        'table-head': ParagraphStyle('table-head', **{**base, 'fontName':'TNR-Bold', 'spaceAfter':0, 'leading':15.2}),
    }


class Writer:
    def __init__(self, key, title):
        self.key, self.title = key, title
        self.story, self.markdown = [], []
        self.styles = make_styles()
        self.width = A4[0] - 40 * mm

    def p(self, text, style='body'):
        self.story.append(Paragraph(inline(text), self.styles[style]))
        self.markdown.append(text + '\n')

    def h1(self, title):
        self.story.append(CondPageBreak(28*mm))
        self.p(title, 'section')
        self.markdown[-1] = '## ' + title + '\n'

    def h2(self, title):
        self.story.append(CondPageBreak(28*mm))
        self.p(title, 'sub')
        self.markdown[-1] = '### ' + title + '\n'

    def bullet(self, text):
        self.story.append(Paragraph(inline(text), self.styles['bullet'], bulletText='-'))
        self.markdown.append('- ' + text + '\n')

    def table(self, headers, rows, fractions):
        rendered = [[Paragraph(inline(h), self.styles['table-head']) for h in headers]]
        rendered += [[Paragraph(inline(cell), self.styles['table']) for cell in row] for row in rows]
        table = Table(rendered, colWidths=[self.width*f for f in fractions], repeatRows=1, hAlign='LEFT')
        table.setStyle(TableStyle([
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),
            ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),
            ('LINEABOVE',(0,0),(-1,0),0.7,colors.black),
            ('LINEBELOW',(0,0),(-1,0),0.6,colors.black),
            ('LINEBELOW',(0,1),(-1,-1),0.25,colors.black),
        ]))
        self.story.extend([table, Spacer(1,6)])
        self.markdown.append('| ' + ' | '.join(headers) + ' |\n')
        self.markdown.append('|' + '|'.join(['---']*len(headers)) + '|\n')
        for row in rows:
            self.markdown.append('| ' + ' | '.join(normalize(v).replace('\n',' ') for v in row) + ' |\n')
        self.markdown.append('\n')

    def page(self):
        self.story.append(PageBreak())
        self.markdown.append('\n---\n')

    def request(self, number, request):
        self.h2(f'{number}. {request["title"]}')
        self.p(f'**Phạm vi:** {request["scope"]}', 'keep')
        self.p(f'**Đơn vị phụ trách:** {request["owner"]} **Mức ưu tiên:** {request["priority"]}', 'keep')
        have = re.sub(r'^Đã có ', '', request['have'])
        self.p(f'**Đã có:** {have}')
        self.p('**Cần bổ sung:**', 'keep')
        for item in request['need']:
            self.bullet(item)
        if request.get('reference'):
            self.p('**Đầu mối/số lượng tham chiếu cần xác nhận:** ' + request['reference'])

    def build(self, directory, filename):
        doc = SimpleDocTemplate(str(directory/filename), pagesize=A4,
                                leftMargin=20*mm,rightMargin=20*mm,topMargin=20*mm,bottomMargin=20*mm,
                                title=self.title,author='',subject=TOPIC,creator='ReportLab',
                                pageCompression=1)
        def page_footer(canvas, document):
            canvas.saveState()
            canvas.setFillColor(colors.black)
            canvas.setFont('TNR',10)
            canvas.drawString(20*mm,11*mm,self.title)
            canvas.drawRightString(A4[0]-20*mm,11*mm,f'Trang {document.page}')
            canvas.restoreState()
        doc.build(self.story,onFirstPage=page_footer,onLaterPages=page_footer)
        return normalize('\n'.join(self.markdown))


def document_request():
    w = Writer('documents', 'Danh mục tài liệu cần bổ sung')
    w.p('DANH MỤC TÀI LIỆU CẦN BỔ SUNG', 'title')
    w.p('**Đề tài:** ' + TOPIC + '.')
    w.p('Kính nhờ thầy hỗ trợ cung cấp hoặc kết nối đầu mối cung cấp các văn bản, phụ lục, biểu mẫu và hướng dẫn còn thiếu dưới đây. Tài liệu dùng để chuẩn hóa căn cứ tư vấn và hoàn thiện nội dung chatbot trong phạm vi đã chọn.')

    w.h1('1. Phạm vi, thời điểm và cách đối chiếu')
    w.table(['Nhóm', 'Nội dung cần có căn cứ'], SCOPE_ROWS, [0.12,0.88])
    w.bullet('Xin bản đang áp dụng khi cung cấp, dù ban hành trước năm 2026; kèm sửa đổi, bổ sung, bản thay thế và thông tin hiệu lực. Kho đã rà soát ban đầu ngày 07/11/2026; chưa chốt phiên bản nguồn cuối.')
    w.bullet('Đăng ký nhiệm vụ cần đúng đợt năm 2026; thêm đợt thực hiện từ 2027 nếu đã công bố. Phân biệt năm đăng ký, năm bắt đầu nhiệm vụ và năm ban hành văn bản.')
    w.bullet('Nguồn cũ chỉ xin khi bản hiện hành hoặc công việc còn tồn cần xét chuyển tiếp. Không giới hạn theo tên năm trên file, không gom toàn bộ lịch sử; khóa sinh viên Kxx không là tiêu chí thu mặc định.')
    w.bullet('Các mục dưới đây là thành phần nội dung, không phải tổng số file. Một bộ gốc đủ phụ lục có thể đáp ứng nhiều mục. Phần đã nằm trong bộ nhận được chỉ cần chỉ rõ điều/mục, không xin trùng.')
    w.p('**Ưu tiên nhận trước:** ba bộ nền tảng ở Mục 3; hướng dẫn và chứng từ T6, nguồn đơn vị/kết hợp; bộ TCNS và mẫu cử đi ở Mục 4. Các nội dung còn lại vẫn thuộc danh mục cần hoàn thiện.')
    w.p('Chatbot hướng dẫn điều kiện và chuẩn bị thủ tục; không tiếp nhận, thẩm định, duyệt/ký hồ sơ hoặc thanh toán. Danh mục này không xin hồ sơ cá nhân đầy đủ, sổ kế toán, quyền truy cập hay quyền ghi vào hệ thống.')

    w.h1('2. Tài liệu đã thu để tránh xin trùng')
    w.p('Sổ nguồn hiện ghi nhận 45 nội dung tệp khác nhau từ 51 lượt tải, có bản trùng. Bảng dưới tóm tắt các nhóm đã có; đây chưa phải xác nhận mọi nguồn còn hiệu lực hoặc áp dụng cho mọi trường hợp HUST.', 'keep')
    w.table(['Nhóm đã có', 'Nội dung đã thu', 'Giới hạn cần lưu ý'], HAVE_ROWS, [0.20,0.43,0.37])
    w.p('Nếu tài liệu trên đã đủ đúng bản, không cần gửi lại. Xin bổ sung khi có bản ký/bản cơ quan ban hành cần đối chiếu, bản mới, phần còn thiếu hoặc hướng dẫn áp dụng cụ thể của HUST.')

    w.h1('3. Ba bộ quy định nền tảng cần bản đầy đủ')
    w.p('Các số điều, phụ lục và mẫu nêu dưới đây lấy từ tài liệu phân tích hoặc dẫn chiếu. Nhờ xác nhận theo bản ban hành; không dùng số tham chiếu để bỏ sót thành phần thực tế.', 'keep')
    for i, request in enumerate([r for r in REQUESTS if r['section']=='3'],1):
        w.request('3.'+str(i),request)

    w.h1('4. Hướng dẫn và biểu mẫu theo từng nhóm thủ tục')
    w.p('Các thành phần trong mục này chỉ xin nếu đang áp dụng và chưa nằm đầy đủ trong bộ gốc. Nội dung đã có chỉ cần chỉ rõ vị trí; không cần gửi trùng hoặc tạo tài liệu mới.')
    w.p('**Hướng dẫn điền biểu mẫu:** với các mẫu liên quan T1/T3/T4/T6/T10, xin hướng dẫn từng trường hoặc ví dụ mẫu đã ẩn danh nếu có sẵn; chỉ phần cần để chuẩn bị đúng tài liệu, không xin hồ sơ cá nhân đầy đủ.')
    w.p('**Hướng dẫn thao tác trên hệ thống:** với T1/T3/T4/T6/T10, xin đường dẫn, tài liệu hoặc ảnh hướng dẫn của hệ thống đang sử dụng nếu có và được phép chia sẻ. Ảnh cần bỏ dữ liệu cá nhân. Nội dung chỉ phục vụ hướng dẫn người dùng tự thực hiện; không xin tài khoản hay kết nối để thao tác thay.')
    for i, request in enumerate([r for r in REQUESTS if r['section']=='4'],1):
        w.request('4.'+str(i),request)

    w.story.append(CondPageBreak(60*mm))
    w.h1('5. Nguồn chung, dẫn chiếu và chuyển tiếp')
    for i, request in enumerate([r for r in REQUESTS if r['section']=='5'],1):
        w.request('5.'+str(i),request)

    w.h1('6. Thông tin cần đi kèm khi cung cấp')
    w.table(['Thông tin', 'Nội dung đề nghị ghi hoặc chỉ rõ'], [
        ['Nhận diện', 'Tên, số hiệu, cơ quan/đơn vị ban hành; bản ký, bản hợp nhất, dự thảo hay tài liệu hướng dẫn.'],
        ['Thành phần', 'Quyết định, toàn văn, danh mục phụ lục và mẫu; phần nào đã nằm trong cùng tệp, phần nào gửi riêng hoặc chưa có.'],
        ['Thời gian áp dụng', 'Ngày ký, ngày hiệu lực; văn bản sửa đổi/thay thế; điều khoản chuyển tiếp và các mốc quyết định khi cần. Ngày nhận file không thay ngày hiệu lực.'],
        ['Phạm vi', 'Loại/cấp nhiệm vụ, đối tượng, đơn vị, nguồn kinh phí, hoạt động và năm/đợt áp dụng; ghi giới hạn nếu chỉ dùng cho một đơn vị/chương trình.'],
        ['Đầu mối xác nhận', 'Đơn vị/chuyên viên có thể kiểm tra nội dung, tên biểu mẫu và cách áp dụng; phần chưa thống nhất cần ghi riêng.'],
        ['Quyền sử dụng', 'Được nghiên cứu nội bộ, trích đoạn, gửi tới dịch vụ mô hình, chia sẻ trên demo hay công bố toàn văn đến đâu; hạn chế cần tuân thủ.'],
    ], [0.26,0.74])
    w.p('Ưu tiên PDF bản ký rõ chữ và đủ trang; biểu mẫu trống có thể gửi Word/Excel để kiểm tra tên và nội dung. Chấp nhận file, thư mục hoặc đường dẫn nguồn chính thức; không cần đổi tên hay đóng gói lại nếu đã có bộ tài liệu sẵn.')
    w.p('Nếu nguồn chưa được phép chia sẻ toàn văn, có thể chỉ cung cấp phần được phép hoặc đầu mối xin quyền. Nội dung chưa rõ quyền sẽ chưa được đưa lên demo công khai hay gửi tới dịch vụ mô hình.')
    w.p('Sau khi nhận, sẽ đối chiếu phần đã có, ghi thành phần còn thiếu, kiểm phiên bản/phạm vi và nhờ chủ nội dung xác nhận các điểm nghiệp vụ cần thiết. Việc có file PDF chưa tự chứng minh một nhánh đã đủ căn cứ.')
    w.p('Danh mục đã bao quát các nhóm yêu cầu đã xác định trong phạm vi đề tài. Chỉ sau khi nhận bản gốc, kiểm danh mục phụ lục/biểu mẫu và lần các dẫn chiếu liên quan mới có thể xác định chính xác còn thiếu tệp nào; không mặc định mỗi thành phần trên là một tệp riêng.')
    return w


def faq_request():
    w = Writer('faq', 'Đề nghị cung cấp FAQ và vướng mắc thực tế')
    w.p('ĐỀ NGHỊ CUNG CẤP FAQ VÀ VƯỚNG MẮC THỰC TẾ', 'title')
    w.p('**Đề tài:** ' + TOPIC + '.')
    w.p('Kính nhờ thầy hỗ trợ chia sẻ bộ câu hỏi thường gặp (FAQ), cách giải đáp đang sử dụng và các vướng mắc thực tế của cán bộ, giảng viên. Mục đích là xác định việc nào được hỏi nhiều, khó giải đáp hoặc dễ sai để chọn trọng tâm phát triển chatbot và kiểm chứng chất lượng hướng dẫn.')

    w.h1('1. Có thể cung cấp những gì?')
    w.bullet('Bộ FAQ/hướng dẫn hỏi đáp đã có của TCNS, KHCN, TCKH hoặc đơn vị; tài liệu tập huấn, ghi chú giải đáp, danh sách câu hỏi lặp lại nếu được phép dùng.')
    w.bullet('Một số trao đổi thực tế đã ẩn danh, gồm câu hỏi ban đầu, thông tin chuyên viên phải hỏi thêm và hướng dẫn cuối cùng; có thể là nội dung trích từ trao đổi công việc được phép chia sẻ.')
    w.bullet('Nhận xét ngắn của chuyên viên về những việc thường được hỏi, thường phải bổ sung, khó giải thích hoặc cần phối hợp nhiều đầu mối; chấp nhận góp ý trực tiếp.')
    w.p('Không yêu cầu thầy/chuyên viên soạn mới cả bộ, lập thống kê mới hoặc điền đủ mọi trường dưới đây. Có tài liệu nào sẵn thì cung cấp theo dạng đó; phần thiếu có thể trao đổi bổ sung sau.')
    w.p('**Đầu mối ưu tiên:** phần TCNS nhờ thầy hỗ trợ trực tiếp hoặc chỉ rõ người phụ trách; phần KHCN, TCKH và đơn vị liên quan nhờ hỗ trợ kết nối đúng đầu mối. Không mặc định một chuyên viên xác nhận được toàn bộ ba miền.')

    w.h1('2. Phạm vi câu hỏi cần thu thập')
    w.p('Ưu tiên các vấn đề trong năm nhóm dưới đây. Những gợi ý này dùng để định hướng thu thập, chưa phải kết luận đây là các câu hỏi phổ biến hoặc điểm nóng tại HUST.', 'keep')
    for i,(title,items) in enumerate(FAQ_GROUPS,1):
        w.h2(f'2.{i}. {title}')
        for item in items:
            w.bullet(item)
    w.h2('2.6. Vấn đề nổi bật ngoài năm nhóm')
    w.p('Nếu chuyên viên nhận thấy một vấn đề khác được hỏi nhiều hoặc gây vướng đáng kể, xin ghi thêm tên vấn đề, đối tượng hỏi, lý do nên ưu tiên và đầu mối. Phần này phục vụ xem xét trọng tâm với giảng viên hướng dẫn, chưa được coi là chatbot đã cam kết hỗ trợ thêm nội dung đó.')

    w.h1('3. Thông tin hữu ích cho mỗi câu hỏi')
    w.p('Nếu có thể, xin kèm các thông tin dưới đây. Không cần biên tập lại tài liệu sẵn có thành bảng; có thể chỉ rõ vị trí hoặc bổ sung bằng trao đổi ngắn.', 'keep')
    w.table(['Thông tin', 'Nội dung cần biết'], FAQ_FIELDS, [0.28,0.72])
    w.p('Ưu tiên câu hỏi hiện đang được tiếp nhận. Với công việc cũ còn tiếp diễn hoặc tồn đọng, cần các mốc thực sự quyết định đáp án như ngày phê duyệt nhiệm vụ, ngày cử đi, ngày hoạt động hoặc ngày nộp chứng từ; không cần thu ngày không ảnh hưởng cách áp dụng.')
    w.p('Một câu trả lời có thể chỉ xác nhận được một phần. Xin giữ rõ phần đã có căn cứ, thông tin phải hỏi thêm và nội dung cần chuyển chuyên viên, thay vì ghép thành một kết luận chắc chắn cho toàn bộ trường hợp.')

    w.h1('4. Nhờ xác định những vấn đề nên ưu tiên')
    w.table(['Góc nhìn', 'Nội dung nhờ chuyên viên nhận xét'], PRIORITY_ROWS, [0.27,0.73])
    w.p('Nếu đã có thống kê, xin kèm khoảng thời gian, nhóm đối tượng và đơn vị ghi nhận để hiểu đúng con số. Nếu chưa có, đánh dấu theo kinh nghiệm chuyên viên là phù hợp; ghi rõ đây là ước lượng, không suy thành tần suất của toàn HUST.')
    w.p('Các tiêu chí có thể được đánh dấu độc lập: một câu hỏi ít gặp vẫn có thể quan trọng vì khó hoặc ảnh hưởng lớn. Không cần chấm điểm hay xếp hạng toàn bộ; chỉ ra những vấn đề nổi bật nhất đã hữu ích để xác định trọng tâm.')

    w.h1('5. Mẫu cung cấp ngắn, tùy chọn')
    w.p('Có thể sao chép mẫu dưới đây vào tin nhắn, Word hoặc Excel; hoặc trả lời trực tiếp theo những thông tin đang có.', 'keep')
    for label,detail in [
        ('Nhóm/vấn đề', 'T1/T3/T4/T6/T10 hoặc vấn đề khác; đối tượng và giai đoạn công việc.'),
        ('Câu hỏi thực tế', 'Nội dung đã ẩn danh; ghi rõ thực tế hay tình huống chuyên viên tự xây dựng.'),
        ('Cần hỏi thêm', 'Những thông tin còn thiếu trước khi hướng dẫn.'),
        ('Cách giải đáp', 'Việc cần làm, tài liệu/biểu mẫu, mốc, đầu mối; phần chưa thể kết luận.'),
        ('Căn cứ/thời điểm', 'Văn bản, điều/mục, mẫu và mốc áp dụng nếu đã biết.'),
        ('Mức độ và chỗ hay vướng', 'Thường gặp/khó/dễ sai/cần phối hợp; nhận xét theo kinh nghiệm hay số liệu sẵn có.'),
        ('Xác nhận và quyền dùng', 'Phần đã xác nhận/còn cần kiểm tra; phạm vi được phép sử dụng.'),
    ]:
        w.p(f'**{label}:** {detail}')

    w.h1('6. Ẩn danh, xác nhận và cách sử dụng')
    w.bullet('Bỏ tên, mã số cá nhân, liên hệ riêng, số tài khoản, thông tin định danh hồ sơ và tệp không cần thiết. Chỉ giữ vai trò/đơn vị/mốc và dữ kiện thực sự ảnh hưởng hướng dẫn, trong phạm vi được phép.')
    w.bullet('Phân biệt câu hỏi thực tế, nội dung đã biên tập và tình huống chuyên viên tự xây dựng. Tình huống tự xây dựng hữu ích để kiểm thử nhưng không chứng minh tần suất người dùng hỏi.')
    w.bullet('Phân biệt đáp án được xác nhận với kinh nghiệm tham khảo hoặc điểm chưa rõ. Khi FAQ chưa thống nhất với văn bản, cần xác minh lại; không tự biến lời giải đáp thành quy tắc chính thức.')
    w.bullet('Thông tin nhận được dùng để phân nhóm nhu cầu, cải thiện hướng dẫn và lập bộ đánh giá. Sẽ tách phần dùng để phát triển với phần giữ riêng để đánh giá theo tình huống gốc.')
    w.bullet('Chỉ dùng nội dung theo quyền được cho phép. Nghiên cứu nội bộ, gửi tới dịch vụ mô hình, trích đoạn và chia sẻ trên demo cần được phân biệt; chưa rõ quyền thì chưa công bố hoặc gửi ra dịch vụ mô hình.')
    w.p('Có thể gửi tài liệu sẵn có, đường dẫn, nội dung đã ẩn danh hoặc góp ý trực tiếp. Chỉ cần chia sẻ phần thuận tiện trước; không cần hồ sơ cá nhân đầy đủ hay giải đáp lại toàn bộ quy định.')
    return w


def coverage(project_root):
    sources = {
        'weekly_request': 'Artifact_De_tai_chinh/Tuan_6/PHIEU_XIN_DU_LIEU_2026-11-07.md',
        'originals_request': 'Artifact_tham_khao/Quy_dinh_HUST_2026/DANH_MUC_CAN_XIN_BAN_GOC.md',
        'additional_requirements': 'Artifact_tham_khao/Quy_dinh_HUST_2026/DANH_MUC_BO_SUNG.md',
        'source_matrix': 'Artifact_tham_khao/Quy_dinh_HUST_2026/MA_TRAN_NGUON_CAN_CO.md',
        'inventory': 'Artifact_tham_khao/Quy_dinh_HUST_2026/DANH_MUC_TEP.csv',
    }
    wmap={
        'W6-01':['D01'],'W6-02':['D02'],'W6-03':['D03'],'W6-04':['D07'],
        'W6-05':['D08'],'W6-06':['D09'],'W6-07':['D04'],'W6-08':['D05'],
        'W6-09':['D06'],'W6-10':['D10'],'W6-11':['D11','D12','D13'],
        'W6-12':['D14','D15'],'W6-13':['FAQ:2','FAQ:3','FAQ:5','FAQ:6'],
        'W6-14':['DOC:6','FAQ:3','FAQ:6'],
    }
    gmap={
        'G01-R01':['D01','D04','D05','D06'],'G01-R02':['D02','D07'],'G01-R03':['D03','D10'],
        'G02-R01':['D04'],'G02-R02':['D04'],'G03-R01':['D05'],'G03-R02':['D05','D09','D10'],
        'G04-R01':['D06'],'G04-R02':['D06'],'G05-R01':['D07'],'G05-R02':['D07'],
        'G05-R03':['D09','D04','D05'],'G06-R01':['D10'],'G06-R02':['D10'],
        'G07-R01':['D11'],'G07-R02':['D12'],'G07-R03':['D13'],'G08-R01':['D08'],
        'G09-R01':['D15'],'G10-R01':['D14'],'G10-R02':['D14'],
    }
    hmap={
        'H01':['D01'],'H02':['D01'],'H03':['D02'],'H04':['D03'],'H05':['D11'],
        'H06':['D12'],'H07':['D13'],'H08':['D07'],'H09':['D08'],'H10':['D10'],
        'H11':['D04'],'H12':['D05'],'H13':['D06'],'H14':['D14'],'H15':['D14'],
        'H16':['D07','D09','D15'],'H17':['D04','D05'],
    }
    for key, mapping, pattern in [
        ('weekly_request',wmap,r'W6-\d{2}'),
        ('additional_requirements',gmap,r'G\d{2}-R\d{2}'),
        ('source_matrix',hmap,r'(?<![A-Z0-9])H\d{2}(?!\d)'),
    ]:
        ids=set(re.findall(pattern,(project_root/sources[key]).read_text()))
        if ids != set(mapping):
            raise ValueError(f'Coverage mismatch for {key}: missing={ids-set(mapping)}, extra={set(mapping)-ids}')
    for mapping in (wmap,gmap,hmap):
        for refs in mapping.values():
            for ref in refs:
                if ref.startswith('D') and not ref.startswith('DOC:'):
                    assert ref in {r['id'] for r in REQUESTS},ref
    return {
        'date':DATE,'purpose':'Internal coverage crosswalk, not a teacher-facing deliverable',
        'inputs':{key:{'path':p,'sha256':hashlib.sha256((project_root/p).read_bytes()).hexdigest()} for key,p in sources.items()},
        'document_sections':{r['id']:r['title'] for r in REQUESTS},
        'weekly_14':wmap,'additional_21':gmap,'matrix_17':hmap,
        'originals_request_coverage':{
            'three_foundations':['D01','D02','D03'],
            'KHCN':['D04','D05','D06','D07','D14','D15'],
            'TCKH':['D02','D07','D08','D09','D11','D14'],
            'TCNS':['D03','D05','D10','D14'],
            'office':['D12','D13'],
            'cases_and_explanations':['D15','FAQ:2','FAQ:3','FAQ:5','FAQ:6'],
        },
        'notes':[
            '14/21/17 are overlapping views, never added as a file count.',
            'Existing files and request registers are read-only inputs.',
            'Appendix/form counts and identifiers remain references pending original-document confirmation.',
            'FAQ and case requests are in the second PDF; no question-set request in the document PDF.',
        ],
    }


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--project-root',type=Path,default=Path(__file__).resolve().parents[2])
    parser.add_argument('--output-dir',type=Path)
    parser.add_argument('--source-dir',type=Path,default=Path(__file__).resolve().parent)
    args=parser.parse_args()
    out=args.output_dir or args.project_root/'output/pdf'
    crosswalk=coverage(args.project_root)
    register_fonts()
    out.mkdir(parents=True,exist_ok=True)
    args.source_dir.mkdir(parents=True,exist_ok=True)
    for writer,filename,source_name in [
        (document_request(),DOCUMENTS_FILE,'Danh_muc_tai_lieu_can_bo_sung.md'),
        (faq_request(),FAQ_FILE,'De_nghi_cung_cap_FAQ_va_vuong_mac_thuc_te.md'),
    ]:
        text=writer.build(out,filename)
        (args.source_dir/source_name).write_text(text,encoding='utf-8')
        print(filename, (out/filename).stat().st_size, 'bytes')
    (args.source_dir/'coverage-crosswalk.json').write_text(json.dumps(crosswalk,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Coverage verified:',len(crosswalk['weekly_14']),len(crosswalk['additional_21']),len(crosswalk['matrix_17']))


if __name__=='__main__':
    main()
