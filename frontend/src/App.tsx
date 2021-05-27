import React from 'react';

import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn/index-signIn';
import SignUp from './pages/SignUp/index-signUp';

const App: React.FC = () => {
  return (
    <>
      <SignIn />
      <GlobalStyle />
    </>
  );
};

export default App;
