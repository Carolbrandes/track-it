// components/ThemeButton.tsx
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
                        <S.MoonIcon size={14} />
                    ) : (
                        <S.SunIcon size={14} />
                    )}
                </S.Slider>
            </S.SwitchWrapper>
        </S.SwitchContainer>
    );
};