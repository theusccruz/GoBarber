import React, { useCallback, useRef, useState } from 'react';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

type ForgotPasswordData = {
  email: string;
};

const ForgotPassword: React.FC = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const submitForm = useCallback(
    async (data: ForgotPasswordData) => {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
      });

      try {
        await schema.validate(data, {
          abortEarly: false,
        });

        setButtonLoading(true);

        await api.post<ForgotPasswordData>('/password/forgot', {
          email: data.email,
        });

        addToast({
          title: 'Solicitação de recuperação de senha feita com sucesso!',
          description: `Um email será enviado para ${data.email} com mais informações`,
          type: 'success',
          duration: 5500,
        });
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
          title: 'Ocorreu um erro no envio de sua solicitação',
          description: 'Por favor tente novamente',
          type: 'error',
          duration: 4000,
        });
      } finally {
        setButtonLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <Form ref={formRef} onSubmit={submitForm}>
            <h1>Recuperar Senha</h1>

            <Input name="email" icon={FiMail} type="text" placeholder="Email" />

            <Button loading={buttonLoading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
