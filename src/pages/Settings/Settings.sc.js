import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  padding-left: 1em;
  padding-right: 1em;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Version = styled.div`
  font-size: 0.75rem;
  color: var(--text-faint);
  text-align: center;
  margin-bottom: 2rem;
`;

export { StyledWrapper, Version };
