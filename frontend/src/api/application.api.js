import axiosInstance from './axiosInstance';

export const applyToJob = (jobId) => axiosInstance.post('/applications', { jobId });
export const getMyApplications = () => axiosInstance.get('/applications/candidate');
export const getMyInterviews = () => axiosInstance.get('/applications/candidate/interviews');
export const getApplicationsForJob = (jobId) => axiosInstance.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, payload) =>
  axiosInstance.put(`/applications/${id}/status`, payload);
export const generateCoverLetter = (applicationId) =>
  axiosInstance.post(`/applications/${applicationId}/cover-letter`);
