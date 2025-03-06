import styled, { css } from "styled-components";

const ButtonContainer = styled.div`
  text-align: center;
  width: 100%;
  display: flex;
  gap: 1.5rem;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;

  ${(props) =>
    props.buttonCountNum === 1 &&
    css`
      justify-content: center;
    `}

  ${(props) =>
    props.buttonCountNum > 1 &&
    css`
      justify-content: space-between;
    `}

  @media (max-width: 576px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export default ButtonContainer;
