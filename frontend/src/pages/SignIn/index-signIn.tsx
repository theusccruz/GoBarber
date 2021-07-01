import React, { useCallback, useRef, useState } from 'react';
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

  const [buttonLoading, setButtonLoading] = useState(false);

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

        setButtonLoading(true);

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

        if (error.response && String(error.response.status).substr(0, 1) === '4') {
          addToast({
            title: error.response.data.message,
            description: 'Por favor tente novamente',
            type: 'alert',
          });

          return;
        }

        addToast({
          title: 'Ocorreu um erro ao realizar logon',
          description: 'Por favor tente novamente',
          type: 'error',
          duration: 4000,
        });
      } finally {
        setButtonLoading(false);
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

            <Button loading={buttonLoading} type="submit">
              Entrar
            </Button>

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
