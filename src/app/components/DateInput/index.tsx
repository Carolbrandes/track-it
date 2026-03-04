'use client';

import { useDateFormat } from '../../contexts/DateFormatContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { format, isValid, parse } from 'date-fns';
import { useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import styled from 'styled-components';

const StyledInput = styled(PatternFormat)`
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
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    name?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export function DateInput({ value, onChange, name, placeholder, required, className }: DateInputProps) {
    const { dateFormat } = useDateFormat();
    const { locale } = useTranslation();
    const [displayFormat, setDisplayFormat] = useState('MM/dd/yyyy');

    useEffect(() => {
        if (dateFormat === 'dd/mm/yyyy') {
            setDisplayFormat('dd/MM/yyyy');
        } else if (dateFormat === 'mm/dd/yyyy') {
            setDisplayFormat('MM/dd/yyyy');
        } else {
            // Default/long fallback: depend on locale
            if (locale === 'pt' || locale === 'es') {
                setDisplayFormat('dd/MM/yyyy');
            } else {
                setDisplayFormat('MM/dd/yyyy');
            }
        }
    }, [dateFormat, locale]);

    const getDisplayValue = () => {
        if (!value) return '';
        
        // Handle YYYY-MM-DD string explicitly to avoid timezone issues
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [year, month, day] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (isValid(date)) {
                return format(date, displayFormat);
            }
        }
        
        // Fallback for Date objects or other formats if needed
        const dateObj = new Date(value);
        if (isValid(dateObj)) {
            return format(dateObj, displayFormat);
        }
        
        return '';
    };

    const handleValueChange = (values: { formattedValue: string; value: string }) => {
        const { formattedValue } = values;
        
        // If empty, clear value
        if (!formattedValue || formattedValue.trim() === '') {
            onChange('');
            return;
        }

        // Try to parse the formatted value back to a date
        const parsedDate = parse(formattedValue, displayFormat, new Date());
        
        if (isValid(parsedDate) && formattedValue.length === 10) {
            // Check year range sanity if needed
            if (parsedDate.getFullYear() > 1900 && parsedDate.getFullYear() < 2100) {
                const yyyy = format(parsedDate, 'yyyy-MM-dd');
                onChange(yyyy);
            }
        }
    };

    return (
        <StyledInput
            format={displayFormat.replace(/[dmy]/gi, '#')}
            mask="_"
            value={getDisplayValue()}
            onValueChange={handleValueChange}
            placeholder={placeholder || displayFormat.toLowerCase()}
            name={name}
            className={className}
            required={required}
        />
    );
}
