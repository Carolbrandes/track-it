import { styled } from "styled-components";



export const User = styled.div`
  display: flex;
  align-items: center;
`

export const UserAvatar = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
`;

export const UserEmail = styled.div`
  margin-left: 0.5rem;
`;

