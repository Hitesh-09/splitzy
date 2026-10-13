import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Mock flatmates from seed.sql for local dev testing
export const MOCK_FLATMATES = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Hitesh Shimpi', upi: 'hitesh@okhdfcbank' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Aarav Sharma', upi: 'aarav@okaxis' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Rohan Verma', upi: 'rohan@icici' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Kabir Mehta', upi: 'kabir@paytm' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Siddharth Rao', upi: 'sid@ybl' },
  { id: '66666666-6666-6666-6666-666666666666', name: 'Dev Patel', upi: 'dev@oksbi' },
];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  activeMockUserId: string | null;
  activeFlatmateName: string;
  signOut: () => Promise<void>;
  switchMockFlatmate: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  activeMockUserId: MOCK_FLATMATES[0].id,
  activeFlatmateName: MOCK_FLATMATES[0].name,
  signOut: async () => {},
  switchMockFlatmate: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMockUserId, setActiveMockUserId] = useState<string | null>(MOCK_FLATMATES[0].id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const switchMockFlatmate = (userId: string) => {
    setActiveMockUserId(userId);
  };

  const activeFlatmate = MOCK_FLATMATES.find(m => m.id === activeMockUserId) || MOCK_FLATMATES[0];

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        activeMockUserId,
        activeFlatmateName: user?.user_metadata?.full_name || activeFlatmate.name,
        signOut,
        switchMockFlatmate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
