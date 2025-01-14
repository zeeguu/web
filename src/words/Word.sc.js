import styled from "styled-components";
import { zeeguuWarmYellow } from "../components/colors";

let Word = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-left: 0.5em;
  @media (max-width: 400px) {
    margin-left: 0.1em;
    font-size: 0.8em;
  }
`;

let StarIcon = styled.div`
  cursor: pointer;
  color: ${zeeguuWarmYellow};

  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0.3em;
  margin-right: 0.3em;
  padding-right: 0.5em;

  img {
    height: 26px;
  }
`;

let EditIcon = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin-left: 0.3em;
  margin-right: 0.3em;

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
  word-break: auto-phrase;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1em;
  margin-right: 1.5em;

  .from {
    font-weight: 600;
  }
  .to {
    margin-top: 0px;
    margin-bottom: 0px;
    font-weight: 300;
  }
`;

let WordPairSpellWhatYouHear = styled.div`
  word-break: auto-phrase;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1em;

  .from {
    font-size: 150%;
    font-weight: 700;
  }
  .to {
    margin-top: 0px;
    margin-bottom: 0px;
    font-weight: 300;
    font-size: 150%;
  }
`;
let AddRemoveStudyPreferenceButton = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 1em;
  img {
    height: 24px;
  }
`;
let TrashIcon = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin-right: 0.3em;

  img {
    height: 30px;
  }
`;

let Spacer = styled.div`
  margin-bottom: 20px;
`;

export {
  Word,
  AddRemoveStudyPreferenceButton,
  TrashIcon,
  StarIcon,
  WordPair,
  Spacer,
  EditIcon,
  EditIconNoPadding,
  WordPairSpellWhatYouHear,
};
//
