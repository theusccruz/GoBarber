import React, { useCallback, useRef, useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

type FormData = {
  password: string;
  password_confirmation: string;
};

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const [buttonLoading, setButtonLoading] = useState(false);

  const submitForm = useCallback(
    async (data: FormData) => {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string().required('Digite sua nova senha'),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref('password')],
          'A senha não confere',
        ),
      });

      try {
        await schema.validate(data, {
          abortEarly: false,
        });

        setButtonLoading(true);

        const token = location.search.replace('?token=', '');
        if (!token) {
          throw new Error();
        }

        await api.post(
          '/password/reset/',
          {
            password: data.password,
            password_confirmation: data.password_confirmation,
            token,
          },
          {
            timeout: 3000,
          },
        );

        addToast({
          title: 'Sua senha foi redefinida',
          description: 'Agora realize o login',
          type: 'success',
          duration: 4000,
        });

        history.push('/');
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
            duration: 4000,
          });

          return;
        }

        addToast({
          title: 'Ocorreu um erro ao redefinir sua senha',
          description: 'Por favor tente novamente',
          type: 'error',
        });
      } finally {
        setButtonLoading(false);
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <Form ref={formRef} onSubmit={submitForm}>
            <h1>Redefinir senha</h1>

            <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirme sua nova senha"
            />

            <Button loading={buttonLoading} type="submit">
              Redefinir
            </Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
