import styled from "styled-components";
import { zeeguuOrange, zeeguuVarmYellow } from "../components/colors";

let Word = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

let StarIcon = styled.div`
  cursor: pointer;
  color: ${zeeguuVarmYellow};

  margin-right: 0.3em;
  margin-left: 0.5em;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding-top: 10px;

  img {
    height: 26px;
  }
`;

let EditIcon = styled.div`
  cursor: pointer;
  margin-right: 0.3em;
  margin-left: 0.7em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 10px;

  img {
    height: 26px;
    width: 26px;
  }
`;

let EditIconNoPadding = styled.div`
  cursor: pointer;
  margin-right: 0.3em;
  margin-left: 0.7em;
  display: flex;
  flex-direction: column;
  justify-content: center;

  img {
    height: 26px;
    width: 26px;
  }
`;

let WordPair = styled.div`
  word-break: break-all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1em;

  .from {
    font-weight: 600;
  }
  .to {
    margin-top: 0px;
    margin-bottom: 0px;
    font-weight: 300;
  }
`;

let TrashIcon = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0.5em;
  padding-top: 10px;

  img {
    height: 30px;
  }
`;

let Importance = styled.div`
  color: ${zeeguuOrange};
  font-size: xx-small;

  .imp1 {
    color: #fbf4d8;
  }

  .imp2 {
    color: #f9e7bd;
  }

  .imp3 {
    color: #f6d6a2;
  }

  .imp10 {
    color: #bf1e06;
  }
  .imp9 {
    color: #bf1e06;
  }

  .imp8 {
    color: #f28750;
  }
  .imp7 {
    color: #f28750;
  }

  .imp6 {
    color: #f3a66c;
  }
  .imp5 {
    color: #f5c187;
  }

  .imp4 {
    color: #ffc187;
  }
`;

let Spacer = styled.div`
  margin-bottom: 20px;
`;

export {
  Word,
  TrashIcon,
  StarIcon,
  WordPair,
  Importance,
  Spacer,
  EditIcon,
  EditIconNoPadding,
};
//
