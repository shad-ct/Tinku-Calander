import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Update if deployed
});

export const getEvents = () => api.get('/events');

// Admin actions require password
export const createEvent = (formData: FormData, password?: string) => api.post('/events', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
        'x-admin-password': password || ''
    }
});

export const deleteEvent = (id: string, password?: string) => api.delete(`/events/${id}`, {
    headers: { 'x-admin-password': password || '' }
});

export const updateEvent = (id: string, data: any, password?: string) => api.put(`/events/${id}`, data, {
    headers: { 'x-admin-password': password || '' }
});

export const getComments = (date: string) => api.get(`/comments/${date}`);
export const postComment = (data: any) => api.post('/comments', data);

export const getSuggestions = () => api.get('/suggestions');
export const postSuggestion = (data: any) => api.post('/suggestions', data);
export const voteSuggestion = (id: string) => api.patch(`/suggestions/${id}/vote`);

export const getChatMessages = () => api.get('/chat');
export const postChatMessage = (data: any) => api.post('/chat', data);

export default api;
