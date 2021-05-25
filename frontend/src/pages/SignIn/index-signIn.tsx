import React from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import { Container, Content, Background } from './styles-sign';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const SignIn: React.FC = () => {
  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <form>
          <h1>Faça seu Logon</h1>

          <Input name="email" icon={FiMail} type="text" placeholder="Email" />
          <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

          <Button type="submit">Entrar</Button>

          <a href="TEste">Esqueci minha senha</a>
        </form>

        <a href="TEste">
          <FiLogIn />
          Criar conta
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
