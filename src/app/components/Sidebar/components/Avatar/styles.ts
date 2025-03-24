import { styled } from "styled-components";

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4rem;
  margin-bottom: 2rem;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

export const UserEmail = styled.div`
  margin-left: 10px;
`;