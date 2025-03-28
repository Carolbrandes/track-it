import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            background: string;
            text: string;
            primary: string;
            hover: string;
            secondary: string;
            secondaryDark: string;
            secondary2: string
            danger: string;
            dangerDark: string;
            border: string
        };
    }
}