import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            background: string
            surface: string
            textPrimary: string
            textSecondary: string
            primary: string
            secondary: string
            terciary: string
            gray200: string
            gray300: string
            gray700: string
            danger: string
            success: string
            warning: string
        };
    }
}
