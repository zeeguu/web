import styled from "styled-components";
import { CEFR_LEVELS } from "../../../../assorted/cefrLevels";

const Modal = styled.div`
  position: fixed;
  z-index: 10;
  width: calc(100% - 40px);
  max-width: 442px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px 32px;
  background: #fff;
  border-radius: 15px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 38px;
`;

const Title = styled.h2`
  font-size: 18px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.01em;
  margin: 0;
`;

const Close = styled.button`
  padding: 0;
  cursor: pointer;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  display: grid;
  place-items: center;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const Recs = styled.div`
  margin-bottom: 40px;
`;

const TitleS = styled.p`
  margin: 0;
  margin-bottom: 12px;
  font-size: 15px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.02em;
`;

const RecsRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Creation = styled.div`
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1.18fr 2.6fr;
  grid-row-gap: 12px;
  & p {
    margin: 0;
    grid-column-start: 1;
    letter-spacing: 0.02em;
  }
`;

const Input = styled.input`
  padding: 0;
  padding-bottom: 5px;
  border: none;
  border-bottom: 0.5px solid #cbcbcb;
  font-size: 14px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.02em;
  outline: none;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  padding-right: 30px;
`;

const SaveButton = styled.button`
  font-size: 15px;
  cursor: pointer;
  line-height: calc(18 / 15);
  text-align: center;
  font-weight: 600;
  color: #fff;
  background: #df6b00;
  border-radius: 50px;
  padding: 11px 1em;
  flex-grow: 1;
  border: none;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const CancelButton = styled.button`
  flex-shrink: 0;
  cursor: pointer;
  color: #414141;
  font-size: 15px;
  line-height: calc(18 / 15);
  border: none;
  font-weight: 500;
  background: transparent;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

export {
  Modal,
  Top,
  Title,
  Close,
  Recs,
  TitleS,
  RecsRow,
  Creation,
  Input,
  Bottom,
  SaveButton,
  CancelButton,
};
