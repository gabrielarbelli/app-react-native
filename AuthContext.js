import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('userData');
      
      if (token && user) {
        setUserData(JSON.parse(user));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // Simulação de login
      if (username === 'admin' && password === '123') {
        const user = { username, name: 'João Silva' };
        const token = 'mock-jwt-token-' + Date.now();
        
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        
        setUserData(user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro interno' };
    }
  };

  const logout = async () => {
    try {
      // Marcar que o usuário fez logout para mostrar toast na tela de login
      await AsyncStorage.setItem('wasLoggedOut', 'true');
      
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      setUserData(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    userData,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
