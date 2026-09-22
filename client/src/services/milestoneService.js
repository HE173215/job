import api from './api';
import {
  OFFICIAL_ERAS,
  compareMilestonesChronological,
} from '../constants/eraConstants';
import eraService from './eraService';

export const DEFAULT_ERAS = OFFICIAL_ERAS;

export const milestoneService = {
  /**
   * Lấy danh sách mốc lịch sử từ /api/v1/milestones
   * Sắp xếp chuẩn theo giai đoạn và các năm từ năm trước đến nay (tăng dần)
   */
  async getMilestones(params = {}) {
    const dynamicEras = await eraService.getEras().catch(() => OFFICIAL_ERAS);
    try {
      const res = await api.get('/milestones', {
        params: { limit: 100, sort: 'year', ...params },
      });
      const items = Array.isArray(res?.data) ? res.data : [];

      // Sắp xếp theo trình tự giai đoạn và năm từ trước đến nay
      const sorted = [...items].sort((a, b) => compareMilestonesChronological(a, b, dynamicEras));

      return {
        data: sorted,
        isMock: false,
        eras: dynamicEras,
        pagination: res?.pagination || { page: 1, limit: 100, total: sorted.length, totalPages: 1 },
      };
    } catch (err) {
      console.error('[milestoneService] Lỗi khi kết nối /api/v1/milestones:', err);
      return {
        data: [],
        isMock: false,
        eras: dynamicEras,
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
        error: err.message || 'Không thể tải dữ liệu lịch sử.',
      };
    }
  },

  /**
   * Lấy chi tiết mốc lịch sử theo slug
   */
  async getMilestoneBySlug(slug) {
    try {
      const res = await api.get(`/milestones/${slug}`);
      if (res && res.success && res.data) {
        return res.data;
      }
      return null;
    } catch (err) {
      console.error(`[milestoneService] Lỗi tải mốc lịch sử ${slug}:`, err);
      return null;
    }
  },

  /**
   * Lấy tư liệu gallery từ /api/v1/gallery
   */
  async getArchivalGallery() {
    try {
      const res = await api.get('/gallery', { params: { limit: 50 } });
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.error('[milestoneService] Lỗi tải kho tư liệu ảnh:', err);
      return [];
    }
  },
};

export default milestoneService;
