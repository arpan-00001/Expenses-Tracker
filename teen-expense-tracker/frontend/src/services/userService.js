import api from './api';

const userService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/users/change-password', { currentPassword, newPassword });
    return response.data;
  },
};

export default userService;
