'use client';
import React from 'react';
import { NumberFormatValues } from 'react-number-format';
import * as S from '../../styles/shared';


export type FieldType = 'text' | 'number' | 'date' | 'select' | 'radio-group' | 'custom';

export type FieldValue = string | number;
export interface FormField {
  label: string;
  type: FieldType;
  name: string;
  value: FieldValue;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAmountChange?: (values: NumberFormatValues) => void;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  component?: React.ReactNode;
}
interface FormProps {
  fields: FormField[];
  onSubmit: () => void;
  submitText: string;
  isSubmitting?: boolean;
  error?: string | null;
}

export default function Form({
  fields,
  onSubmit,
  submitText,
  isSubmitting = false,
  error = null
}: FormProps) {
  const handleRadioChange = (field: FormField, value: string) => {
    if (field.onChange) {
      // Create a synthetic event
      const syntheticEvent = {
        target: { name: field.name, value },
      } as React.ChangeEvent<HTMLInputElement>;
      field.onChange(syntheticEvent);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };



  return (
    <S.Form onSubmit={handleSubmit}>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

      {fields.map((field) => (
        <S.FormGroup key={field.name}>
          <S.Label htmlFor={field.name}>{field.label}</S.Label>

          {field.type === 'custom' ? (
            <React.Fragment>
              {field.component}
            </React.Fragment>
          ) : field.type === 'text' || field.type === 'number' || field.type === 'date' ? (
            <S.Input
              type={field.type}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              placeholder={field.placeholder}
            />
          )
            : field.type === 'select' ? (
              <S.Input
                as="select"
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={(e) => field.onChange && field.onChange(e)}
                required={field.required}
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </S.Input>
            ) : field.type === 'radio-group' ? (
              <S.RadioGroup>
                {field.options?.map((option) => (
                  <S.RadioButton
                    key={option.value}
                    $active={field.value === option.value}
                    type="button"
                    name={field.name}
                    onClick={() => handleRadioChange(field, option.value)}
                  >
                    {option.label}
                  </S.RadioButton>
                ))}
              </S.RadioGroup>
            ) : null}
        </S.FormGroup>
      ))}

      <S.Button $primary type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : submitText}
      </S.Button>
    </S.Form>
  );
}