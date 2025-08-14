import styled from "styled-components";
import { zeeguuWarmYellow } from "../components/colors";

let Word = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
  width: ${props => props.compact ? 'auto' : '100%'};
  min-height: ${props => props.compact ? '30px' : '50px'};
  padding: ${props => props.compact ? '4px 8px' : '6px 0'};
  margin-bottom: ${props => props.compact ? '0' : '3px'};
  margin-right: ${props => props.compact ? '0.5em' : '0'};
  transition: all 1s ease-out;
  overflow: hidden;
  background-color: ${props => props.compact ? '#f8f9fa' : 'transparent'};
  border-radius: ${props => props.compact ? '4px' : '0'};
  border: ${props => props.compact ? '1px solid #e9ecef' : 'none'};

  &.removing {
    height: 0;
    min-height: 0;
    margin: 0;
    padding: 0;
    opacity: 0;
    transform: translateX(-20px);
  }

  @media (max-width: 800px) {
    margin-left: 0.1em;
    margin-right: 0.1em;
    font-size: 0.8em;
    gap: 0.5em;
    justify-content: flex-start;
    min-height: 40px;
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
  flex-direction: ${props => props.compact ? 'row' : 'column'};
  justify-content: center;
  align-items: ${props => props.compact ? 'center' : 'flex-start'};
  margin-left: ${props => props.compact ? '0.5em' : '1em'};
  margin-right: ${props => props.compact ? '0' : '1.5em'};
  gap: ${props => props.compact ? '0.3em' : '0'};
  font-size: ${props => props.compact ? '0.9em' : '1em'};

  .from {
    font-weight: 600;
  }
  .to {
    margin-top: 0px;
    margin-bottom: 0px;
    font-weight: 300;
    ${props => props.compact && 'color: #666;'}
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
