import api from './api';

const budgetService = {
  async getAll(month, year) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const response = await api.get(`/budgets?${params.toString()}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

export default budgetService;
