import axiosInstance from './axiosInstance';

export const getConversations = () => axiosInstance.get('/messages/conversations');
export const startConversation = (payload) =>
  axiosInstance.post('/messages/conversations', payload);
export const getMessages = (conversationId) =>
  axiosInstance.get(`/messages/conversations/${conversationId}`);
export const sendMessage = (conversationId, text) =>
  axiosInstance.post(`/messages/conversations/${conversationId}`, { text });
