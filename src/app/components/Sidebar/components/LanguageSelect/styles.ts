import styled from 'styled-components';

export const LanguageSelectContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    color: ${({ theme }) => theme.colors.textPrimary};

    select {
        flex: 1;
        min-width: 0;
        padding: 0.25rem;
        border: none;
        color: ${({ theme }) => theme.colors.textPrimary};
        font-size: 0.85rem;
        background: none;
        cursor: pointer;
        font-family: inherit;
    }
`;

export const Select = styled.select``;
