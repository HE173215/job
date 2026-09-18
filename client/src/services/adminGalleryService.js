import api from './api';

export const adminGalleryService = {
  async getList(params = {}) {
    const res = await api.get('/admin/gallery', { params });
    return res;
  },

  async getById(id) {
    const res = await api.get(`/admin/gallery/${id}`);
    return res?.data || res;
  },

  async create(data) {
    const res = await api.post('/admin/gallery', data);
    return res?.data || res;
  },

  async update(id, data) {
    const res = await api.patch(`/admin/gallery/${id}`, data);
    return res?.data || res;
  },

  async delete(id) {
    const res = await api.delete(`/admin/gallery/${id}`);
    return res;
  },
};

export default adminGalleryService;
