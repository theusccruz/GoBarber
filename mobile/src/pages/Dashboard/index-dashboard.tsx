import React from 'react';
import { Text, View, Button } from 'react-native';

import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 16, marginBottom: 25 }}>Dashboard</Text>

      <Button title="Sair" onPress={signOut} />
    </View>
  );
};

export default Dashboard;
