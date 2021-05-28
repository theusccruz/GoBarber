import React from 'react';

import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn/index-signIn';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <SignIn />
      </AuthProvider>
      <GlobalStyle />
    </>
  );
};

export default App;
