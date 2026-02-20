import styled, { keyframes } from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

export const Container = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  width: 520px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid ${({ theme }) => theme.colors.gray300};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};

  h3 {
    margin: 0;
    font-size: 1.15rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const Body = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// ─── Upload area ───

export const UploadArea = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2.5rem 1rem;
  border: 2px dashed ${({ theme }) => theme.colors.gray300};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.background};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}08;
  }

  input {
    display: none;
  }
`;

export const UploadIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary}14;
  color: ${({ theme }) => theme.colors.primary};
`;

export const UploadText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
`;

export const UploadHint = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
`;

// ─── Processing ───

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const ProcessingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.gray300};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// ─── Mode selector ───

export const ModeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ModeLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const ModeOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ModeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.gray300};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary + '14' : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// ─── Receipt info ───

export const ReceiptInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
`;

export const ReceiptStoreName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ReceiptDate = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ReceiptTotal = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 0.25rem;
`;

export const SuggestedCategory = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.15rem;
  font-style: italic;
`;

// ─── Items list ───

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ItemCard = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.gray300};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary + '0a' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ItemCheckbox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 4px;
  border: 2px solid ${({ $checked, theme }) =>
    $checked ? theme.colors.primary : theme.colors.gray300};
  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.primary : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  transition: all 0.15s;
`;

export const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemDescription = styled.div`
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemQuantity = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ItemAmount = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

// ─── Category + fixed ───

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const FormLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const EditableInput = styled.input`
  padding: 0.55rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }
`;

export const ItemEditableInput = styled.input`
  width: 100%;
  padding: 0.25rem 0.4rem;
  font-size: 0.85rem;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray300};
    background: ${({ theme }) => theme.colors.background};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}22;
  }
`;

export const TypeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

function getTypeColor(variant: 'expense' | 'income', theme: { colors: { danger: string; success: string } }) {
    return variant === 'expense' ? theme.colors.danger : theme.colors.success;
}

export const TypeButton = styled.button<{ $active: boolean; $variant: 'expense' | 'income' }>`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  border: 1px solid ${({ $active, $variant, theme }) =>
    $active ? getTypeColor($variant, theme) : theme.colors.gray300};
  background: ${({ $active, $variant, theme }) =>
    $active ? getTypeColor($variant, theme) + '14' : 'transparent'};
  color: ${({ $active, $variant, theme }) =>
    $active ? getTypeColor($variant, theme) : theme.colors.textSecondary};

  &:hover {
    border-color: ${({ $variant, theme }) => getTypeColor($variant, theme)};
  }
`;

// ─── Actions ───

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

export const PrimaryButton = styled.button`
  flex: 1;
  padding: 0.65rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  flex: 1;
  padding: 0.65rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
  background: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    opacity: 0.85;
  }
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.colors.danger}11;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.danger}33;
`;

export const SelectedCount = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;
