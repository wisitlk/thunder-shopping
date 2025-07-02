import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
  updateAddress: (address: string) => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      setUser({
        email,
        address: '123 Main St, City, State 12345'
      });
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, confirmPassword: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock signup - simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password && password === confirmPassword) {
      setUser({
        email,
        address: '123 Main St, City, State 12345'
      });
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateAddress = (address: string) => {
    if (user) {
      setUser({ ...user, address });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateAddress,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};