import styled from "styled-components";

import { CenteredContent } from "../reader/ArticleReader.sc";

import { formStyling } from "./formStyling.sc";

import * as u from "./usefulSnippets.sc";

import * as color from "./colors";

// Nice orange background
let PageBackground = styled.div`
  width: 100%;

  min-height: 100vh;

  /* not clear why if we don't do margin-top: -1em we end up with a white border! */
  margin-top: -1em;
  padding-top: 1em;

  padding-bottom: 1em;

  background: ${color.zeeguuOrange};
`;

// Elephant logo
let _verticalSpacer = "1em";
let _logoSize = "50px";

let LogoOnTop = styled.div`
  ${u.horizontalCentering}

  margin-top: ${_verticalSpacer};
  margin-bottom: ${_verticalSpacer};

  background-image: url("/static/images/zeeguuWhiteLogo.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: ${_logoSize} ${_logoSize};

  height: ${_logoSize};
`;

// White centered rounded cornders background
let FormContainer = styled.div`
  ${u.horizontalCentering}

  border-radius: 1em;
  padding: 0.5em;

  width: 85vw;
  padding: 1em;

  /* Desktop width  */
  @media (min-width: 768px) {
    width: 22em;
  }

  background-color: white;

  ${formStyling}
`;

let NarrowFormContainer = styled(FormContainer)`
  width: 16em;
`;

let FormTitle = styled.div`
  font-size: x-large;
  margin-bottom: 1em;
`;

let FormLink = styled.div`
  margin-top: -1.4em;
`;

let DeleteAccountButton = styled.button`
  border: 0px;
  background: white;
  margin-bottom: 3em;
  margin-top: 0em;
  overflow: hidden;
  cursor: pointer;
  span {
    font-weight: 600;
    font-size: 1.2em;
    text-decoration: none;
    font-weight: 500;
    color: ${color.zeeguuRed};
    &:hover {
      filter: brightness(120%);
    }
  }
`;

let FormButton = styled.button`
  height: 3em;
  padding: 0em 2em;
  background: ${color.zeeguuOrange};
  border: 0.3em solid ${color.zeeguuOrange};
  border-radius: 7em;
  margin-bottom: 2em;
  margin-top: 1em;
  overflow: hidden;
  cursor: pointer;
  span {
    font-weight: 600;
    font-size: 1.5em;
    color: white;
  }
  @media (min-width: 768px) {
    font-size: small;
  }
`;

export {
  PageBackground,
  FormContainer,
  NarrowFormContainer,
  CenteredContent,
  LogoOnTop,
  FormTitle,
  FormButton,
  DeleteAccountButton,
  FormLink,
};
