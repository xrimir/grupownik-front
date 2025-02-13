'use client';
import { FC, useContext, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { AuthContext, AuthContextType } from '@/context/authContext';

export default function isAuth(Component: FC) {
  return function IsAuth(props: FC) {
    const { isAuthenticated } = useContext(AuthContext) as AuthContextType;

    useEffect(() => {
      if (!isAuthenticated) {
        return redirect('/');
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return null;
    }

    // @ts-ignore
    return <Component {...props} />;
  };
}
