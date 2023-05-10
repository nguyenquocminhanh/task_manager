import React, { ReactNode, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import jwtDecode from 'jwt-decode';

interface Props {
  children: ReactNode
}

const WithAuth = ({ children }: Props) => {
  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      const decodedToken: {exp: number} = jwtDecode(token);
      const tokenExpiration = decodedToken.exp;
      if (token) {
        const expiresIn = new Date(tokenExpiration).getTime()*1000 - new Date().getTime();
        if (expiresIn > 0) {
          const timeoutId = setTimeout(() => {
            // set context to null
            localStorage.removeItem('token');
            setToken(null);
          }, expiresIn);
          return () => {
            clearTimeout(timeoutId);
          };
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setToken]);

  if (!token) {
    return <Navigate to="/auth" replace/>
  }
  return <>{children}</>;
};

export default WithAuth;