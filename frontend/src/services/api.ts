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


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Se o erro for 401 (Não autorizado) e não tentamos dar refresh ainda
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('@UFocus:refreshToken');

      if (refreshToken) {
        try {
          // Tenta pedir um novo access_token usando o refresh_token
          const res = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });

          const newAccessToken = res.data.access;
          localStorage.setItem('@UFocus:token', newAccessToken);

          // Atualiza o header e tenta a requisição original de novo
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Se o refresh falhar (expirou também), desloga
          localStorage.removeItem('@UFocus:token');
          localStorage.removeItem('@UFocus:refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);