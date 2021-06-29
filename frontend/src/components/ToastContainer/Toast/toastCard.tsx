import React, { useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import { useToast, ToastMessage } from '../../../hooks/toast';

import { Container } from './style';

interface ToastProps {
  toastData: ToastMessage;
  style: object;
}

const Toast: React.FC<ToastProps> = ({ toastData, style }) => {
  const { removeToast } = useToast();

  const icons = {
    success: <FiCheckCircle size={22} />,
    info: <FiInfo size={22} />,
    error: <FiAlertCircle size={22} />,
  };

  const toastDuration = toastData.duration ? toastData.duration : 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toastData.id);
    }, toastDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, toastData.id, toastDuration]);

  return (
    <Container
      hasDescription={Number(!!toastData.description)}
      type={toastData.type}
      style={style}
    >
      {icons[toastData.type || 'info']}
      <div>
        <strong>{toastData.title}</strong>
        {toastData.description && <p>{toastData.description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(toastData.id)}>
        <FiXCircle size={20} />
      </button>
    </Container>
  );
};

export default Toast;
