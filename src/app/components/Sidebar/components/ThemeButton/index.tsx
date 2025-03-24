'use client'

import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from 'styled-components';
import { lightTheme } from '../../../../styles/theme';


export const ThemeButton = () => {
    const theme = useTheme()

    return (
        <>
            {theme === lightTheme ? <FaMoon size={20} /> : <FaSun size={20} />}
            <span style={{ marginLeft: '10px' }}>
                {theme === lightTheme ? 'Dark Theme' : 'Light Theme'}
            </span>
        </>
    );
};
