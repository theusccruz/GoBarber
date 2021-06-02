import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

type AuthState = {
  user: object;
  token: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

interface AuthContextData {
  user: object;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (user[1] && token[1]) {
        // chave [0] -> valor -> [1]
        setUserData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<AuthState>(
      '/sessions',
      {
        email,
        password,
      },
      {
        timeout: 3000,
      },
    );
    const { user, token } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token], // [chave, valor]
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    setUserData({ user, token });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setUserData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: userData.user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('use Auth must be used within a AuthProvider');
  }

  return context;
};
