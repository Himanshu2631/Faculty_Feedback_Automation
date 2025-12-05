import api from '../api';

export const adminLogin = (data) => api.post('/admin/login', data);
export const getFaculty = () => api.get('/admin/faculty');
export const addFaculty = (data) => api.post('/admin/add-faculty', data);

export const getSubjectsAdmin = () => api.get('/admin/subjects');
export const addSubject = (data) => api.post('/admin/add-subject', data);

export const getSummary = () => api.get('/admin/summary');
