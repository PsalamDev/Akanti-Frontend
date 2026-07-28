import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 1. Read directly from localStorage on first mount
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Bootstrapping: Validate session on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (!savedToken) {
        console.log("[AuthContext] No token found in localStorage. Setting loading to false.");
        setLoading(false);
        return;
      }

      // Read local cache first to avoid screen flicker
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse cached user", e);
        }
      }

      try {
        console.log("[AuthContext] Validating session with backend...");
        const response = await api.get('/auth/me'); 
        const userData = response.data.user || response.data;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error("[AuthContext] Token validation failed.", error.response?.status);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Clear credentials on authentication failure
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 2. Explicitly handle changes inside manual functions rather than general sync effects
  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
    setLoading(false); // Ensure loading is cleared immediately on login
  };

  const register = async (fullName, email, password, phoneNumber, userType) => {
    const response = await api.post('/auth/register', { fullName, email, password, phoneNumber, userType });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}