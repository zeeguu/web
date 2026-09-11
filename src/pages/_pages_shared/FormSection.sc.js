import styled from "styled-components";

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* Between the fields of one section. What separates the sections themselves is
     Form's gap, which owns that distance alone -- see the note there. */
  gap: 1rem;
  margin: 0;
`;

export default FormSection;
