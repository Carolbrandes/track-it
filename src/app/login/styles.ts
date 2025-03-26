import styled from 'styled-components';


export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

export const LoginHeader = styled.header`
   display: flex;
   flex-direction: column;
   align-items: center;
   
   h1{
    margin-top: 0.5rem;
   }
`


export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.primary};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

export const Title = styled.h1`
  font-size: 24px;
  color: ${(props) => props.theme.colors.background};
  margin-bottom: 20px;
`;


export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const Button = styled.button`
  width: 100%;
  height: 2.5rem;
  padding: 10px;
  border-radius: 8px;
  background-color:  ${(props) => props.theme.colors.secondary};
  border: none;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;