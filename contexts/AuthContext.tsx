import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, UserProfile, UserRole } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email: string;
  address: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, confirmPassword: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateAddress: (address: string) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        await loadUserProfile(session.user.id);
      }

      setIsLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        (async () => {
          setSession(session);

          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        })();
      });

      return () => {
        subscription.unsubscribe();
      };
    })();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      console.error('Error loading profile:', profileError);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (rolesError) {
      console.error('Error loading roles:', rolesError);
      return;
    }

    const userRoles = roles?.map(r => r.role) || [];
    const isUserAdmin = userRoles.includes('admin');

    setUser({
      id: profile.id,
      email: profile.email,
      address: profile.address || '123 Main St, City, State 12345',
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      roles: userRoles,
    });

    setIsAdmin(isUserAdmin);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      console.error('Login error:', error);
      return false;
    }

    return !!data.session;
  };

  const signup = async (email: string, password: string, confirmPassword: string): Promise<boolean> => {
    if (password !== confirmPassword) {
      return false;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: '',
        }
      }
    });

    setIsLoading(false);

    if (error) {
      console.error('Signup error:', error);
      return false;
    }

    return !!data.session;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    setIsLoading(false);

    if (error) {
      console.error('Google login error:', error);
      return false;
    }

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const updateAddress = async (address: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ address })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating address:', error);
      return;
    }

    setUser({ ...user, address });
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      signup,
      loginWithGoogle,
      logout,
      updateAddress,
      isLoading,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
