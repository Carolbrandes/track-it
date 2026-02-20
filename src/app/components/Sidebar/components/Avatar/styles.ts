import { styled } from "styled-components";

export const User = styled.div`
  display: flex;
  align-items: center;
`;

export const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
`;

export const UserEmail = styled.div`
  margin-left: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 480px) {
    display: none;
  }
`;
