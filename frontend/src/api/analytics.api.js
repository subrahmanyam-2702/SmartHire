import axiosInstance from './axiosInstance';

export const getRecruiterAnalytics = () => axiosInstance.get('/analytics/recruiter');
