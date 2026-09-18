import api from './api';

export const activityService = {
  /**
   * Lấy danh sách hoạt động đã xuất bản từ /api/v1/activities
   */
  async getActivities(params = {}) {
    try {
      const res = await api.get('/activities', { params: { limit: 50, ...params } });
      return {
        data: Array.isArray(res?.data) ? res.data : [],
        pagination: res?.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 },
      };
    } catch (err) {
      console.error('[activityService] Lỗi khi tải hoạt động:', err);
      return {
        data: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        error: err.message || 'Không thể tải danh sách hoạt động.',
      };
    }
  },

  /**
   * Lấy chi tiết hoạt động theo slug
   */
  async getActivityBySlug(slug) {
    try {
      const res = await api.get(`/activities/${slug}`);
      return res?.data || null;
    } catch (err) {
      console.error(`[activityService] Lỗi khi tải hoạt động ${slug}:`, err);
      return null;
    }
  },
};

export default activityService;
