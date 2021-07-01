import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
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
  const { user, updateUser } = useAuth();

  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const [buttonLoading, setButtonLoading] = useState(false);

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);

        try {
          const response = await api.patch('/users/avatar', data);

          updateUser(response.data);

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
    [addToast, updateUser],
  );

  const submitForm = useCallback(
    async (data: UpdateProfileData) => {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório').min(6, 'No mínimo 6 caracteres'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string()
          .when('password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          })
          .oneOf([Yup.ref('password'), undefined], 'A senhas não conferem'),
      });

      try {
        await schema.validate(data, {
          abortEarly: false,
        });

        setButtonLoading(true);

        const { name, email, old_password, password, password_confirmation } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData, {
          timeout: 3000,
        });
        updateUser(response.data);

        addToast({
          title: 'Seu perfil foi atualizado!',
          type: 'success',
          duration: 5000,
        });

        history.push('/'); // redireciona para a página de login
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
          title: 'Ocorreu um erro ao atualizar seu usuário',
          description: 'Por favor tente novamente',
          type: 'error',
          duration: 4000,
        });
      } finally {
        setButtonLoading(false);
      }
    },
    [addToast, history, updateUser],
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
            placeholder="Senha atual"
          />
          <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar nova senha"
          />

          <Button loading={buttonLoading} type="submit">
            Confirmar mudanças
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
