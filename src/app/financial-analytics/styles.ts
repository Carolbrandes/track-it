'use-client';

import styled from 'styled-components';

// Container for the entire chart section
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
`;

export const ChartWrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 2rem;

  @media (min-width: 1200px){
    flex-direction: row;
  }
`

// Title for the chart section
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

// Filter controls container
export const FilterContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 800px;
`;

// Filter group (label + select)
export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

// Filter label
export const FilterLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #555;
`;

// Filter select dropdown
export const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

// Wrapper for each individual chart
export const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

// Title for each pie chart
export const ChartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 1rem;
`;

// Container for the legend (below each pie chart)
export const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  width: 100%;
`;

// Each legend item (category and percentage)
export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: #555;
`;

// Color box in the legend
export const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background-color: #ccc;
`;

// Chart wrapper when the chart is loading
export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
  font-size: 1.5rem;
  color: #888;
`;

// Pie chart container (ensuring it doesn't distort when resized)
export const ChartContainer = styled.div`
  width: 100%;
  max-width: 700px;
  height: 400px;
  position: relative;
`;