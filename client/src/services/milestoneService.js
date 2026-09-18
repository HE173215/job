import api from './api';

export const DEFAULT_ERAS = [
  {
    id: 'giai-doan-1',
    name: 'Giai đoạn I',
    timeframe: '1951 – 1954',
    title: 'Thành lập & Kháng chiến chống thực dân Pháp',
    description: 'Thời kỳ mở đầu trang sử vẻ vang, đặt nền móng công tác tư tưởng và đào tạo cán bộ chính trị quân đội nhân dân.',
    quote: 'Giữ vững định hướng chính trị trong mọi thử thách cam go.',
  },
  {
    id: 'giai-doan-2',
    name: 'Giai đoạn II',
    timeframe: '1954 – 1975',
    title: 'Kháng chiến chống Mỹ, cứu nước',
    description: 'Chi viện chiến trường, bồi dưỡng hàng vạn cán bộ chính trị đáp ứng yêu cầu giải phóng miền Nam thống nhất non sông.',
    quote: 'Mỗi cán bộ chính trị là một ngọn cờ dẫn dắt tinh thần bộ đội.',
  },
  {
    id: 'giai-doan-3',
    name: 'Giai đoạn III',
    timeframe: '1975 – Nay',
    title: 'Xây dựng, Đổi mới & Phát triển chính quy, hiện đại',
    description: 'Nâng cao chất lượng giáo dục toàn diện, xây dựng chuẩn đầu ra đáp ứng yêu cầu xây dựng Quân đội cách mạng, chính quy, tinh nhuệ, từng bước hiện đại.',
    quote: 'Trung thành, mẫu mực, đoàn kết, chủ động, sáng tạo, dạy tốt, học tốt.',
  },
];

export const milestoneService = {
  /**
   * Lấy danh sách mốc lịch sử từ /api/v1/milestones
   * Luôn ưu tiên dữ liệu thật từ máy chủ. Nếu chưa có dữ liệu sẽ trả về mảng rỗng để hiển thị EmptyState.
   */
  async getMilestones(params = {}) {
    try {
      const res = await api.get('/milestones', { params: { limit: 100, ...params } });
      const items = Array.isArray(res?.data) ? res.data : [];
      // Sắp xếp theo order, sau đó theo year
      const sorted = [...items].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined && a.order !== b.order) {
          return (a.order || 0) - (b.order || 0);
        }
        return (a.year || 0) - (b.year || 0);
      });

      return {
        data: sorted,
        isMock: false,
        eras: DEFAULT_ERAS,
        pagination: res?.pagination || { page: 1, limit: 100, total: sorted.length, totalPages: 1 },
      };
    } catch (err) {
      console.error('[milestoneService] Lỗi khi kết nối /api/v1/milestones:', err);
      return {
        data: [],
        isMock: false,
        eras: DEFAULT_ERAS,
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
