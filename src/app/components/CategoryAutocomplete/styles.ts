import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  max-height: 200px;
  overflow-y: auto;
`;

export const DropdownItem = styled.li<{ $isSelected: boolean }>`
  padding: 0.55rem 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.gray200 : 'transparent'};
  font-weight: ${({ $isSelected }) => ($isSelected ? '600' : '400')};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    background: ${({ theme }) => theme.colors.gray200};
  }
`;

export const CreateItem = styled.li`
  padding: 0.55rem 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray300};

  &:hover {
    background: ${({ theme }) => theme.colors.gray200};
  }
`;

export const EmptyItem = styled.li`
  padding: 0.55rem 0.75rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;
