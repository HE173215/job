# PROJECT MASTER RULES

# Website Trường Sĩ quan Chính trị

## 1. Mục tiêu

Xây dựng website thông tin Trường Sĩ quan Chính trị theo MERN:

- MongoDB
- Express.js
- React.js
- Node.js

Kiến trúc:

- Backend: MVC
- Frontend: component-based React architecture
- REST API giao tiếp giữa FE và BE

---

# 2. Môi trường

Node.js đã được cài sẵn trên máy.

TUYỆT ĐỐI KHÔNG:

- cài lại Node.js
- cài nvm
- cài yarn
- cài pnpm
- cài Docker
- cài MongoDB hệ thống
- thay đổi PATH hệ thống
- chạy installer hệ điều hành
- cài global package bằng npm -g

Chỉ sử dụng:

node
npm

Nếu package đã tồn tại trong package.json thì sử dụng package đó.

Không tự ý thêm dependency mới nếu chức năng hiện tại có thể thực hiện
bằng dependency đang có hoặc native JS/CSS.

Nếu thật sự cần dependency mới:

- ghi rõ lý do
- không tự cài nếu chưa được yêu cầu

---

# 3. Project structure

root/
│
├── client/ # Antigravity quản lý
├── server/ # Codex quản lý
├── uploads/
├── docs/
├── .env.example
├── AGENTS.md
└── README.md

Antigravity:
CHỈ sửa /client

Codex:
CHỈ sửa /server

Các file root chỉ được sửa khi nhiệm vụ yêu cầu rõ ràng.

---

# 4. Git boundary

Codex không sửa:

client/\*\*

Antigravity không sửa:

server/\*\*

API contract là ranh giới giao tiếp.

Nếu FE cần API chưa tồn tại:
Antigravity không viết Backend.

Thay vào đó ghi:

API_REQUIRED:
METHOD:
PATH:
REQUEST:
RESPONSE:

Codex triển khai API đó.

Nếu Codex thay đổi API contract:
phải ghi rõ breaking change.

---

# 5. API prefix

Tất cả API sử dụng:

/api/v1

Ví dụ:

GET /api/v1/milestones
GET /api/v1/milestones/:slug

GET /api/v1/news
GET /api/v1/news/:slug

POST /api/v1/auth/login
POST /api/v1/auth/logout
GET /api/v1/auth/me

Admin:

POST /api/v1/admin/milestones
PATCH /api/v1/admin/milestones/:id
DELETE /api/v1/admin/milestones/:id

POST /api/v1/admin/news
PATCH /api/v1/admin/news/:id
DELETE /api/v1/admin/news/:id

---

# 6. Response format

Success:

{
"success": true,
"message": "",
"data": {}
}

List:

{
"success": true,
"data": [],
"pagination": {
"page": 1,
"limit": 12,
"total": 0,
"totalPages": 0
}
}

Error:

{
"success": false,
"message": "Message suitable for client",
"errors": []
}

Không trả stack trace ra production.

---

# 7. Nội dung lịch sử

Không tự bịa:

- ngày thành lập
- sự kiện lịch sử
- tên đơn vị qua từng thời kỳ
- huân chương
- thành tích
- lãnh đạo
- số liệu
- danh hiệu
- địa chỉ chính thức

Khi chưa có dữ liệu:

[Đang cập nhật]

hoặc:

Nội dung mẫu - chưa phải dữ liệu chính thức.

Frontend không được hardcode dữ liệu lịch sử thật.

Dữ liệu lịch sử phải lấy từ API/CMS.

---

# 8. UI direction

Phong cách:

MILITARY
HISTORICAL
CEREMONIAL
PREMIUM
INSTITUTIONAL

Không thiết kế:

- kiểu ecommerce
- kiểu startup SaaS
- quá nhiều gradient RGB
- neon nhiều màu
- glassmorphism quá mức
- bo góc quá lớn
- icon hoạt hình

Giao diện cần:

- nghiêm túc
- trang trọng
- mạnh
- dễ đọc
- có chiều sâu lịch sử

---

# 9. Color system

Màu tham chiếu từ mẫu thiết kế.

Không tuyên bố đây là màu nhận diện chính thức
nếu chưa có guideline chính thức.

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

--army-text-muted: #B7AAA2;
}

Quy tắc:

background:
đen đỏ → đỏ mận

heading:
vàng kim

body text:
trắng ngà

border:
vàng opacity thấp

hover:
vàng sáng

Không dùng vàng làm background toàn trang.

---

# 10. Gradient chuẩn

Hero:

linear-gradient(
180deg,
#130102 0%,
#410202 35%,
#730203 100%
)

Dark section:

linear-gradient(
180deg,
#130102,
#290102
)

Red section:

linear-gradient(
135deg,
#410202,
#730203
)

---

# 11. Visual details

Cho phép:

- star particle rất nhẹ
- grain/noise background rất nhẹ
- ánh sáng vàng tại timeline
- border vàng mảnh
- text shadow nhẹ cho title
- glow nhẹ tại milestone active
- vignette
- overlay ảnh đỏ đen

Không được:

- particle dày
- animation liên tục gây mất tập trung
- chữ glow quá mạnh
- flashing
- hiệu ứng game

---

# 12. Typography

Font UI:

Be Vietnam Pro
hoặc font sans-serif hiện có trong project.

Heading lịch sử có thể dùng serif phù hợp
nếu font đã được project hỗ trợ.

Không tải font mới nếu chưa được yêu cầu.

Heading:

font-weight: 700 hoặc 800
letter-spacing nhẹ

Title quan trọng:

uppercase có chọn lọc

Không uppercase paragraph.

---

# 13. Layout

Max content width:

1280px

Page horizontal padding:

mobile: 16px
tablet: 24px
desktop: 32px

Không kéo text paragraph full width.

Paragraph optimum:
60-75 characters/line.

---

# 14. Responsive

Thiết kế mobile-first.

Phải kiểm tra:

375px
768px
1024px
1440px

Không được có horizontal overflow.

Timeline desktop:
zig-zag left/right.

Timeline mobile:
một cột.

---

# 15. Accessibility

Bắt buộc:

- semantic HTML
- button phải là button
- link phải là a/Link
- alt cho ảnh
- keyboard navigation
- visible focus
- contrast rõ
- aria-label khi icon không có text

prefers-reduced-motion:
giảm animation.

---

# 16. Performance

Không animate toàn bộ DOM.

Chỉ animate section trong viewport.

Ảnh:

- lazy load
- kích thước hợp lý
- width/height nếu biết

Hero image:
chỉ preload ảnh cần thiết.

Không load gallery hàng chục ảnh ngay lập tức.

---

# 17. Security boundary

Frontend không được coi việc ẩn button là authorization.

Backend luôn kiểm tra:

authentication

- authorization

Mọi input Backend phải validate.

Không tin dữ liệu gửi từ frontend.

---

# 18. Definition of Done

Feature chỉ hoàn thành khi:

- chạy không lỗi
- không console error
- responsive
- loading state
- empty state
- error state
- API đúng contract
- validation đầy đủ
- không hardcode secret
- không bịa dữ liệu lịch sử
- không phá code agent còn lại
