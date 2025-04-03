'use client';

import { useTheme } from '../../../../hooks/useTheme';
import * as S from './styles';

export const ThemeButton = () => {
    const { toggleTheme, isLightTheme } = useTheme();

    return (
        <S.SwitchContainer onClick={toggleTheme}>
            <S.SwitchWrapper>
                <S.SwitchInput
                    type="checkbox"
                    checked={!isLightTheme}
                    onChange={toggleTheme}
                    aria-label="Toggle theme"
                />
                <S.Slider $isLightTheme={isLightTheme}>
                    {isLightTheme ? (
                        <S.MoonIcon $isLightTheme={isLightTheme} size={14} />
                    ) : (
                        <S.SunIcon $isLightTheme={isLightTheme} size={14} />
                    )}
                </S.Slider>
            </S.SwitchWrapper>
        </S.SwitchContainer>
    );
};