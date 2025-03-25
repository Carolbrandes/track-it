import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 250px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

export const LogoText = styled.h1`
  font-size: 24px;
  margin-left: 10px;
`;

export const NavLink = styled.a`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

export const UserSection = styled.div`
  margin-top: 3rem;
  border-top: 1px solid #b7b7b7b3;
  padding-top: 3rem;
`;



export const SettingsOption = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;