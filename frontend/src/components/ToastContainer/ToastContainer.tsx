import React from 'react';

import { Container } from './style';
import { ToastMessage } from '../../hooks/toast';
import Toast from './Toast/toastCard';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  return (
    <Container>
      {messages.map(message => {
        return <Toast key={message.id} toastData={message} />;
      })}
    </Container>
  );
};

export default ToastContainer;
