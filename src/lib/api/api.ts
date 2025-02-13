import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1000,
});

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return match ? match[2] : null;
};

api.interceptors.request.use((config) => {
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.get(
            `${api.defaults.baseURL}/auth/refresh`,
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            },
          );

          document.cookie = `accessToken=${data.accessToken}; path=/`;
          document.cookie = `refreshToken=${data.refreshToken}; path=/`;

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch {
          document.cookie = 'accessToken=; path=/; max-age=0';
          document.cookie = 'refreshToken=; path=/; max-age=0';
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
