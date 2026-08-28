import styled from "styled-components";

// Title and subtitle on the left, the page's primary action on the right.
// Both teacher list pages use this; My Classrooms used to centre its title and
// park "Add Class" underneath, which made the two pages look unrelated.
export const TeacherPageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 2rem 0 1.25rem;
`;


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
