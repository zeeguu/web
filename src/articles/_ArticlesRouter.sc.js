import styled from "styled-components";

export const IconSpan = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.4em 0.25em;
  vertical-align: middle;
`;

export const FilterButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
`;

export const FilterButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding-left: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);

  &:hover {
    opacity: 0.7;
  }

  img {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const FilterDivider = styled.div`
  height: 1px;
  background-color: #ccc;
  margin: 1rem 0;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 0.2rem;
`;

export const ContentContainer = styled.div`
  min-height: 70vh;
`;
