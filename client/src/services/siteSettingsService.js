/**
 * Dịch vụ quản lý cấu hình giao diện & ghi chú chân trang (Footer & Site Settings)
 * Cho phép quản trị viên / cán bộ biên tập tùy biến các thông tin liên hệ,
 * địa chỉ trụ sở, trực ban tác chiến, bản quyền và ghi chú quy chuẩn dưới cùng website
 */

const STORAGE_KEY = 'sqct_site_settings';
export const SETTINGS_UPDATED_EVENT = 'sqct_settings_updated';

export const DEFAULT_SITE_SETTINGS = {
  // Thông tin tổ chức
  orgName: 'TRƯỜNG SĨ QUAN CHÍNH TRỊ',
  subOrgName: 'BỘ QUỐC PHÒNG',
  introSummary:
    'Trung tâm đào tạo sĩ quan chính trị cấp phân đội, bồi dưỡng cán bộ chính trị và nghiên cứu khoa học xã hội nhân văn quân sự của Quân đội nhân dân Việt Nam.',
  motto: 'Chính quy – Chuẩn hóa – Hiện đại',

  // Thông tin liên hệ chân trang
  address: 'Thạch Hòa, Thạch Thất, TP. Hà Nội',
  hotline: '024.3368.8123 (Trực ban tác chiến)',
  email: 'congthongtin@daihocchinhtri.edu.vn',

  // Ghi chú bản quyền & quy chuẩn dưới cùng trang web
  copyright: 'Bản quyền thuộc Trường Sĩ quan Chính trị – Bộ Quốc phòng.',
  citationNote:
    'Ghi rõ nguồn "Cổng Thông tin điện tử Trường Sĩ quan Chính trị" khi phát hành lại thông tin từ website.',
  slogan: 'Kỷ luật – Danh dự – Trách nhiệm',
  securityNote:
    'Mọi thông tin, tư liệu xuất bản trên website tuân thủ nghiêm ngặt quy định bảo vệ bí mật quân sự và định hướng của Tổng cục Chính trị.',
};

export const siteSettingsService = {
  /**
   * Lấy cấu hình chân trang hiện tại
   */
  getSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Không thể đọc cấu hình chân trang từ localStorage:', e);
    }
    return { ...DEFAULT_SITE_SETTINGS };
  },

  /**
   * Lưu cập nhật cấu hình chân trang
   */
  saveSettings(newSettings) {
    try {
      const merged = { ...DEFAULT_SITE_SETTINGS, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      // Bắn event để cập nhật ngay lập tức các component đang mount (như Footer)
      window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT, { detail: merged }));
      return { success: true, data: merged };
    } catch (e) {
      console.error('Lỗi khi lưu cấu hình chân trang:', e);
      throw new Error('Không thể lưu cấu hình vào bộ nhớ trình duyệt.');
    }
  },

  /**
   * Khôi phục về giá trị quy chuẩn mặc định ban đầu
   */
  resetSettings() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent(SETTINGS_UPDATED_EVENT, { detail: DEFAULT_SITE_SETTINGS })
      );
      return { success: true, data: { ...DEFAULT_SITE_SETTINGS } };
    } catch (e) {
      console.error('Lỗi khi khôi phục cấu hình:', e);
      throw new Error('Khôi phục cấu hình thất bại.');
    }
  },
};

export default siteSettingsService;
