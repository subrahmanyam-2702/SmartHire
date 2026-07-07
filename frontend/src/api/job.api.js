import axiosInstance from './axiosInstance';

export const getJobs = (params = {}) => axiosInstance.get('/jobs', { params });
export const getMyJobs = () => axiosInstance.get('/jobs/mine');
export const getJobById = (id) => axiosInstance.get(`/jobs/${id}`);
export const createJob = (payload) => axiosInstance.post('/jobs', payload);
export const updateJob = (id, payload) => axiosInstance.put(`/jobs/${id}`, payload);
export const deleteJob = (id) => axiosInstance.delete(`/jobs/${id}`);
