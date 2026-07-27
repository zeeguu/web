import styled from "styled-components";
import { blue400, blue600 } from "../components/colors";

// Topic pill styling for the modal's two example chips (dashed
// "inferred" and solid "gold"). Mirrors the styling still in use on
// VideoPreview so the explanations match what users see there.
const ModalContent = styled.div`
  text-align: left;
  line-height: 2em;
`;

const UrlTopics = styled.div`
  display: inline-block;
  cursor: default;
  margin-top: 1em;

  @media (max-width: 990px) {
    margin-bottom: 1.2em;
  }
`;

const TopicLabel = styled.span`
  cursor: default;
  display: inline-flex;
  align-items: center;
  height: 1.2em;
  margin-right: 0.5em;
  margin-left: 0.2em;
  margin-bottom: 0.5em;
  border-radius: 2em;
  padding: 0.4em 1.35em;
  font-size: 0.85em;
  font-weight: 500;
  text-align: center;
  vertical-align: middle;
  background-color: var(--tag-bg);
`;

const InferredTopic = styled(TopicLabel)`
  border: dashed 1px ${blue400};
`;

const GoldTopic = styled(TopicLabel)`
  border: solid 1px ${blue600};
`;

const CancelButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  padding: 0 0.2em;
  margin-bottom: 0;
`;

export { ModalContent, UrlTopics, InferredTopic, GoldTopic, CancelButton };
