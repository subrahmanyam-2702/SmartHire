import axiosInstance from './axiosInstance';

export const analyzeResume = () => axiosInstance.post('/career-tools/resume-feedback');
export const getCareerGrowthPlan = () => axiosInstance.post('/career-tools/growth-plan');
