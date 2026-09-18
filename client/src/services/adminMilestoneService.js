import api from './api';

export const adminMilestoneService = {
  async getList(params = {}) {
    const res = await api.get('/admin/milestones', { params });
    return res;
  },

  async getById(id) {
    const res = await api.get(`/admin/milestones/${id}`);
    return res?.data || res;
  },

  async create(data) {
    const res = await api.post('/admin/milestones', data);
    return res?.data || res;
  },

  async update(id, data) {
    const res = await api.patch(`/admin/milestones/${id}`, data);
    return res?.data || res;
  },

  async delete(id) {
    const res = await api.delete(`/admin/milestones/${id}`);
    return res;
  },
};

export default adminMilestoneService;
