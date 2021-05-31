import React from 'react';
import { useTransition } from 'react-spring';

import { Container } from './style';
import { ToastMessage } from '../../hooks/toast';
import Toast from './Toast/toastCard';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    (message: ToastMessage) => message.id, // informação única da mensagem no caso o id
    {
      from: { right: '-120%', opacity: 0 }, // posição inicial da mensagem (fora da tela)
      enter: { right: '0%', opacity: 1 }, // posição quando a mensagem aparecer
      leave: { right: '-120%', opacity: 0 }, // posição quando a mensagem sair da tela
    },
  );

  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => {
        return <Toast key={key} style={props} toastData={item} />;
      })}
    </Container>
  );
};

export default ToastContainer;
