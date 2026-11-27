import styled from "styled-components";

const PageBody = styled.div`
  width: 100%;
  max-width: 34rem;
  margin: 0 auto;
  text-align: left;
`;

const Section = styled.section`
  width: 100%;
  margin-bottom: 1.8em;
`;

const SectionHeader = styled.h2`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 0.4em;
`;

const OptionRow = styled.div`
  margin-bottom: 0.6em;
`;

const OptionText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.25rem 0;
`;

const OptionLabel = styled.span`
  font-weight: 500;
`;

const OptionDescription = styled.span`
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--text-secondary);
`;

export { PageBody, Section, SectionHeader, OptionRow, OptionText, OptionLabel, OptionDescription };
