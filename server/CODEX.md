# CODEX BACKEND RULES

Bạn là Backend Engineer của project.

Phạm vi duy nhất:

/server

KHÔNG sửa:

/client

Frontend do Antigravity phụ trách.

---

# 1. Stack

Runtime:
Node.js đã cài sẵn.

Backend:

Node.js
Express
MongoDB
Mongoose

Authentication:

JWT
bcrypt
httpOnly Cookie

Architecture:

MVC + Service Layer

Không cài Node.
Không dùng Docker.
Không đổi runtime.

---

# 2. Kiến trúc bắt buộc

server/
└── src/
│
├── config/
│ ├── db.js
│ └── env.js
│
├── models/
│ ├── User.js
│ ├── News.js
│ ├── Category.js
│ ├── Milestone.js
│ └── Media.js
│
├── controllers/
│ ├── authController.js
│ ├── newsController.js
│ ├── milestoneController.js
│ └── mediaController.js
│
├── services/
│ ├── authService.js
│ ├── newsService.js
│ └── milestoneService.js
│
├── routes/
│ ├── authRoutes.js
│ ├── newsRoutes.js
│ ├── milestoneRoutes.js
│ └── adminRoutes.js
│
├── middlewares/
│ ├── auth.js
│ ├── authorize.js
│ ├── errorHandler.js
│ └── upload.js
│
├── validators/
│
├── utils/
│
├── seeds/
│
├── app.js
└── server.js

---

# 3. Request lifecycle

Mọi request:

ROUTE
↓
MIDDLEWARE
↓
VALIDATOR
↓
CONTROLLER
↓
SERVICE
↓
MODEL
↓
DATABASE

Không bỏ toàn bộ business logic vào controller.

Không query database trực tiếp từ routes.

---

# 4. MVC responsibility

MODEL:

- schema
- indexes
- database-level rules

CONTROLLER:

- req/res
- status codes
- gọi service

SERVICE:

- business logic
- query model
- transaction nếu cần

ROUTE:

- endpoint mapping
- middleware wiring

MIDDLEWARE:

- auth
- authorization
- errors
- upload
- validation helpers

---

# 5. Controller rule

Controller phải ngắn.

Ví dụ:

export const getMilestones = async (req, res, next) => {
try {
const result = await milestoneService.getPublishedMilestones(req.query);

    res.status(200).json({
      success: true,
      data: result
    });

} catch (error) {
next(error);
}
};

Không viết query Mongoose dài trong controller.

---

# 6. Milestone Model

Các field chính:

year
date
title
slug
summary
content
era
coverImage
gallery
source
order
featured
published
createdAt
updatedAt

order dùng để sắp timeline.

Không chỉ sort year.

Ví dụ:

{
year: Number,

date: Date,

title: {
type: String,
required: true,
trim: true
},

slug: {
type: String,
required: true,
unique: true,
index: true
},

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

order: {
type: Number,
default: 0
},

featured: {
type: Boolean,
default: false
},

published: {
type: Boolean,
default: false
}
}

timestamps: true

---

# 7. News Model

title
slug
excerpt
content
thumbnail
category
author
tags
featured
published
publishedAt
createdAt
updatedAt

Slug phải unique.

Có index phù hợp.

---

# 8. Authentication

Ưu tiên:

JWT trong httpOnly cookie.

Không gửi password hash.

Login response không bao giờ chứa:

password
passwordHash

Cookie production:

httpOnly: true
secure: production
sameSite: lax hoặc strict

---

# 9. Role

Tối thiểu:

admin
editor

admin:
full management

editor:
news
milestones
media

Authorization bắt buộc trên server.

---

# 10. API contract

Public:

GET /api/v1/milestones
GET /api/v1/milestones/:slug

GET /api/v1/news
GET /api/v1/news/:slug

GET /api/v1/categories
GET /api/v1/gallery

Auth:

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

# 11. Query

List endpoints cần hỗ trợ khi phù hợp:

?page=
&limit=
&search=
&category=
&featured=
&sort=

Phải giới hạn max page size.

Ví dụ:

limit max = 100

Không cho client yêu cầu limit vô hạn.

---

# 12. Error status

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error nếu project sử dụng

500 Internal Server Error

Không trả 200 cho error.

---

# 13. Error handler

Mọi error xử lý tập trung.

Không lặp try/catch message logic ở nhiều nơi.

Production không trả:

stack
filesystem path
database credentials
Mongo internals

---

# 14. Validation

Validate:

required fields
type
length
slug
ObjectId
pagination
file metadata

Sanitize rich text nếu có HTML.

---

# 15. Database indexes

Cân nhắc index:

slug
published
publishedAt
category
order
featured

Không tạo index không cần thiết.

---

# 16. Environment

server/.env

PORT=
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
NODE_ENV=

server/.env.example:
không có secret thật.

Không commit .env.

---

# 17. Upload

Development có thể lưu local:

uploads/

MongoDB chỉ lưu metadata.

Không lưu binary image vào MongoDB.

Kiểm tra:

mime type
size
extension nếu cần

Không cho upload executable.

---

# 18. Seed

Seed chỉ development.

Không tạo dữ kiện lịch sử giả giống dữ liệu thật.

Dùng:

year: 19XX

title:
"Mốc lịch sử mẫu"

summary:
"Nội dung mẫu đang chờ dữ liệu chính thức."

---

# 19. Backend coding rule

Không:

- over-engineer
- generic repository không cần thiết
- class abstraction dư thừa
- code duplication lớn
- function 200 dòng
- controller quá dài
- query database trong route

Ưu tiên:

simple
explicit
maintainable
secure

---

# 20. Khi hoàn thành task

Báo cáo:

FILES_CHANGED:
...

API_ADDED:
...

API_CHANGED:
...

ENV_REQUIRED:
...

FRONTEND_NOTES:
...

Không sửa frontend để "test cho nhanh".
