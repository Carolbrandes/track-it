import styled from "styled-components";

interface SidebarContainerProps {
  $isOpen: boolean
}

export const SidebarContainer = styled.div<SidebarContainerProps>`
  width: 250px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: ${({ $isOpen }) => ($isOpen ? '0' : '-250px')};
  top: 0;
  z-index: 100;
  transition: left 0.3s ease;

  @media (min-width: 768px) {
    position: relative;
    left: 0;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 30px;
`;

export const LogoText = styled.h1`
  font-size: 24px;
  margin-left: 10px;
`;

export const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  transition: background-color 0.3s;
  cursor: pointer;
`;

export const UserSection = styled.div`
  margin-top: 3rem;
  border-top: 1px solid #b7b7b7b3;
  padding-top: 3rem;
`;

export const SettingsOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

export const HamburgerButton = styled.button`
display: flex;
position: fixed;
top: 0;
left: 0;
z-index: 101;
background: ${({ theme }) => theme.colors.background};
border: none;
color: ${({ theme }) => theme.colors.textPrimary};
font-size: 24px;
padding: 1rem;
width: 100%;
cursor: pointer;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

@media (min-width: 1200px) {
    display: none;
  }
`;

interface OverlayProps {
  $isOpen: boolean
}

export const Overlay = styled.div<OverlayProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};

  @media (min-width: 768px) {
    display: none;
  }
`;