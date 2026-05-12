import styled from "styled-components";

const TranslationImage = styled.img`
  width: min(100%, 300px);
  display: block;
  margin-top: 20px;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  object-fit: contain;

    @media (max-width: 576px) {
      width: min(100%, 280px);
    }
`;

export { TranslationImage };
