'use client';

import styled from 'styled-components';

const StyledDateInput = styled.input`
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: border-color 0.2s;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.7;
    filter: ${({ theme }) => theme.colors.text === '#ffffff' || theme.colors.text === '#f1f5f9' ? 'invert(1)' : 'none'};
  }
`;

interface DateInputProps {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly name?: string;
    readonly placeholder?: string;
    readonly required?: boolean;
    readonly className?: string;
}

export function DateInput({ value, onChange, name, placeholder, required, className }: DateInputProps) {
    return (
        <StyledDateInput
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            name={name}
            placeholder={placeholder}
            required={required}
            className={className}
        />
    );
}
