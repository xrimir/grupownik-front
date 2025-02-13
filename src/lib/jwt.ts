import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp?: number;
}

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return match ? match[2] : null;
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=${60 * 60 * 24}; secure; samesite=strict`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
};

const removeTokens = () => {
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0; secure; samesite=strict`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0; secure; samesite=strict`;
};

const decodeToken = (token: string | null): JwtPayload | null => {
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return false;
  }
};

const getAccessToken = (): string | null => getCookie('accessToken');

const getRefreshToken = (): string | null => getCookie('refreshToken');

export {
  saveTokens,
  decodeToken,
  removeTokens,
  isTokenValid,
  getAccessToken,
  getRefreshToken,
};
