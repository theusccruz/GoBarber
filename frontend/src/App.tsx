import React from 'react';

import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn/index-signIn';
import AppProvider from './hooks/indexHooks';

const App: React.FC = () => {
  return (
    <>
      <AppProvider>
        <SignIn />
      </AppProvider>

      <GlobalStyle />
    </>
  );
};

export default App;
