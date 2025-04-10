'use client';
import * as S from '../../styles/shared';

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'radio-group' | 'custom';

export interface FormField {
  label: string;
  type: FieldType;
  name: string;
  value: string;
  onChange: (value: string | any) => void;
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

      {

        fields.map((field) => (
          <S.FormGroup key={field.name}>
            <S.Label htmlFor={field.name}>{field.label}</S.Label>

            {
              field.type === 'custom' ? (
                field.component
              ) :

                field.type === 'text' || field.type === 'number' || field.type === 'date' ? (
                  <S.Input
                    type={field.type}
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'select' ? (
                  <S.Input
                    as="select"
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
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
                        onClick={() => field.onChange(option.value)}
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