import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const { pathname } = req.nextUrl;

  const authPages = ['/login', '/register', '/forgot-password'];

  let isAuthenticated = false;

  if (accessToken) {
    try {
      await axios.get(`${url}/auth/verify`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      isAuthenticated = true;
    } catch (error) {
      console.error('Access token invalid:', error);
    }
  }

  if (!isAuthenticated && refreshToken) {
    try {
      const response = await axios.get(`${url}/auth/refresh`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });

      const newAccessToken = response.data.accessToken;
      const res = NextResponse.next();

      res.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: true,
      });

      res.headers.set('Authorization', `Bearer ${newAccessToken}`);

      isAuthenticated = true;
      return res;
    } catch (error) {
      console.error('Refresh token invalid:', error);
    }
  }

  if (isAuthenticated && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/forgot-password'],
};
