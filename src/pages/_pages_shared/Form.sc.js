import styled from "styled-components";

/*
 * The gap between sections is set here and nowhere else. It used to be shared
 * with FormSection's own margin-bottom, so the distance a reader saw was two
 * numbers added together and neither could be reasoned about alone.
 *
 * 4rem against FormSection's 1rem between fields: the boundary has to beat what
 * the tallest field puts below itself. A CEFR row carries a two-line hint, and
 * at the old 2.5rem that hint was a bigger visual break than any section
 * boundary -- so the form read as an undifferentiated list with one arbitrary
 * chasm in the middle of its first group.
 */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  width: 100%;
  max-width: 38rem;
`;

export default Form;
