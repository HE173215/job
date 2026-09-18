# PROJECT RULES — WEBSITE TRƯỜNG SĨ QUAN CHÍNH TRỊ

## 1. Mục tiêu dự án

Xây dựng website thông tin điện tử cho **Trường Sĩ quan Chính trị** theo kiến trúc MERN:

- MongoDB
- Express.js
- React.js
- Node.js

Website cần có phong cách:

- Trang trọng.
- Hiện đại.
- Mang tính truyền thống, lịch sử.
- Tối ưu cho desktop, tablet và mobile.
- Có hiệu ứng chuyển động vừa phải, không phô trương.
- Nội dung lịch sử được trình bày theo hình thức storytelling/timeline.
- Có hệ thống quản trị để cán bộ quản trị nội dung mà không cần sửa source code.

Website không được tự tạo hoặc khẳng định các thông tin lịch sử, thành tích, ngày tháng, huân chương, danh hiệu, nhân sự hoặc thông tin chính thức khi chưa có dữ liệu được cung cấp hoặc xác minh.

Dữ liệu chưa có phải sử dụng placeholder rõ ràng.

---

# 2. Kiến trúc tổng thể

Project chia thành:

```text
political-officer-school/
│
├── client/
│   ├── public/
│   └── src/
│
├── server/
│   └── src/
│
├── docs/
│
├── .env.example
├── README.md
└── PROJECT_RULES.md
```

Không viết frontend và backend chung trong một thư mục source.

---

# 3. Công nghệ frontend

Sử dụng:

```text
React
Vite
React Router DOM
Tailwind CSS
Framer Motion
Axios
TanStack React Query
React Hook Form
Lucide React
```

Có thể bổ sung thư viện khác khi thực sự cần thiết.

Không cài thư viện chỉ để giải quyết một chức năng có thể viết đơn giản bằng React/CSS.

Không sử dụng jQuery.

Không sử dụng Bootstrap nếu đã sử dụng Tailwind CSS.

---

# 4. Công nghệ backend

Sử dụng:

```text
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
cookie-parser
cors
helmet
express-rate-limit
express-validator hoặc Zod
multer
```

Ảnh có thể lưu:

```text
Development:
local uploads

Production:
Cloudinary / Object Storage
```

Không lưu file ảnh trực tiếp vào MongoDB.

MongoDB chỉ lưu:

```text
url
publicId
alt
caption
metadata
```

---

# 5. Cấu trúc frontend

```text
client/src/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── home/
│   ├── history/
│   ├── news/
│   └── admin/
│
├── layouts/
│   ├── MainLayout.jsx
│   └── AdminLayout.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── HistoryPage.jsx
│   ├── IntroductionPage.jsx
│   ├── NewsPage.jsx
│   ├── NewsDetailPage.jsx
│   ├── GalleryPage.jsx
│   ├── ContactPage.jsx
│   └── admin/
│
├── hooks/
├── services/
├── utils/
├── constants/
├── contexts/
├── routes/
├── App.jsx
└── main.jsx
```

---

# 6. Cấu trúc backend

```text
server/src/
│
├── config/
│   ├── database.js
│   └── env.js
│
├── controllers/
│
├── models/
│
├── routes/
│
├── services/
│
├── middlewares/
│
├── validators/
│
├── utils/
│
├── seeds/
│
├── app.js
└── server.js
```

Luồng backend bắt buộc:

```text
Route
  ↓
Middleware
  ↓
Validator
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

Không viết toàn bộ business logic trực tiếp trong route.

---

# 7. Các trang chính

Website tối thiểu gồm:

```text
/
├── Trang chủ
├── Giới thiệu
├── Lịch sử - Truyền thống
├── Tin tức
├── Chi tiết tin tức
├── Hoạt động
├── Thư viện ảnh
├── Liên hệ
└── Admin
```

Có thể mở rộng:

```text
Đào tạo
Nghiên cứu khoa học
Tuyển sinh
Đơn vị trực thuộc
Ấn phẩm
Video
Thông báo
```

---

# 8. Trang chủ

Trang chủ nên có cấu trúc:

## Hero

Toàn màn hình hoặc 80–100vh.

Bao gồm:

```text
Logo / biểu trưng
Tên đơn vị
Tiêu đề chính
Mô tả ngắn
CTA
Ảnh/video background
```

Ví dụ bố cục:

```text
TRƯỜNG SĨ QUAN CHÍNH TRỊ

[Tiêu đề giới thiệu]

[Khám phá lịch sử]
[Tin tức mới nhất]
```

Không tự tạo khẩu hiệu chính thức.

---

## Giới thiệu nhanh

3–4 khối thông tin:

```text
Truyền thống
Đào tạo
Nghiên cứu
Hoạt động
```

---

## Cột mốc lịch sử nổi bật

Hiển thị khoảng:

```text
4–6 milestone
```

Có nút:

```text
Khám phá hành trình lịch sử →
```

Đi tới:

```text
/history
```

---

## Tin tức nổi bật

Desktop:

```text
1 bài lớn
+
4 bài nhỏ
```

Mobile:

```text
card list
```

---

## Hoạt động nổi bật

Có thể sử dụng:

```text
slider
gallery
video
```

---

## Thành tựu / số liệu

Chỉ hiển thị dữ liệu đã được cung cấp.

Ví dụ cấu trúc:

```text
XX năm
Truyền thống

XX
...

XX
...
```

Không tự bịa số liệu.

---

## Footer

Bao gồm:

```text
Tên đơn vị
Địa chỉ
Liên hệ
Menu
Liên kết
Copyright
```

---

# 9. Landing Page Lịch sử

Route:

```text
/history
```

Đây là trang quan trọng nhất về mặt trải nghiệm.

Mục tiêu là tạo cảm giác:

```text
scroll → khám phá → chuyển thời kỳ → xem tư liệu → hiểu câu chuyện lịch sử
```

Không thiết kế như danh sách bài viết thông thường.

---

# 10. Hero trang lịch sử

Thiết kế:

```text
100vh
```

Background:

```text
ảnh tư liệu / kiến trúc / hoạt động
```

Overlay tối vừa phải.

Nội dung giữa màn hình:

```text
LỊCH SỬ & TRUYỀN THỐNG

Hành trình qua những dấu mốc
[...]
```

Cuối màn hình có:

```text
Scroll để khám phá
↓
```

Có animation nhẹ.

---

# 11. Timeline lịch sử

Desktop sử dụng vertical timeline.

Ví dụ:

```text
       19XX
         ●
         │
         │    [Ảnh]
         │
         │    Tiêu đề
         │    Nội dung
         │
       19XX
         ●
         │
     [Ảnh]
         │
     Tiêu đề
```

Các milestone nên xen kẽ trái/phải.

Mobile:

```text
● 19XX
│
├── ảnh
├── tiêu đề
└── nội dung

● 19XX
│
...
```

Không giữ layout zigzag trên màn hình nhỏ.

---

# 12. Animation timeline

Sử dụng:

```text
Framer Motion
Intersection Observer
CSS transform
```

Cho phép:

```text
fade-in
translateY
scale nhẹ
timeline progress
parallax nhẹ
image reveal
```

Không sử dụng animation quá mạnh.

Không:

```text
xoay liên tục
bounce liên tục
flashing
animation gây chóng mặt
```

Animation phải phục vụ nội dung.

---

# 13. Timeline progress

Có đường dọc chính.

Khi người dùng scroll:

```text
progress line
```

được fill theo vị trí scroll.

Milestone active:

```text
dot phóng nhẹ
title highlight
image reveal
```

Ví dụ:

```text
○
│
● 1980
│
○
│
○
```

---

# 14. Historical Era Sections

Không chỉ dùng timeline đơn thuần.

Có thể chia lịch sử thành các giai đoạn:

```text
Giai đoạn 01
[Khoảng thời gian]

Giai đoạn 02
[Khoảng thời gian]

Giai đoạn 03
[Khoảng thời gian]
```

Khoảng thời gian phải lấy từ CMS/API.

Không hardcode lịch sử trong component.

---

# 15. Historical Story Section

Giữa các timeline có thể chèn cinematic section:

```text
[Ảnh toàn màn hình]

        "Tiêu đề giai đoạn"

        mô tả ngắn
```

Scroll tạo hiệu ứng:

```text
background fixed/parallax
text fade
```

Tránh parallax trên mobile yếu.

Mobile có thể tự động disable hiệu ứng nặng.

---

# 16. Gallery tư liệu

Cuối trang:

```text
TƯ LIỆU QUA CÁC THỜI KỲ
```

Layout:

```text
masonry/grid
```

Click ảnh:

```text
lightbox
```

Thông tin:

```text
ảnh
năm
caption
nguồn
alt text
```

---

# 17. Navigation trang lịch sử

Desktop có thể có thanh:

```text
1930
│
1940
│
1950
│
...
```

hoặc:

```text
Giai đoạn 1
Giai đoạn 2
Giai đoạn 3
```

Click để scroll đến section.

Navigation phải sticky.

Mobile chuyển thành horizontal scroll.

---

# 18. Data model Milestone

MongoDB:

```javascript
{
  year: Number,

  date: Date,

  title: String,

  slug: String,

  summary: String,

  content: String,

  era: String,

  coverImage: {
    url: String,
    alt: String,
    caption: String
  },

  gallery: [
    {
      url: String,
      alt: String,
      caption: String
    }
  ],

  source: String,

  order: Number,

  featured: Boolean,

  published: Boolean,

  createdAt: Date,

  updatedAt: Date
}
```

Không dựa hoàn toàn vào `year` để sort.

Sử dụng:

```text
order
```

để admin chủ động sắp xếp timeline.

---

# 19. News model

```javascript
{
  title: String,
  slug: String,
  excerpt: String,
  content: String,

  thumbnail: {
    url: String,
    alt: String
  },

  category: ObjectId,

  author: ObjectId,

  tags: [String],

  featured: Boolean,

  published: Boolean,

  publishedAt: Date,

  createdAt: Date,

  updatedAt: Date
}
```

---

# 20. User model

Role tối thiểu:

```text
admin
editor
```

Schema:

```javascript
{
  name: String,
  username: String,
  email: String,
  password: String,

  role: {
    enum: ["admin", "editor"]
  },

  active: Boolean
}
```

Password luôn hash bằng bcrypt.

Không trả password/hash về frontend.

---

# 21. Media model

```javascript
{
  url: String,
  publicId: String,

  type: {
    enum: ["image", "video"]
  },

  alt: String,
  caption: String,

  uploadedBy: ObjectId,

  createdAt: Date
}
```

---

# 22. API convention

Prefix:

```text
/api/v1
```

API public:

```text
GET /api/v1/milestones

GET /api/v1/milestones/:slug

GET /api/v1/news

GET /api/v1/news/:slug

GET /api/v1/categories

GET /api/v1/gallery
```

Admin:

```text
POST   /api/v1/admin/milestones
PUT    /api/v1/admin/milestones/:id
DELETE /api/v1/admin/milestones/:id

POST   /api/v1/admin/news
PUT    /api/v1/admin/news/:id
DELETE /api/v1/admin/news/:id
```

Authentication:

```text
POST /api/v1/auth/login

POST /api/v1/auth/logout

GET /api/v1/auth/me
```

---

# 23. Response API

Success:

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

List:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Resource not found",
  "errors": []
}
```

Frontend không phụ thuộc trực tiếp vào cấu trúc response ngẫu nhiên.

---

# 24. Admin Dashboard

Route:

```text
/admin
```

Có:

```text
Dashboard

Quản lý tin tức

Quản lý cột mốc lịch sử

Quản lý thư viện ảnh

Quản lý danh mục

Quản lý người dùng

Cấu hình website
```

---

# 25. Milestone Admin

Admin có thể:

```text
Thêm milestone

Sửa milestone

Xóa milestone

Upload ảnh

Thêm gallery

Đổi thứ tự

Ẩn / hiện

Đặt featured
```

Nên hỗ trợ drag & drop reorder.

Không bắt admin sửa JSON.

---

# 26. Design System

Phong cách:

```text
Military
Institutional
Historical
Premium
Minimal
```

Không thiết kế giống website thương mại.

Màu gợi ý:

```text
Primary:
đỏ trầm

Secondary:
vàng / vàng đồng

Supporting:
xanh quân đội / xanh rêu

Background:
trắng ngà / xám rất sáng

Dark sections:
đen hoặc xanh rất đậm
```

Các màu này là **định hướng thiết kế**, không được coi là màu nhận diện chính thức nếu chưa có brand guideline.

---

# 27. Typography

Ưu tiên font tiếng Việt rõ ràng:

```text
Be Vietnam Pro
Inter
Roboto
```

Có thể dùng serif cho tiêu đề lịch sử:

```text
Merriweather
Noto Serif
```

Tối đa:

```text
2 font families
```

trong toàn bộ website.

---

# 28. Component rules

Component dùng lại:

```text
Container
SectionTitle
Button
NewsCard
MilestoneCard
TimelineItem
ImageGallery
PageHero
Breadcrumb
Pagination
Loading
EmptyState
ErrorState
Modal
```

Không copy cùng một UI sang nhiều trang.

Nếu component được dùng từ 2 nơi trở lên, cân nhắc tách reusable component.

---

# 29. Code rules

Mỗi file phải có một trách nhiệm chính.

Không tạo component 600–1000 dòng.

Mục tiêu thông thường:

```text
component < 250 dòng
```

Nếu lớn hơn thì xem xét tách component/hook/service.

Không tạo abstraction nếu chỉ sử dụng một lần và không giúp code rõ hơn.

Ưu tiên code dễ đọc hơn code “thông minh”.

---

# 30. Naming

React component:

```text
PascalCase

HistoryTimeline.jsx
NewsCard.jsx
```

Function:

```text
camelCase

getNews()
formatDate()
```

Constants:

```text
UPPER_CASE

API_URL
DEFAULT_PAGE_SIZE
```

CSS/Tailwind utility:

không tạo class name tùy tiện nếu Tailwind đã giải quyết được.

---

# 31. API frontend

Tất cả request API đi qua:

```text
src/services/
```

Ví dụ:

```text
services/
├── api.js
├── authService.js
├── newsService.js
├── milestoneService.js
└── mediaService.js
```

Component không được viết trực tiếp:

```javascript
axios.get("http://localhost...");
```

---

# 32. Environment variables

Frontend:

```env
VITE_API_URL=
```

Backend:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Không commit:

```text
.env
password
JWT secret
database password
API secret
```

---

# 33. Authentication

Ưu tiên:

```text
JWT + httpOnly cookie
```

Không lưu JWT nhạy cảm vào:

```text
localStorage
```

Cookie production:

```text
httpOnly: true
secure: true
sameSite: strict/lax
```

Route admin phải kiểm tra cả:

```text
authentication
authorization
```

Frontend guard không thay thế backend authorization.

---

# 34. Security

Backend phải sử dụng:

```text
helmet
cors
rate limiting
input validation
password hashing
authorization
```

Input rich text cần sanitize.

Upload kiểm tra:

```text
mime type
extension
file size
```

Không cho upload tùy ý file thực thi.

---

# 35. Nội dung và độ chính xác

Do website liên quan tới lịch sử và thông tin đơn vị:

Không được tự suy đoán:

```text
ngày thành lập
tên gọi qua các thời kỳ
lãnh đạo
thành tích
huân chương
danh hiệu
số liệu
địa chỉ
thông tin tuyển sinh
```

Nếu chưa có dữ liệu:

```text
[Đang cập nhật]
```

hoặc seed placeholder.

Không đưa nội dung placeholder lên production.

---

# 36. Image rules

Ảnh phải có:

```text
alt
width
height
```

Sử dụng:

```text
lazy loading
WebP/AVIF nếu phù hợp
responsive images
```

Ảnh hero ưu tiên preload.

Không tải ảnh 5–10 MB trực tiếp trên homepage.

Mục tiêu:

```text
hero < 500 KB nếu có thể
content image < 300 KB
thumbnail < 150 KB
```

---

# 37. Responsive

Breakpoints tham khảo:

```text
mobile
< 768px

tablet
768–1024px

desktop
> 1024px
```

Thiết kế theo mobile-first.

Mọi trang phải kiểm tra tối thiểu:

```text
375px
768px
1024px
1440px
```

Không xuất hiện horizontal scroll ngoài ý muốn.

---

# 38. Accessibility

Bắt buộc:

```text
semantic HTML
alt text
keyboard navigation
visible focus
label cho form
contrast đủ đọc
```

Không dùng `<div>` thay button.

Dùng:

```html
<button>
  <a>
    <nav>
      <header>main> section> footer></header>
    </nav></a
  >
</button>
```

đúng chức năng.

---

# 39. Performance

Không load toàn bộ history gallery khi trang vừa mở.

Sử dụng:

```text
lazy loading
route lazy loading
image optimization
pagination
React Query cache
```

Mục tiêu Lighthouse:

```text
Performance >= 85
Accessibility >= 90
Best Practices >= 90
SEO >= 90
```

---

# 40. SEO

Mỗi page có:

```text
title
description
canonical
OpenGraph
```

News detail cần metadata riêng.

Slug:

```text
/lich-su/moc-lich-su-example

/tin-tuc/ten-bai-viet
```

Không sử dụng URL:

```text
/news?id=123456
```

nếu có thể sử dụng slug.

---

# 41. Loading state

Không để trang trắng khi gọi API.

Mọi API view phải có:

```text
Loading
Success
Empty
Error
```

Ví dụ:

```text
TimelineSkeleton
NewsCardSkeleton
```

---

# 42. Error handling

Frontend không hiển thị:

```text
MongoServerError
stack trace
internal server path
```

cho người dùng.

Production chỉ hiển thị message thân thiện.

Backend log error chi tiết riêng.

---

# 43. Seed data

Tạo:

```text
server/src/seeds/
```

Seed chỉ dùng để development.

Ví dụ milestone:

```javascript
{
  year: 19XX,
  title: "Mốc lịch sử mẫu",
  summary: "Nội dung mẫu đang chờ dữ liệu chính thức.",
  published: true
}
```

Không tự viết lịch sử thật nếu chưa có nguồn dữ liệu.

---

# 44. Homepage animation

Animation được phép:

```text
hero fade
text reveal
image reveal
counter
section fade
timeline progress
parallax nhẹ
```

Không được phép:

```text
intro > 3 giây
animation khóa scroll
loading animation bắt buộc mỗi lần mở trang
hiệu ứng gây khó đọc nội dung
```

Website phải vẫn sử dụng được khi animation bị disable.

---

# 45. History page performance rule

Không animate tất cả DOM element.

Chỉ animate element đang ở viewport.

Mobile có thể giảm:

```text
blur
parallax
scale
```

Nếu người dùng bật:

```css
prefers-reduced-motion
```

thì giảm/tắt animation.

---

# 46. Không sao chép website mẫu

Website tham khảo chỉ được dùng để học:

```text
bố cục
nhịp cuộn
storytelling
timeline
animation
cách sử dụng ảnh
```

Không sao chép nguyên:

```text
source code
text
logo
ảnh
video
layout pixel-perfect
animation độc quyền
```

Mục tiêu là tạo một thiết kế riêng.

---

# 47. Git rules

Branch:

```text
main
develop
feature/*
fix/*
```

Commit:

```text
feat: add history timeline

feat: create milestone API

fix: fix mobile navigation

refactor: split history components

docs: update API documentation
```

Không commit:

```text
node_modules
dist
.env
uploads development không cần thiết
```

---

# 48. Development workflow

## Phase 1

Khởi tạo:

```text
React + Vite
Express
MongoDB
Tailwind
Router
```

## Phase 2

Xây layout:

```text
Header
Footer
MainLayout
AdminLayout
```

## Phase 3

Xây homepage.

## Phase 4

Xây History Landing Page.

Đây là ưu tiên UI cao nhất.

## Phase 5

Xây API:

```text
milestones
news
media
auth
```

## Phase 6

Xây admin CMS.

## Phase 7

Kết nối frontend/backend.

## Phase 8

Responsive + animation.

## Phase 9

Security + SEO + optimization.

## Phase 10

Testing + deploy.

---

# 49. Thứ tự ưu tiên khi AI viết code

Khi nhận một task, luôn ưu tiên:

```text
1. Đúng chức năng
2. Dễ đọc
3. Dễ bảo trì
4. Responsive
5. Accessibility
6. Performance
7. Animation
```

Không hy sinh khả năng sử dụng chỉ để có animation đẹp.

---

# 50. Quy tắc dành cho Coding AI

Khi được yêu cầu implement feature:

1. Kiểm tra cấu trúc hiện tại trước khi tạo file mới.
2. Tận dụng component hiện có.
3. Không thay đổi kiến trúc project nếu không cần.
4. Không thêm dependency không cần thiết.
5. Không hardcode API URL.
6. Không hardcode nội dung lịch sử.
7. Không tạo dữ liệu được trình bày như dữ kiện thật nếu chưa được cung cấp.
8. Không phá API hiện tại.
9. Không thay đổi component không liên quan.
10. Mỗi thay đổi phải nhỏ và có mục tiêu rõ ràng.
11. Luôn xử lý loading/error/empty state khi gọi API.
12. Luôn kiểm tra mobile.
13. Luôn kiểm tra accessibility cơ bản.
14. Không để console.log debugging trong production.
15. Không để TODO quan trọng mà không thông báo.
16. Không viết một component lớn khi có thể chia thành các phần tự nhiên.
17. Không over-engineer.
18. Không tạo service/repository/helper nếu không mang lại giá trị rõ ràng.
19. Ưu tiên giải pháp đơn giản nhất đáp ứng yêu cầu.
20. Giữ coding style nhất quán với project hiện tại.

---

# 51. Definition of Done

Một feature chỉ được coi là hoàn thành khi:

```text
✓ Chạy được

✓ Không có console error

✓ API hoạt động

✓ Có loading state

✓ Có error state

✓ Responsive mobile

✓ Responsive desktop

✓ Không hardcode secret

✓ Có validation

✓ Không phá feature khác

✓ Code dễ đọc

✓ Nội dung lịch sử không bị bịa

✓ Ảnh có alt

✓ Route hoạt động khi refresh trực tiếp
```

---

# 52. MVP cần hoàn thành

Phiên bản đầu tiên cần có:

```text
Homepage
History Landing Page
News
News Detail
Gallery

Admin Login
Admin Dashboard
News CRUD
Milestone CRUD
Media Upload

MongoDB
Authentication
Responsive
SEO cơ bản
```

Các chức năng khác triển khai sau MVP.

---

# 53. History Landing Page MVP

Đặc biệt ưu tiên hoàn thiện:

```text
Hero full screen

↓

Intro lịch sử

↓

Sticky navigation

↓

Timeline progress

↓

Milestone #1

↓

Ảnh tư liệu full-width

↓

Milestone #2

↓

Milestone #3

↓

Historical Era transition

↓

Milestone tiếp theo

↓

Gallery tư liệu

↓

CTA

↓

Footer
```

Trải nghiệm mong muốn:

```text
Người dùng không chỉ "đọc lịch sử".

Người dùng "đi qua hành trình lịch sử".
```

---

# 54. Nguyên tắc cuối cùng

Mọi quyết định kỹ thuật phải hướng tới:

```text
Simple
Maintainable
Secure
Responsive
Accessible
Fast
Content-driven
```

Website phải có khả năng thay đổi toàn bộ:

```text
tin tức
ảnh
cột mốc lịch sử
nội dung
```

từ CMS mà không cần sửa source code.

Trang lịch sử phải là điểm nhấn thị giác của website nhưng nội dung và khả năng đọc luôn quan trọng hơn hiệu ứng.
