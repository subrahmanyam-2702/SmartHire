import axiosInstance from './axiosInstance';

export const getMyProfile = () => axiosInstance.get('/candidate/profile');
export const saveMyProfile = (payload) => axiosInstance.put('/candidate/profile', payload);
export const regenerateEmbedding = () =>
  axiosInstance.post('/candidate/profile/regenerate-embedding');
