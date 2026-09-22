import api from './api';

export const battalionService = {
  async getAll() {
    const response = await api.get('/battalions');
    const battalions = Array.isArray(response?.data) ? response.data : [];
    return [...battalions].sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async getById(idOrCode) {
    const response = await api.get(`/battalions/${idOrCode}`);
    return response?.data || null;
  },

  async create(data) {
    const response = await api.post('/admin/battalions', data);
    return response?.data || null;
  },

  async update(id, data) {
    const response = await api.patch(`/admin/battalions/${id}`, data);
    return response?.data || null;
  },

  async delete(id) {
    await api.delete(`/admin/battalions/${id}`);
    return true;
  },

  async addPost(battalionId, postData) {
    const response = await api.post(`/admin/battalions/${battalionId}/posts`, postData);
    return response?.data || null;
  },

  async deletePost(battalionId, postId) {
    const response = await api.delete(`/admin/battalions/${battalionId}/posts/${postId}`);
    return response?.data || null;
  },
};

export default battalionService;
