// styles.ts
import { FaMoon } from "react-icons/fa6";
import { MdWbSunny } from "react-icons/md";


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

  
`;

export const Slider = styled.span<{ $isLightTheme: boolean }>`
  position: absolute;
  width: 4rem;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 1rem;
  bottom: 0;
  background: transparent !important;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  transition: .4s;
  border-radius: 34px;
  display: flex;
  align-items: center;
  justify-content: ${({ $isLightTheme }) => $isLightTheme ? 'flex-start' : 'flex-end'};
  padding: 0 6px;

  &:before {
    position: absolute;
    content: "";
    height: 1.5rem;
    width: 1.5rem;
    left: ${({ $isLightTheme }) => $isLightTheme ? '2.2rem' : '0.2rem'};
    bottom: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: .4s;
    border-radius: 50%;
  }
`;

export const SunIcon = styled(MdWbSunny) <{ $isLightTheme: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  z-index: 1;
  position: absolute;
  left: 2.4rem;
  width: 1.25rem;
  height: 1.25rem;
  opacity: ${({ $isLightTheme }) => $isLightTheme ? 0 : 1};
  transition: opacity 0.3s ease;
`;

export const MoonIcon = styled(FaMoon) <{ $isLightTheme: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  z-index: 1;
  position: absolute;
  right: 2.2rem;
  width: 1.25rem;
  height: 1.25rem;
  opacity: ${({ $isLightTheme }) => $isLightTheme ? 1 : 0};
  transition: opacity 0.3s ease;
`;