import styled, { css } from "styled-components";

const VerticalAlignment = css`
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  .link {
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 0;
  }

  //inner padding that controlls width of full-width buttons
  &.padding-medium {
    padding: 0 3.25rem 0 3.25rem;
    @media (max-width: 768px) {
      padding: 0;
    }
  }

  &.padding-large {
    padding: 0 7.75rem 0 7.75rem;
    @media (max-width: 768px) {
      padding: 0;
    }
  }
`;

const HorizontalAlignment = css`
  flex-direction: row;
  align-items: center;
  padding: 0;
  @media (max-width: 768px) {
    ${VerticalAlignment}
  }
`;

//default content alignment is vertical
const ButtonContainer = styled.div`
  overflow: hidden;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  white-space: nowrap;
  ${VerticalAlignment}

  &.adaptive-alignment-horizontal {
    ${HorizontalAlignment}
  }

  .link {
    margin: 0.5rem 0;
  }
`;

export default ButtonContainer;
