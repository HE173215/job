# ANTIGRAVITY FRONTEND RULES

Bạn là Frontend Engineer của project.

Phạm vi duy nhất:

/client

KHÔNG sửa:

/server

Backend do Codex phụ trách.

Nếu thiếu API:
không tự viết Express route.

Hãy ghi API_REQUIRED để Codex triển khai.

---

# 1. Frontend goal

Website phải mang cảm giác:

TRANG TRỌNG
LỊCH SỬ
QUÂN ĐỘI
CHÍNH QUY
HIỆN ĐẠI

Tham khảo visual:

- nền đỏ đen
- vàng kim
- timeline trung tâm
- milestone card hai bên
- typography lớn
- ảnh lịch sử
- animation scroll nhẹ

Không sao chép pixel-perfect website mẫu.

---

# 2. Color variables

Trong global CSS:

:root {
--army-black: #130102;
--army-dark: #290102;

--army-maroon: #410202;
--army-red-dark: #580202;
--army-red: #730203;
--army-red-light: #900302;

--army-gold: #D99C2B;
--army-gold-soft: #C99E30;
--army-gold-light: #F0C65A;

--army-ivory: #E0DACD;
--army-white: #F8F4EA;

--army-muted: #B7AAA2;
}

---

# 3. Main background

body {
color: var(--army-white);
background: var(--army-black);
}

Section có thể đổi:

dark:
#130102

red dark:
#410202

red:
#730203

Không dùng background trắng làm giao diện chính.

Các trang admin có thể sử dụng giao diện sáng hơn
nếu tăng khả năng thao tác.

---

# 4. Header

Desktop header:

height khoảng 64-72px

background:
rgba(19, 1, 2, 0.95)

border-bottom:
1px solid rgba(gold)

Layout:

[LOGO] [TÊN TRƯỜNG] [TRANG CHỦ] [GIỚI THIỆU] [LỊCH SỬ] ...

Header sticky.

Khi scroll:
background đậm hơn.

Active navigation:
màu vàng kim.

Hover:
vàng sáng.

Mobile:
hamburger menu.

---

# 5. Homepage Hero

Hero:

min-height: 85vh hoặc 100vh

Background:
ảnh được cung cấp

- dark red overlay

Không tự tạo logo quân đội.

Không thay thế biểu trưng chính thức bằng icon tự nghĩ.

Layout:

              [EMBLEM]

       TRƯỜNG SĨ QUAN CHÍNH TRỊ

        [heading / introduction]

       [KHÁM PHÁ LỊCH SỬ]

Scroll indicator phía dưới.

---

# 6. Hero visual

Có thể dùng:

radial-gradient(
circle at center,
rgba(144, 3, 2, 0.50),
rgba(19, 1, 2, 0.96)
)

Thêm texture/noise rất nhẹ.

Có thể có particle ánh vàng nhưng:

opacity thấp
ít phần tử
không gây lag mobile.

---

# 7. History Landing Page

Route:

/history

Đây là trang ưu tiên thiết kế cao nhất.

Sections:

HistoryHero
HistoryIntro
EraNavigation
HistoryTimeline
HistoricalBreak
HistoryGallery
HistoryCTA

---

# 8. HistoryHero

100vh.

Center aligned.

Ví dụ:

        [logo/emblem]

      HÀNH TRÌNH LỊCH SỬ
      TRƯỜNG SĨ QUAN CHÍNH TRỊ

          [mô tả]

              ↓

Không hardcode khẩu hiệu chính thức
nếu chưa được cung cấp.

---

# 9. Timeline desktop

Timeline nằm giữa.

               CARD
                 |
                 |
                 ●
                 |
                 |
                         CARD
                 |
                 ●
                 |
        CARD     |
                 ●

Vertical line:

2px

Color:
army-gold

Glow vừa phải:

box-shadow:
0 0 8px rgba(217,156,43,.6)

---

# 10. Timeline milestone dot

Dot:

16-20px

border:
2px solid gold

background:
army-maroon

active:

background:
gold

outer glow nhẹ.

Không glow 30-50px.

---

# 11. Timeline Card

Desktop width:

420-500px

Background:

rgba(41, 1, 2, .82)

Border:

1px solid rgba(217,156,43,.30)

Border radius:

6px đến 10px

Không sử dụng card radius 24px kiểu SaaS.

Padding:

24px

Year badge:

background: gold
color: dark maroon

Title:
gold / gold-light

Text:
ivory

Image:
aspect ratio ổn định
object-fit cover

---

# 12. Timeline mobile

< 768px:

Timeline nằm bên trái.

CARD chỉ nằm một phía.

Ví dụ:

●── 19XX
│
│ [CARD]
│
●── 19XX
│
│ [CARD]

Không zig-zag trên mobile.

Không để card quá hẹp.

---

# 13. Timeline animation

Nếu project đã có animation library:
dùng library đó.

Nếu chưa có:
ưu tiên CSS + IntersectionObserver native.

Không tự cài animation library mới.

Animation:

opacity 0 → 1
translateY 20px → 0

Duration:
400-700ms

Không animation > 1s cho mỗi card.

---

# 14. Timeline scroll progress

Có:

track line:
gold opacity .20

progress line:
gold

Progress dựa trên scroll position của timeline.

Milestone visible:
dot chuyển active.

Không block main thread bằng scroll listener liên tục.

Dùng:
requestAnimationFrame
hoặc IntersectionObserver
khi phù hợp.

---

# 15. Era navigation

Sticky dưới header.

Ví dụ:

GIAI ĐOẠN I
GIAI ĐOẠN II
GIAI ĐOẠN III
...

Desktop:
center tabs.

Mobile:
horizontal scroll.

Active:
gold.

Click:
smooth scroll tới era.

---

# 16. Historical Break Section

Giữa các giai đoạn:

full-width image.

Overlay:

linear-gradient(
rgba(19,1,2,.30),
rgba(19,1,2,.90)
)

Text center:

GIAI ĐOẠN ...
[date range]

Có thể parallax nhẹ desktop.

Mobile:
không parallax nặng.

---

# 17. Activity page

Theo tinh thần ảnh tham khảo:

Header section dark.

Title:

HOẠT ĐỘNG ...

gold.

Có một campaign/event highlight:

red dark panel
gold border
label gold
title gold

Sau đó:

activity grid.

Card ảnh:
3 cột desktop
2 cột tablet
1 cột mobile.

---

# 18. Homepage structure

Header

Hero

Introduction

Featured History

Featured News

Activities

Gallery

CTA

Footer

---

# 19. Featured history home

Có timeline rút gọn:

4-5 milestone.

Không tải toàn bộ lịch sử.

CTA:

KHÁM PHÁ HÀNH TRÌNH LỊCH SỬ

→ /history

---

# 20. Buttons

Primary:

background gold
color dark red

Hover:
gold-light

Secondary:

transparent
border gold
color gold

Không dùng blue button mặc định.

---

# 21. Components

src/
│
├── components/
│ ├── common/
│ │ ├── Container
│ │ ├── SectionTitle
│ │ ├── Button
│ │ ├── Loading
│ │ ├── ErrorState
│ │ └── EmptyState
│ │
│ ├── layout/
│ │ ├── Header
│ │ ├── MobileMenu
│ │ └── Footer
│ │
│ ├── history/
│ │ ├── HistoryHero
│ │ ├── HistoryIntro
│ │ ├── EraNavigation
│ │ ├── Timeline
│ │ ├── TimelineItem
│ │ ├── EraBreak
│ │ └── HistoryGallery
│ │
│ ├── news/
│ └── admin/
│
├── pages/
├── services/
├── hooks/
├── utils/
├── constants/
├── layouts/
└── routes/

---

# 22. API access

Tất cả API request đi qua:

src/services/

Không viết:

fetch("/api/...")

rải rác trong component.

Ví dụ:

services/
api.js
authService.js
milestoneService.js
newsService.js

---

# 23. API base URL

Dùng env:

VITE_API_URL

Ví dụ:

const API_BASE_URL =
import.meta.env.VITE_API_URL;

Không hardcode:

http://localhost:5000

trong components.

---

# 24. History service contract

Frontend mong đợi:

GET /api/v1/milestones

Response:

{
success: true,
data: [
{
_id,
year,
date,
title,
slug,
summary,
era,
coverImage,
order
}
]
}

Frontend sort dự phòng theo order,
nhưng Backend phải trả đúng thứ tự.

---

# 25. Loading

History page:

TimelineSkeleton

News page:

NewsSkeleton

Không để blank page.

---

# 26. Empty state

Nếu không có milestones:

"Thông tin lịch sử đang được cập nhật."

Không hiển thị error kỹ thuật.

---

# 27. Error state

Hiển thị:

"Không thể tải dữ liệu. Vui lòng thử lại."

Có button:

"Thử lại"

Không show:

AxiosError
500 stack
network internals

---

# 28. Images

Image data:

{
url,
alt,
caption
}

alt bắt buộc.

Không sử dụng alt:
"image1"

Ưu tiên mô tả thực tế nếu dữ liệu có.

---

# 29. Footer

Darkest background:

#130102

Gold border top.

Sections:

- tên đơn vị
- menu
- thông tin liên hệ
- liên kết

Thông tin chưa xác nhận:
không tự bịa.

---

# 30. Admin design

Admin không cần cinematic.

Ưu tiên:

clear
fast
functional

Sidebar:
dark maroon.

Active:
gold.

Table:
high contrast.

Forms:
rõ ràng.

Admin milestone cần:

Create
Edit
Delete
Publish toggle
Featured toggle
Order
Image
Gallery

---

# 31. No fake content

TUYỆT ĐỐI KHÔNG:

tự viết sự kiện lịch sử thật.

Khi mock UI:

{
year: "19XX",
title: "Mốc lịch sử mẫu",
summary: "Nội dung đang cập nhật."
}

---

# 32. Frontend completion report

Sau mỗi task báo:

FILES_CHANGED:
...

COMPONENTS_ADDED:
...

ROUTES_ADDED:
...

API_USED:
...

API_REQUIRED:
...

RESPONSIVE_CHECK:
375
768
1024
1440

Không tự sửa Backend.
