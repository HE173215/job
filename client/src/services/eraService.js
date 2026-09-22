import api from './api';
import { OFFICIAL_ERAS } from '../constants/eraConstants';

const STORAGE_KEY = 'sqct_eras_data';

const getInitialEras = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((e) => ({
          ...e,
          id: e.slug || e.id || e._id,
          slug: e.slug || e.id || e._id,
        }));
      }
    }
  } catch (e) {
    console.warn('[eraService] Lỗi đọc eras từ localStorage:', e);
  }
  return OFFICIAL_ERAS.map((e) => ({
    ...e,
    id: e.slug || e.id,
    slug: e.slug || e.id,
  }));
};

const saveToStorage = (eras, notify = false) => {
  try {
    const normalized = (eras || []).map((e) => ({
      ...e,
      id: e._id || e.id || e.slug,
      slug: e.slug || e.id || e._id,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    if (notify && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('era-updated', { detail: normalized }));
    }
  } catch (e) {
    console.warn('[eraService] Lỗi lưu eras vào localStorage:', e);
  }
};

export const eraService = {
  /**
   * Lấy danh sách giai đoạn lịch sử (từ backend, fallback localStorage / OFFICIAL_ERAS)
   * Luôn sắp xếp theo thứ tự order và năm bắt đầu tăng dần (từ năm trước đến nay)
   */
  async getEras(params = {}) {
    try {
      const res = await api.get('/eras', { params });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const sorted = [...res.data]
          .map((e) => ({
            ...e,
            id: e._id || e.id || e.slug,
            slug: e.slug || e.id || e._id,
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0) || (a.startYear || 0) - (b.startYear || 0));
        saveToStorage(sorted, false);
        return sorted;
      }
    } catch (err) {
      console.warn('[eraService] Không thể kết nối API /eras, dùng dữ liệu lưu trữ:', err.message);
    }
    const local = getInitialEras();
    return [...local].sort((a, b) => (a.order || 0) - (b.order || 0) || (a.startYear || 0) - (b.startYear || 0));
  },

  /**
   * Lấy chi tiết giai đoạn theo ID hoặc slug
   */
  async getEraById(id) {
    try {
      const res = await api.get(`/eras/${id}`);
      if (res && res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn(`[eraService] Lỗi tải chi tiết giai đoạn ${id}:`, err.message);
    }
    const list = getInitialEras();
    return list.find((e) => e.id === id || e._id === id || e.slug === id) || null;
  },

  /**
   * Tạo mới giai đoạn lịch sử (Admin)
   */
  async createEra(data) {
    let createdItem = null;
    try {
      const res = await api.post('/admin/eras', data);
      if (res && res.data) {
        createdItem = res.data;
      }
    } catch (err) {
      console.error('[eraService] Tạo qua API thất bại:', err.message);
      throw err;
    }

    const current = getInitialEras();
    const newItem = createdItem || {
      id: data.slug || `era-${Date.now()}`,
      ...data,
      order: Number(data.order) || current.length + 1,
    };

    const updated = [...current, newItem].sort(
      (a, b) => (a.order || 0) - (b.order || 0) || (a.startYear || 0) - (b.startYear || 0)
    );
    saveToStorage(updated, true);
    return newItem;
  },

  /**
   * Cập nhật giai đoạn lịch sử (Admin)
   */
  async updateEra(id, data) {
    let updatedItem = null;
    try {
      const res = await api.patch(`/admin/eras/${id}`, data);
      if (res && res.data) {
        updatedItem = res.data;
      }
    } catch (err) {
      console.error(`[eraService] Cập nhật qua API ${id} thất bại:`, err.message);
      throw err;
    }

    const current = getInitialEras();
    const index = current.findIndex((e) => e.id === id || e._id === id || e.slug === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...data, ...(updatedItem || {}) };
    }
    const sorted = [...current].sort(
      (a, b) => (a.order || 0) - (b.order || 0) || (a.startYear || 0) - (b.startYear || 0)
    );
    saveToStorage(sorted, true);
    return updatedItem || current[index];
  },

  /**
   * Xóa giai đoạn lịch sử (Admin)
   */
  async deleteEra(id) {
    try {
      await api.delete(`/admin/eras/${id}`);
    } catch (err) {
      console.error(`[eraService] Xóa qua API ${id} thất bại:`, err.message);
      throw err;
    }

    const current = getInitialEras();
    const filtered = current.filter((e) => e.id !== id && e._id !== id && e.slug !== id);
    saveToStorage(filtered, true);
    return true;
  },
};

export default eraService;
