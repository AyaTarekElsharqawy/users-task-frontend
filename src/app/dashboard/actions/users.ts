import axios from 'axios';

export const fetchUsers = async (token: string, page: number) => {
  const response = await axios.get(`http://localhost:8000/api/users?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addUser = async (token: string, formData: any) => {
  const response = await axios.post('http://localhost:8000/api/users', formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const updateUser = async (token: string, userId: number, data: any) => {
  const response = await axios.put(`http://localhost:8000/api/users/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const deleteUser = async (token: string, userId: number) => {
  const response = await axios.delete(`http://localhost:8000/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
