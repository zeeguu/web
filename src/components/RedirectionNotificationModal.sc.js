import { ModalWrapper } from "./ModalWrapper.sc"; //factored out MyBox
import { zeeguuDarkOrange } from "./colors";
import { OrangeRoundButton } from "./allButtons.sc";
import styled from "styled-components";

//TODO: after deciding on the final modal styling - this file and the ExtensionMessage.sc
//could be merged together into one universal component

const RedirectionNotificationModalWrapper = styled(ModalWrapper)`
  h1 {
    line-height: 150%;
    margin: 0;
    @media (max-width: 576px) {
      text-align: left;
    }
  }

  p {
    //TODO: write reasons for this line-height settings
    line-height: 150%;
    text-align: left;
    font-size: 1em;
    margin: 0;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 2em;
  margin: 2em 0;
`;

const Icon = styled.div`
  height: 16px;
  width: 16px;
  margin: 0 0.2em;
  display: inline-block;
`;

//redesigned button for a better focal point and improved
//readability of the text inside it.
//TODO: After implementing all the onboarding steps,
//create style quide for all buttons and refactor / factor them out
const GoToArticleButton = styled(OrangeRoundButton)`
  padding: 0.8em 2em;
  border-radius: 4em;
  font-weight: 700;
  border-bottom: solid 0.2em ${zeeguuDarkOrange};
`;

const CloseButton = styled.div`
  cursor: pointer;
  padding: 1px;
  text-align: right;
  position: absolute;
  float: right;
  right: 16px;
  margin-top: -32px;
`;

export {
  RedirectionNotificationModalWrapper,
  CloseButton,
  GoToArticleButton,
  BodyContainer,
  Icon,
};
