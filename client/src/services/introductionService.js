import api from './api';

export const introductionService = {
  async getPublic() {
    const response = await api.get('/introduction');
    return response?.data || null;
  },

  async getAdmin() {
    const response = await api.get('/admin/introduction');
    return response?.data || null;
  },

  async update(data) {
    const response = await api.put('/admin/introduction', data);
    return response?.data || null;
  },
};

export default introductionService;
