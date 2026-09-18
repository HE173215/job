/**
 * Tiện ích chuyển đổi chuỗi tiếng Việt có dấu thành slug URL chuẩn
 * Không cần cài thêm thư viện bên ngoài
 */
export function slugify(text = '') {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Tách ký tự và dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/[đĐ]/g, 'd') // Thay đ, Đ thành d
    .replace(/[^a-z0-9\s-]/g, '') // Xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng -
    .replace(/-+/g, '-'); // Xóa gạch nối lặp lại
}

export default slugify;
