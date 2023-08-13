import { ModalWrapper } from "./ModalWrapper.sc"; //factored out MyBox
import { zeeguuDarkOrange } from "./colors";
import { OrangeRoundButton } from "./allButtons.sc";
import styled from "styled-components";

//TODO: Merge this and the ExtensionMessage.sc into one component (ExtensionModal.sc for instance)
//as they share a lot of simillar code.

const RedirectionNotificationModalWrapper = styled(ModalWrapper)`
  h1 {
    line-height: 150%;
    margin: 0;
    @media (max-width: 576px) {
      text-align: left;
    }
  }

  p {
    line-height: 150%;
    text-align: left;
    font-size: 1em;
    margin: 0;
  }
`;

const Header = styled.div`
  margin: 1em 0;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
  margin: 1em 0;
  .fullDivWidthImage {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  margin: 1em 0;
  a:hover {
    text-decoration: underline;
  }
`;

const Icon = styled.div`
  height: 1em;
  width: 1em;
  margin: 0 0.2em;
  display: inline-block;
`;

//redesigned button for a better focal point and improved
//readability of the text inside it.
//TODO: After implementing all the onboarding steps,
//create style quide for all buttons and refactor / factor them out
const GoToArticleButton = styled(OrangeRoundButton)`
  padding: 0.7em 2em;
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
  margin-top: -16px;
`;

export {
  RedirectionNotificationModalWrapper,
  CloseButton,
  GoToArticleButton,
  Icon,
  Header,
  Body,
  Footer,
};
