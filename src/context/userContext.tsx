'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { decodeToken, getAccessToken } from '@/lib/jwt';
import api from '@/lib/api/api';
import type { Profile, Role, User } from '@/lib/types/user.d.ts';
import { AuthContext, AuthContextType } from '@/context/authContext';

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        setUser(null);
        setLoading(false);
        return;
      }

      const decoded = decodeToken(getAccessToken());

      if (!decoded || !decoded.sub) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userId = decoded.sub;

      const response = await api.get<Profile>(`/profile/${userId}`);

      setUser({
        id: userId,
        email: decoded.email,
        role: decoded.role as Role,
        profile: response.data,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
