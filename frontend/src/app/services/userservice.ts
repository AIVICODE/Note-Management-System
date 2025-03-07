import api from './api';

// User
export const createUser = async (username: string, password: string) => {
  const response = await api.post('/users', { username, password });
  return response.data;
};

// 🟢 receive user from an id
export const getUserById = async (userId: number) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// 🟢 create note
export const createNoteForUser = async (userId: number, noteData: { title: string; content: string }) => {
  const response = await api.post(`/users/${userId}/notes`, noteData);
  return response.data;
};

// 🟢 receive notes
export const getUserNotes = async (userId: number) => {
  const response = await api.get(`/users/${userId}/notes`);
  return response.data;
};
