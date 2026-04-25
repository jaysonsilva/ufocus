import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// "Interceptador": Antes de cada requisição sair, ele injeta o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@UFocus:token');
  
  if (token) {
    // Adiciona o Bearer Token automaticamente igual você fez no Thunder Client
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});