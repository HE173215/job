import api from './api';

export const galleryService = {
  /**
   * Lấy danh sách album tư liệu ảnh đã xuất bản từ /api/v1/gallery
   */
  async getGallery(params = {}) {
    try {
      const res = await api.get('/gallery', { params: { limit: 50, ...params } });
      return {
        data: Array.isArray(res?.data) ? res.data : [],
        pagination: res?.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 },
      };
    } catch (err) {
      console.error('[galleryService] Lỗi khi tải kho tư liệu ảnh:', err);
      return {
        data: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        error: err.message || 'Không thể tải kho tư liệu ảnh.',
      };
    }
  },

  /**
   * Lấy chi tiết album theo slug
   */
  async getGalleryBySlug(slug) {
    try {
      const res = await api.get(`/gallery/${slug}`);
      return res?.data || null;
    } catch (err) {
      console.error(`[galleryService] Lỗi khi tải album ${slug}:`, err);
      return null;
    }
  },
};

export default galleryService;
