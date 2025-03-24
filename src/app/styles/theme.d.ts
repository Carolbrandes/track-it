// src/styles/theme.d.ts
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            background: string;
            text: string;
            primary: string;
            hover: string;
            secondary: string; // Adicionando a variável 'secondary' aqui
        };
    }
}