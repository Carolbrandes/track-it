import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    font-weight: 400; // Default weight
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  h1, h2, h3 {
    font-weight: 700; // Bold for headings
  }

  a {
    text-decoration: none;
    color: inherit;
    font-weight: 500; // Medium for links
  }

  * {
    box-sizing: border-box;
  }
`;