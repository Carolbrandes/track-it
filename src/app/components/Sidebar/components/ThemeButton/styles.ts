import { FaMoon } from "react-icons/fa6";
import { MdWbSunny } from "react-icons/md";
import styled from 'styled-components';

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SwitchWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 26px;
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Slider = styled.span<{ $isLightTheme: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.gray300};
  transition: .3s;
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: ${({ $isLightTheme }) => $isLightTheme ? 'flex-start' : 'flex-end'};
  padding: 0 4px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: ${({ $isLightTheme }) => $isLightTheme ? '25px' : '3px'};
    bottom: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: .3s;
    border-radius: 50%;
  }
`;

export const SunIcon = styled(MdWbSunny)<{ $isLightTheme: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  z-index: 1;
  position: absolute;
  left: 27px;
  width: 14px;
  height: 14px;
  opacity: ${({ $isLightTheme }) => $isLightTheme ? 0 : 1};
  transition: opacity 0.3s ease;
`;

export const MoonIcon = styled(FaMoon)<{ $isLightTheme: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  z-index: 1;
  position: absolute;
  right: 27px;
  width: 14px;
  height: 14px;
  opacity: ${({ $isLightTheme }) => $isLightTheme ? 1 : 0};
  transition: opacity 0.3s ease;
`;
