import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles-signIn';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

type FormData = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const submitForm = useCallback(
    async (data: FormData) => {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
        password: Yup.string().required('Digite sua senha'),
      });

      try {
        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn(data);

        addToast({
          title: 'Bem Vindo',
          type: 'success',
        });

        history.push('/dashboard');
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
          return;
        }

        if (error.message === 'timeout of 3000ms exceeded') {
          addToast({
            title: 'Erro ao realizar logon',
            description: 'Por favor tente novamente mais tarde',
            type: 'error',
            duration: 4000,
          });
          return;
        }

        addToast({
          title: 'Email ou senha incorretos',
          type: 'error',
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <Form ref={formRef} onSubmit={submitForm}>
            <h1>Faça seu Logon</h1>

            <Input name="email" icon={FiMail} type="text" placeholder="Email" />
            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

            <Button type="submit">Entrar</Button>

            <Link to="/forgot_password">Esqueci minha senha</Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
