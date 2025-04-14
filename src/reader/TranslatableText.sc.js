import styled from "styled-components";
import { almostBlack, zeeguuOrange, zeeguuTransparentMediumOrange } from "../components/colors";

const TranslatableText = styled.div`
  z-tag {
    white-space: break-spaces;
    cursor: pointer;
    display: inline-block;
    margin: 0;
    line-height: 29px;
    /* background-color: greenyellow; */
  }

  z-tag.number {
    cursor: default;
    &:hover {
      background-color: rgb(255 255 255 / 0%) !important;
    }
  }

  z-tag.punct {
    margin-left: -5.2px;
  }

  z-tag.no-hover {
    cursor: default;
    &:hover {
      background-color: rgb(255 255 255 / 0%) !important;
    }
  }

  z-tag.left-punct {
    margin-left: 0px;
    margin-right: -5px;
  }

  z-tag.no-space {
    margin-right: -5px;
  }

  z-tag.no-margin {
    margin: 0px !important;
  }

  .loading {
    animation: blink 0.75s linear infinite alternate;
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
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-decoration-color: rgb(255, 229, 158); /*${zeeguuTransparentMediumOrange};*/
  }

  /* the translation - above the origin word
   the font is thin until the user contributes or selects an alternative
   highlights the fact that we are not sure of the translation ...
   */

  z-tran {
    margin-right: 0px !important;
    margin-left: 2px !important;
  }

  z-tag z-tran {
    margin-right: -0.2rem;
    margin-left: -0.2rem;
    margin-bottom: -0.3rem;
    margin-top: 0.1rem;
    padding-left: 0.3rem;
    border-radius: 0.3em 0.3em 0.3em 0.3em;
    background-clip: padding-box;
    background-color: rgb(255 229 158 / 100%);
    font-size: 14px;
    line-height: 1.1rem;
    max-width: 100%;
    font-weight: 600;
    color: ${almostBlack};
    text-transform: lowercase;
    text-align: left;
    display: flex;
  }

  z-orig span {
    border-bottom: 1px dashed ${zeeguuOrange};
    border-radius: 0.35rem;
    padding-left: 0.3rem;
    margin-left: 0.3rem;
  }

  z-tag z-orig {
    width: 100%;
    color: ${zeeguuOrange};
    font-weight: 600;
  }

  .translationContainer {
    display: flex;
    width: 100%;
    align-items: center;
    margin-right: 2px;

    .arrow {
      margin-left: 0.1rem;
      padding-top: 0.1rem;
      padding-right: 0.2rem;
      filter: opacity(50%);
      :hover {
        filter: brightness(1.5);
        filter: opacity(100%);
      }
    }

    .translation-icon {
      font-size: 17px;
    }

    .unlink {
      margin: 0px 0.1rem;
      margin-left: auto;
      padding: 0.2rem 0.3rem;
      padding-left: -0.3rem;
    }

    .low-oppacity {
      filter: opacity(20%);
      :hover {
        filter: brightness(1.5);
        filter: opacity(100%);
      }
    }

    .hide {
      margin: 0px 0.1rem;
      margin-left: -4px;
      padding: 0.2rem 0.3rem;
    }
  }

  .handSelected,
  .handContributed {
    width: 1.5em;
    text-align: center;
  }

  .handSelected:after,
  .handContributed:after {
    display: none;
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
`;

export { TranslatableText };
