import React, { ChangeEvent, FormEvent, useCallback, useRef } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface UpdateProfileData {
  name: string;
  email: string;
  old_password?: string;
  password?: string;
  password_confirmation?: string;
}

const Profile: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAuth();

  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);

        await api.patch('/users/avatar', data);

        try {
          await api.patch('/users/avatar', data);

          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
          });
        } catch (error) {
          addToast({
            title: 'Ocorreu um erro ao atualizar seu avatar',
            description: 'Por favor tente novamente',
            type: 'error',
          });
        }
      }
    },
    [addToast],
  );

  const submitForm = useCallback(
    async (data: UpdateProfileData) => {
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

        const response = await api.post<UpdateProfileData>(
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

          return;
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
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form ref={formRef} onSubmit={submitForm}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" name="" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>

          <Input
            defaultValue={user.name}
            name="name"
            icon={FiUser}
            type="text"
            placeholder="Nome"
          />
          <Input
            defaultValue={user.email}
            name="email"
            icon={FiMail}
            type="text"
            placeholder="Email"
          />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />
          <Input
            name="new_password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar nova senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
