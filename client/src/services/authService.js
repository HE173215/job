import api from './api';

export const authService = {
  /**
   * Đăng nhập quản trị viên
   * JWT được lưu trong httpOnly cookie do backend set
   * @param {{ username: string, password: string }} credentials
   */
  async login(credentials) {
    return api.post('/auth/login', credentials);
  },

  /**
   * Đăng xuất quản trị viên (xóa cookie phía server)
   */
  async logout() {
    return api.post('/auth/logout');
  },

  /**
   * Lấy thông tin người dùng hiện tại từ cookie
   */
  async getMe() {
    return api.get('/auth/me');
  },
};

export default authService;
