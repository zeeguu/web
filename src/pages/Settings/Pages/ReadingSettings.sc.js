import styled from "styled-components";

// Main centres its children, which would leave each row starting at its own
// intrinsic width — a ragged left edge down the page. One constrained column
// that IS full-width inside Main gives every section a single left edge.
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

// Label and description are passed to ToggleOption as ONE label node, so the
// description sits inside the <label>: it lines up with the label text without
// a hand-tuned indent, and it is part of the switch's tap target rather than
// dead text beside it.
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

// The text-size stepper is not a toggle, so its description is placed by hand.
const SizeRow = styled.div`
  margin-top: 0.6em;
`;

const SizeDescription = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--text-secondary);
  margin-top: 0.2em;
`;

export { PageBody, Section, SectionHeader, OptionRow, OptionText, OptionLabel, OptionDescription, SizeRow, SizeDescription };
