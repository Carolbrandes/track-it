import styled from "styled-components";

export const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
`;

export const NavbarInner = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 1rem;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1rem;

  @media (min-width: 768px) {
    padding: 0 1.5rem;
  }
`;

export const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 1.15rem;
  flex-shrink: 0;
`;

export const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: 0.25rem;

  @media (min-width: 860px) {
    display: none;
  }
`;

export const DesktopNav = styled.div`
  display: none;
  align-items: center;
  gap: 0.4rem;
  margin-left: 1.5rem;

  @media (min-width: 860px) {
    display: flex;
  }
`;

export const NavPill = styled.a<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? '#fff' : theme.colors.textSecondary};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.gray200};
    color: ${({ $active, theme }) =>
      $active ? '#fff' : theme.colors.textPrimary};
  }
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-left: auto;
`;

// Avatar visível apenas em telas >= 1280px
export const DesktopAvatar = styled.div`
  display: none;

  @media (min-width: 1280px) {
    display: flex;
    align-items: center;
  }
`;

// Área do botão de configurações + dropdown
export const SettingsArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SettingsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.gray200};
  }
`;

export const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 230px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 0.5rem;
  z-index: 200;
`;

// Itens que só aparecem no dropdown em telas < 1280px
export const MobileOnlyDropdownItem = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (min-width: 1280px) {
    display: none;
  }
`;

export const MobileOnlyDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
  margin: 0.35rem 0;

  @media (min-width: 1280px) {
    display: none;
  }
`;

export const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray200};
  }

  select {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 0.9rem;
    cursor: pointer;
    font-family: inherit;
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
  margin: 0.35rem 0;
`;

export const MobileNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.surface};

  @media (min-width: 860px) {
    display: none;
  }
`;

export const MobileNavPill = styled.a<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.gray200};
  color: ${({ $active, theme }) =>
    $active ? '#fff' : theme.colors.textSecondary};
`;
