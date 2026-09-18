import axios from 'axios';

/**
 * Chuẩn hóa baseURL từ biến môi trường VITE_API_URL
 * Xử lý linh hoạt cả khi Vercel env nhập:
 * 1. https://political-officer-school.onrender.com (không có /api/v1)
 * 2. https://political-officer-school.onrender.com/api/v1 (đã có /api/v1)
 * 3. Trống (môi trường dev): mặc định dùng /api/v1 qua Vite proxy
 */
const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (!envUrl) {
    return '/api/v1';
  }

  const cleanUrl = envUrl.replace(/\/+$/, '');
  if (cleanUrl.endsWith('/api/v1')) {
    return cleanUrl;
  }
  return `${cleanUrl}/api/v1`;
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  // 30 giây để xử lý cold start khi backend Render ở gói Free đang sleep
  timeout: 30000,
  withCredentials: true, // Bắt buộc để gửi/nhận httpOnly cookie cho Auth & Admin
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    let friendlyMessage = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
    if (data?.message) {
      friendlyMessage = data.message;
    } else if (status === 401) {
      friendlyMessage = 'Phiên làm việc đã hết hạn hoặc chưa đăng nhập.';
    } else if (status === 403) {
      friendlyMessage = 'Bạn không có quyền thực hiện thao tác này.';
    } else if (status === 404) {
      friendlyMessage = 'Nội dung yêu cầu không tồn tại.';
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      friendlyMessage = 'Máy chủ đang khởi động lại hoặc phản hồi chậm. Vui lòng đợi trong giây lát và thử lại.';
    }

    const customError = {
      status: status || 500,
      message: friendlyMessage,
      errors: data?.errors || [],
      original: error,
    };
    return Promise.reject(customError);
  }
);

export default api;
