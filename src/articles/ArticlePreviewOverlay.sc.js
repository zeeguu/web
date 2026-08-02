import styled from "styled-components";

// Scrollable body of the preview overlay. The MUI Modal wrapper already caps
// height at 80% and scrolls; this just lays the pieces out in a column.
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// Interactive title. Same size as the summary below ("equally large"): the
// whole point of the overlay is comfortable per-word tapping, so nothing
// shrinks vs the card — this matters most on the phone. Weight, not size,
// distinguishes the title.
const Title = styled.div`
  font-size: 1.4em;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text-primary);
  padding-right: 1.5em; /* clear the Modal's close × */
`;

const Image = styled.img`
  width: 100%;
  max-height: 15em;
  object-fit: cover;
  border-radius: 0.75em;
  margin: 0.9em 0 0.3em;
`;

// Interactive summary body — equally large as the title. Generous line-height
// for comfortable tapping of individual words, especially on the phone.
const Summary = styled.div`
  font-size: 1.4em;
  line-height: 1.6;
  color: var(--text-primary);
  margin-top: 0.6em;
`;

// Action row pinned under the content, separated by a hairline. Wraps on
// narrow screens so Read full / Open original / Save never overflow.
const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6em;
  margin-top: 1.2em;
  padding-top: 0.9em;
  border-top: 1px solid var(--border-subtle, rgba(128, 128, 128, 0.25));
`;

export { Container, Title, Image, Summary, Actions };
