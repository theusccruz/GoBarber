import React, { createContext, useCallback, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ToastContainer from '../components/ToastContainer/ToastContainer';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(({ title, type, description }: Omit<ToastMessage, 'id'>) => {
    const id = uuidv4();

    const toast = {
      id,
      title,
      type,
      description,
    };
    // Passando uma função no set que recebe como parâmetro o valor antigo do estado
    setMessages(oldMessages => [...oldMessages, toast]); // ou [...messages, toast]
  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
