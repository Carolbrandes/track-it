"use client"

import styled from 'styled-components';
import * as CommonStyles from './styles/shared';

export const PageContainer = CommonStyles.PageContainer
export const Title = CommonStyles.Title;
export const Section = CommonStyles.Section;
export const SectionTitle = CommonStyles.SectionTitle;
export const LoadingIndicator = CommonStyles.LoadingIndicator;
export const ErrorMessage = CommonStyles.ErrorMessage;

interface PageLayoutContainerProps {
    $isLoginPage: boolean
}

export const TitleRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;

    ${CommonStyles.Title} {
        margin-bottom: 0;
    }
`;

export const ButtonRow = styled.div`
    display: flex;
    gap: 0.5rem;
`;

export const AddButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.55rem 1.1rem;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.2s;
    white-space: nowrap;

    &:hover {
        opacity: 0.88;
    }
`;

export const ScanButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.55rem 1.1rem;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
        background: ${({ theme }) => theme.colors.primary};
        color: #fff;
    }
`;

export const PageLayoutContainer = styled.div<PageLayoutContainerProps>`
    display: flex;
    flex-direction: column;
    justify-content: ${(props) => props.$isLoginPage ? 'center' : 'flex-start'};
    min-height: 100vh;
    padding-top: ${(props) => props.$isLoginPage ? '0' : '60px'};
    background-color: ${({ theme }) => theme.colors.background};
`
