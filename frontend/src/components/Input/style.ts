import { Children } from 'react';
import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background-color: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  padding: 5px 10px;
  width: 100%;
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 7px;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      color: #e88300;
      border-color: #e88300;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #e88300;
    `}

  input {
    background: transparent;
    flex: 1;
    border: 0;
    color: #fff;
    padding: 14px 0;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 15px;
  }
`;

export const Error = styled.div`
  margin-left: 10px;
  svg {
    margin: 0;
  }
`;
