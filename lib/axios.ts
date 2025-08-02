// lib/axios.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // 🔗 غيّري اللينك حسب لينك الباك عندك
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
