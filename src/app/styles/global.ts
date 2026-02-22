import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: inherit, sans-serif;
    font-weight: 400;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  h1, h2, h3 {
    font-weight: 700;
  }

  a {
    text-decoration: none;
    color: inherit;
    font-weight: 500;
  }

  * {
    box-sizing: border-box;
  }

  input, select, textarea, button {
    font-family: inherit;
  }
`;
