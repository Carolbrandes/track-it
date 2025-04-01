import { FaMoon, FaSun } from 'react-icons/fa';
import styled from 'styled-components';

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SwitchWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Slider = styled.span<{ $isLightTheme: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.secondary};
  transition: .4s;
  border-radius: 34px;
  display: flex;
  align-items: center;
  justify-content: ${({ $isLightTheme }) => $isLightTheme ? 'flex-start' : 'flex-end'};
  padding: 0 6px;

  &:before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
    transform: ${({ $isLightTheme }) => $isLightTheme ? 'translateX(0)' : 'translateX(30px)'};
  }
`;

export const SunIcon = styled(FaSun)`
  color: ${({ theme }) => theme.colors.text};
  z-index: 1;
  margin-right: 4px;
`;

export const MoonIcon = styled(FaMoon)`
  color: ${({ theme }) => theme.colors.text};
  z-index: 1;
  margin-left: 4px;
`;