import api from './api';

export const adminActivityService = {
  async getList(params = {}) {
    const res = await api.get('/admin/activities', { params });
    return res;
  },

  async getById(id) {
    const res = await api.get(`/admin/activities/${id}`);
    return res?.data || res;
  },

  async create(data) {
    const res = await api.post('/admin/activities', data);
    return res?.data || res;
  },

  async update(id, data) {
    const res = await api.patch(`/admin/activities/${id}`, data);
    return res?.data || res;
  },

  async delete(id) {
    const res = await api.delete(`/admin/activities/${id}`);
    return res;
  },
};

export default adminActivityService;
