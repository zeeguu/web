import styled, { css } from "styled-components";

const VerticalAlignment = css`
  width: 100%;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: 768px) {
    align-items: stretch;
    .link {
      text-align: center;
      flex: 1;
    }
  }
`;

//default content alignment is horizontal for big screens
//and vertical for small screens
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  .link {
    margin: 0.5rem 0;
  }
  //enforces vertical alignment of its content for all screen sizes
  ${(props) =>
    props.contentAlignment === "vertical" &&
    css`
      ${VerticalAlignment}
    `}

  @media (max-width: 768px) {
    ${VerticalAlignment}
  }
`;

export { ButtonContainer };
