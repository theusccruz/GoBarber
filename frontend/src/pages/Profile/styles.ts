import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;

  header {
    height: 90px;
    background-color: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        width: 24px;
        height: 24px;

        color: #999591;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  place-content: center;
  width: 100%;

  margin: -90px auto 0;

  form {
    margin: 20px 0;
    width: 340px;
    text-align: center;

    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }
  }

  > a {
    color: #f4edeb;
    text-decoration: none;
    display: flex;
    align-items: center;
    margin-top: 10px;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#f4edeb')};
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 10px;
  position: relative;
  align-self: center;

  img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
  }

  label {
    cursor: pointer;

    position: absolute;
    right: 0;
    bottom: 0;

    width: 40px;
    height: 40px;

    background-color: #ff9000;
    border: 0;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: background-color 0.2s;

    input {
      display: none;
    }

    &:hover {
      background-color: ${shade(0.2, '#ff9000')};
    }

    svg {
      width: 20px;
      height: 20px;

      color: #312e38;
    }
  }
`;
