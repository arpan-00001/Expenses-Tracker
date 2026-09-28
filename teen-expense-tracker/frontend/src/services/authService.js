import api from './api';

const authService = {
  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout even if API call fails
    }
    localStorage.removeItem('teentrack_token');
    localStorage.removeItem('teentrack_user');
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getToken() {
    return localStorage.getItem('teentrack_token');
  },

  setToken(token) {
    localStorage.setItem('teentrack_token', token);
  },

  getUser() {
    const user = localStorage.getItem('teentrack_user');
    return user ? JSON.parse(user) : null;
  },

  setUser(user) {
    localStorage.setItem('teentrack_user', JSON.stringify(user));
  },

  isAuthenticated() {
    return !!localStorage.getItem('teentrack_token');
  },
};

export default authService;
