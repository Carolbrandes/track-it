'use client';

import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (min-width: 768px) {
    padding: 3rem 2rem 5rem;
  }
`;

export const Header = styled.header`
  margin-bottom: 2.5rem;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 1.5rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

export const LastUpdated = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray300};
  margin: 2.5rem 0;
`;

export const SectionGroup = styled.section`
  margin-bottom: 2.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SectionIntro = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

export const ArticleTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Paragraph = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 0.75rem;
`;

export const List = styled.ul`
  margin: 0.5rem 0 1rem;
  padding-left: 1.25rem;
`;

export const ListItem = styled.li`
  font-size: 0.95rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.35rem;
`;

export const EmailLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
