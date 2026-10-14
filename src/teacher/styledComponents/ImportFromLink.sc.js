import styled from "styled-components";

export const ImportForm = styled.form`
  margin: 1rem 0;
  padding: 0.75rem;
  border-radius: 5px;
  background-color: var(--bg-secondary);

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.4rem;
  }

  .row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  input {
    flex: 1;
    min-width: 0;
    padding: 0.45rem 0.6rem;
    font-size: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  button {
    margin: 0;
  }

  .failed {
    margin: 0.5rem 0 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
`;
