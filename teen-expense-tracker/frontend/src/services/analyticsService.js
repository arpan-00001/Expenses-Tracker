import api from './api';

const analyticsService = {
  async getSummary() {
    const response = await api.get('/analytics/summary');
    return response.data;
  },

  async getCategoryBreakdown(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get(`/analytics/categories?${params.toString()}`);
    return response.data;
  },

  async getMonthlyData(months = 6) {
    const response = await api.get(`/analytics/monthly?months=${months}`);
    return response.data;
  },

  async getTrends(days = 30) {
    const response = await api.get(`/analytics/trends?days=${days}`);
    return response.data;
  },

  async getBudgetUsage(month, year) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const response = await api.get(`/analytics/budget-usage?${params.toString()}`);
    return response.data;
  },

  async getRecommendations() {
    const response = await api.get('/recommendations');
    return response.data;
  },
};

export default analyticsService;
