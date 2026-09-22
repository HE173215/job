# Chỉnh sửa trang Giới thiệu trong Admin

## Goal
Cho phép admin chỉnh toàn bộ nội dung trang Giới thiệu, lưu dùng chung trong MongoDB và hiển thị qua API public.

## Tasks
- [x] Thêm model, service, controller và validator cho nội dung Giới thiệu singleton → Verify: GET public và PUT admin đúng contract.
- [x] Gắn route public/admin và bổ sung test bảo mật, validation → Verify: `npm run check` trong `server`.
- [x] Thêm service và trang form quản trị Giới thiệu → Verify: tải, sửa, lưu và báo lỗi đúng trạng thái.
- [x] Chuyển trang Giới thiệu public sang dữ liệu API với fallback/loading/error → Verify: render được khi API có hoặc chưa có bản ghi.
- [x] Thêm route/menu admin, kiểm tra build → Verify: `npm run build` trong `client`.
- [x] Chạy lint/validation khả dụng và rà diff chỉ gồm thay đổi liên quan.

## Done When
- [x] Admin có thể sửa toàn bộ tiêu đề, phụ đề, hai khối nội dung và ghi chú; dữ liệu được lưu MongoDB và trang public phản ánh thay đổi.

## Notes
- Giữ nguyên icon và bố cục trang public; không thêm dependency mới.
- API sử dụng `/api/v1/introduction` và `/api/v1/admin/introduction`.
