import styled from "styled-components";

// The teacher dashboard's page heading. Deliberately not components/PageTitle,
// which is centred and light-weight for the student-facing pages; these screens
// read as a working list, so the heading is left-aligned and sits in a row with
// the page's primary action.
export const TeacherPageHeading = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
`;

// The muted line that sits under the heading: which language, how many
// students, how many texts. Both teacher page headers use it.
export const TeacherPageSubtitle = styled.div`
  margin-top: 0.15rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;
