import axiosInstance from './axiosInstance';

export const getMatchesForCandidate = () => axiosInstance.get('/matches/candidate');
export const getSkillGapForJob = (jobId) =>
  axiosInstance.get(`/matches/candidate/${jobId}/skill-gap`);
export const getCandidatesForJob = (jobId) => axiosInstance.get(`/matches/job/${jobId}`);
