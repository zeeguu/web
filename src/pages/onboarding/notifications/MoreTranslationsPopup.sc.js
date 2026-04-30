import styled from "styled-components";

const MoreTranslationImage = styled.img`
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

const ArrowIcon = styled.img`
  width: 20px;
  height: 20px;
  display: inline;
  margin: 0 4px;
  vertical-align: middle;
`;

const DeleteTranslationText = styled.b`
  @media (max-width: 576px) {
    display: block;
    
  }
`;

export { MoreTranslationImage, ArrowIcon, DeleteTranslationText };