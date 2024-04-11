import styled from "styled-components";
import {
  almostBlack,
  zeeguuLightYellow,
  zeeguuOrange,
  zeeguuVeryLightYellow,
  translationHover,
  lightOrange,
} from "../components/colors";

const TranslatableText = styled.div`
  z-tag {
    white-space: break-spaces;
    cursor: pointer;
    /* margin-right: 1em; 
    padding-right: 0.3em;*/
    display: inline-block;
    margin: 0;
    line-height: 29px;
    /* background-color: greenyellow; */
  }

  z-tag.loading {
    animation: blink 1.5s linear infinite;
    color: ${zeeguuOrange};
  }
  @keyframes blink {
    0% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }

  /*  z-tag tag hover changes color, translated word hover no underline or color*/

  z-tag:hover {
    color: ${translationHover} !important;
    background-color: ${lightOrange};
  }

  /* the translation - above the origin word
   the font is thin until the user contributes or selects an alternative
   highlights the fact that we are not sure of the translation ...
   */

  z-tag z-tran {
    display: block;
    margin-top: -9px;
    margin-bottom: -4px;
    padding: 2px;
    border-radius: 0.3em 0.3em 0.3em 0.3em;
    background-clip: padding-box;
    background-color: ${zeeguuLightYellow};
    font-size: medium;
    line-height: 1em;
    max-width: 24em;
    font-weight: 300;
    color: ${almostBlack};
    text-transform: lowercase;
    text-align: center;
  }

  z-tag z-tran:hover {
    color: black;
  }

  /*
    the original word decoration; a simple dashed underline highlights
    the fact that we are not sure of the translation; underline becomes
    solid if the user selects an alternative, confirms this one, or
    uploads a new translation
*/
  z-tag z-orig {
    border-bottom: 1px dashed ${zeeguuOrange};
    width: 100%;
    color: ${zeeguuOrange};
  }

  /* when there are multiple translations, we mark this with a little
green downwards pointing triangle; we used to mark also single alternatives
 but for now there's no marking for them */

  z-tag z-tran moreAlternatives {
    font-size: 0.5em;
    float: right;
    width: 1em;
    padding-left: 0.5em;
  }

  z-tag z-tran moreAlternatives {
  }

  z-tran > .arrow {
    visibility: hidden;
    margin: 0;
    padding: 0;
  }
  z-tran:hover > .arrow {
    visibility: visible;
  }

  z-tag z-tran[chosen]:before {
    content: attr(chosen);
  }

  z-tag z-tran moreAlternatives:after {
    content: "▼";
    color: ${almostBlack};
  }

  /* once the user has
 - selected an alternative we change
  the class to handSelected
 - contributed their own alternative
  by typing (handContributing) we change
  the class to handContributed

  these classes currently show a mini
  animation
 */
  .handSelected,
  .handContributed {
    width: 1.5em;
    text-align: center;
  }

  .handSelected:after,
  .handContributed:after {
    display: hidden;
    opacity: 0.1;
    transition:
      visibility 0s 2s,
      opacity 2s linear;
  }

  .handSelected:after {
    content: " ";
    color: white;
  }

  .handContributed:after {
    content: " ";
    color: white;
  }

  /* When an alternative is selected or a translation is uploaded
we highlight this by changing the style of both the translation
(normal font weight) and origin (solid underline)

why? there are two selectedAltenative and contributedAlternative
classes for the origin... because at some point we were considering
distinguishing between the two types of contribution... eventually
that made the UI too heavy ... */

  .selectedAlternative,
  .contributedAlternativeTran {
  }

  .selectedAlternativeOrig,
  .contributedAlternativeOrig {
  }

  .altermenu {
    position: absolute;
    max-width: 30em;
    background-color: ${zeeguuVeryLightYellow};
    border-radius: 0.3em;
    margin-top: 0.5em;
  }

  .altermenu .additionalTrans {
    height: 100%;
    text-transform: lowercase;
    white-space: normal;
    border-bottom: 1px solid ${zeeguuLightYellow}!important;
    color: ${almostBlack};
    line-height: 1em;
    padding: 0.3em;
    border: none;
    cursor: pointer;
    font-size: medium;
  }

  .altermenu * {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 0.9em;
  }

  .alterMenuContainer {
    display: none;
  }

  .searchTextfieldInput {
    color: ${almostBlack};
    font-weight: 400;
    border: none;
    padding: 0.3em;
    font-size: x-small;
    background: ${zeeguuVeryLightYellow};
  }
`;

export { TranslatableText };
