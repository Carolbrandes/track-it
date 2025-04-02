import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            background: string
            textPrimary: string
            textSecondary: string
            primary: string
            secondary: string
            gray200: string
            gray300: string
            gray700: string
            danger: string
            success: string
        };
    }
}