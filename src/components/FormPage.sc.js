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

let FormButton = styled.button`
  background-color: orange;
  padding: 0.5em 1em;
  border-radius: 4px;

  margin-bottom: 1em;
  margin-top: 1em;

  font-size: large;
  font-weight: 500;
  color: white;
  border: 1px solid yellow;

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
};
