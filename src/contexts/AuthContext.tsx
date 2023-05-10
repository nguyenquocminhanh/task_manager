import React, { createContext, useState } from 'react';

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => {}
});

function AuthProvider({ children }: AuthProviderProps ) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;