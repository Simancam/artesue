"use client"

import { createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { AuthService } from '@/services/authServices/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | undefined;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userState, loading, error] = useAuthState(auth);
  const user = userState ?? null;
  
  const signIn = async (email: string, password: string) => {
    await AuthService.signIn(email, password);
  };
  
  const signOut = async () => {
    await AuthService.signOut();
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};