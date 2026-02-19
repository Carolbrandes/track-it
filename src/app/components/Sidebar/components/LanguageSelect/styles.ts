import styled from 'styled-components';

export const LanguageSelectContainer = styled.div`
    display: flex;
    align-items: center;

    select {
        max-width: 11rem;
        padding: 0.5rem;
        border: none;
        color: ${({ theme }) => theme.colors.textPrimary};
        font-size: 1rem;
        background: none;
        cursor: pointer;
    }
`;

export const Select = styled.select``;
