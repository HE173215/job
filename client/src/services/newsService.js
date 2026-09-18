import api from './api';

export const newsService = {
  /**
   * Lấy danh sách tin tức đã xuất bản từ /api/v1/news
   */
  async getNews(params = {}) {
    try {
      const res = await api.get('/news', { params: { limit: 50, ...params } });
      return {
        data: Array.isArray(res?.data) ? res.data : [],
        pagination: res?.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 },
      };
    } catch (err) {
      console.error('[newsService] Lỗi khi tải tin tức:', err);
      return {
        data: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        error: err.message || 'Không thể tải danh sách tin tức.',
      };
    }
  },

  /**
   * Lấy chi tiết tin tức theo slug
   */
  async getNewsBySlug(slug) {
    try {
      const res = await api.get(`/news/${slug}`);
      return res?.data || null;
    } catch (err) {
      console.error(`[newsService] Lỗi khi tải bài viết ${slug}:`, err);
      return null;
    }
  },
};

export default newsService;
