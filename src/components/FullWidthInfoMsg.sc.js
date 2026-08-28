import styled from "styled-components";

// Third of the FullWidth*Msg family, beside FullWidthErrorMsg (red) and
// FullWidthConfirmMsg (green): the neutral "you should know this" variant.
// --infobox-bg is theme-aware, so it holds up in dark mode.
const FullWidthInfoMsg = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 0.3rem;
  color: var(--text-primary);
  background-color: var(--infobox-bg);
  font-weight: 500;
`;

export default FullWidthInfoMsg;
