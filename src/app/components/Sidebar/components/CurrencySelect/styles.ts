import styled from "styled-components";

export const CurrencySelect = styled.div`
    display: flex;
    align-items: center;

    select{
        max-width: 11rem;
        padding: 0.5rem; 
        border:none;
        color: ${({ theme }) => theme.colors.textPrimary};
        font-size: 1rem;
        background: none;
    }
`