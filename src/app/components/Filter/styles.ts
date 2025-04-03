import styled from "styled-components";

export const FilterContainer = styled.div`
  .filterButtonContainer {
    display: flex;
    justify-content: end;
    gap: 1rem;
    margin-bottom: 2rem;

    button {
      background: transparent;
      border: 1px solid ${({ theme }) => theme.colors.primary};
      height: 2rem;
      width: 2rem;
      border-radius: 8px;
    }
  }
`

export const FilterForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 1200px){
    display: grid;
    grid-template-columns: repeat(5, 1fr);

  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 4px;
  width: 100%;
`;

export const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 4px;
  width: 100%;
`;

export const ResetButton = styled.button`
  background-color: #f0f0f0; 
  color: #007bff; 
  border: 1px solid #007bff;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;

 
  &:hover {
    background-color: #007bff; 
    color: #fff;
    border-color: #0056b3; 
  }

 
  &:disabled {
    background-color: #e0e0e0;
    color: #b0b0b0;
    border-color: #b0b0b0;
    cursor: not-allowed;
  }
`;
