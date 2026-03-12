'use client';
import React from 'react';
import { NumberFormatValues } from 'react-number-format';
import { cn } from '@/app/lib/cn';


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
    <form className="flex flex-col gap-4 mb-8" onSubmit={handleSubmit}>
      {error && (
        <div className="text-danger bg-surface p-4 rounded-lg mb-4 border border-danger">
          {error}
        </div>
      )}

      {fields.map((field) => (
        <div className="flex flex-col gap-2" key={field.name}>
          <label className="font-semibold text-sm text-text-secondary" htmlFor={field.name}>
            {field.label}
          </label>

          {field.type === 'custom' ? (
            <React.Fragment>
              {field.component}
            </React.Fragment>
          ) : field.type === 'text' || field.type === 'number' || field.type === 'date' ? (
            <input
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-[0.95rem] bg-surface text-text-primary transition-[border-color] duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13] placeholder:text-text-secondary"
              type={field.type}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              placeholder={field.placeholder}
            />
          )
            : field.type === 'select' ? (
              <select
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-[0.95rem] bg-surface text-text-primary transition-[border-color] duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13] placeholder:text-text-secondary"
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
              </select>
            ) : field.type === 'radio-group' ? (
              <div className="flex gap-2 my-2">
                {field.options?.map((option) => (
                  <button
                    key={option.value}
                    className={cn(
                      "px-4 py-2 rounded-full cursor-pointer transition-all duration-200 font-[inherit] border",
                      field.value === option.value
                        ? "bg-primary text-white border-primary font-semibold"
                        : "bg-gray-200 text-text-secondary border-gray-300 hover:bg-gray-300"
                    )}
                    type="button"
                    name={field.name}
                    onClick={() => handleRadioChange(field, option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
        </div>
      ))}

      <button
        className={cn(
          "px-5 py-2.5 border-none rounded-lg cursor-pointer transition-all duration-200 w-fit font-medium hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-70",
          "bg-primary text-white"
        )}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : submitText}
      </button>
    </form>
  );
}
