import axiosInstance from './axiosInstance';

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return axiosInstance.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMyResumes = () => axiosInstance.get('/resumes');
export const getLatestResume = () => axiosInstance.get('/resumes/latest');
