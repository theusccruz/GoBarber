import React, { ButtonHTMLAttributes } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import { Container } from './style';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ loading, children, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? <LoadingOutlined style={{ fontSize: 24 }} /> : children}
  </Container>
);

export default Button;
