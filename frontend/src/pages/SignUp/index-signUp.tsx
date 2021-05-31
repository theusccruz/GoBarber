import React, { useCallback, useRef } from 'react';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles-signUp';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface SignUpUserData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();

  const formRef = useRef<FormHandles>(null);

  const submitForm = useCallback(
    async (data: SignUpUserData) => {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
        password: Yup.string().min(6, 'No mínimo 6 caracteres'),
      });

      try {
        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post<SignUpUserData>(
          '/users',
          {
            name: data.name,
            email: data.email,
            password: data.password,
          },
          { timeout: 3000 },
        );

        addToast({
          title: 'Seu usuário foi cadastrado!',
          description: `${response.data.name}, agora você já pode logar no GoBarber`,
          type: 'success',
          duration: 5000,
        });

        history.push('/'); // redireciona para a página de login
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }

        addToast({
          title: 'Ocorreu um erro ao cadastrar o usuário',
          description: 'Por favor tente novamente',
          type: 'error',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={submitForm}>
            <h1>Faça seu Cadastro</h1>

            <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
            <Input name="email" icon={FiMail} type="text" placeholder="Email" />
            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
