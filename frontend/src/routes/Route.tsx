import React, { ReactComponentElement } from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean; // verificação se a página é privada ou não
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  /*
    Casos de verificação do isPrivate:
    (Páginas que não são privadas = Login e Cadastre-se)

    true/true = Ok (página privada e usuário logado)
    true/false = Redirect (página privada e usuário não logado)
    false/true = Redirect (página não privada e usuário logado)
    false/false = Ok (página não privada e usuário não logado)

  */

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
