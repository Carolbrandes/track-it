"use client"

import styled from 'styled-components';
import * as CommonStyles from './styles/shared';

export const PageContainer = CommonStyles.PageContainer
export const Title = CommonStyles.Title;
export const Section = CommonStyles.Section;
export const SectionTitle = CommonStyles.SectionTitle;
export const LoadingIndicator = CommonStyles.LoadingIndicator;
export const ErrorMessage = CommonStyles.ErrorMessage;

export const PageLayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    gap: 3rem;
    
   @media (min-width: 1200px){
    display: grid;
    grid-template-columns: 15rem 1fr;
   }

`

