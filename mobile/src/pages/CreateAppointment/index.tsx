import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderAvatar,
  ProviderContainer,
  ProviderName,
} from './styles';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

type RouteParams = {
  providerId: string;
};

export type Providers = {
  id: string;
  name: string;
  avatar_url: string;
};

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { providerId } = route.params as RouteParams;

  const [providers, setProviders] = useState<Providers[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);

  const { user } = useAuth();
  const { goBack } = useNavigation();

  useEffect(() => {
    async function getProviders() {
      const response = await api.get('/providers');

      setProviders(response.data);
    }

    getProviders();
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onPress={goBack}>
          <Icon name="chevron-left" size={28} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => setSelectedProvider(provider.id)}
              selected={provider.id === selectedProvider}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />

              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
    </Container>
  );
};

export default CreateAppointment;
