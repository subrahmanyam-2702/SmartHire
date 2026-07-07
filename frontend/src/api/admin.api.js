import axiosInstance from './axiosInstance';

export const getPlatformStats = () => axiosInstance.get('/admin/stats');
export const getAllUsers = () => axiosInstance.get('/admin/users');
export const deactivateUser = (id) => axiosInstance.put(`/admin/users/${id}/deactivate`);
export const getAllOrganizations = () => axiosInstance.get('/admin/organizations');
export const updateOrganizationPlan = (id, plan) =>
  axiosInstance.put(`/admin/organizations/${id}/plan`, { plan });
