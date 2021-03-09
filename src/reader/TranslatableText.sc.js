import styled from "styled-components";

const TranslatableText = styled.div`
  z-tag {
    cursor: pointer;
    /* margin-right: 1em; */
    display: inline-block;
    margin: 0;
    line-height: 29px;
    /* background-color: greenyellow; */
  }

  z-tag.loading {
    animation: fadein 1s 0s infinite linear alternate;
  }

  /*  z-tag tag hover changes color, translated word hover no underline or color*/

  z-tag:hover {
    color: #ffbb54;
    border-bottom: 1px dashed #ffbb54;
    border: none;
  }

  /* the translation - above the origin word
   the font is thin until the user contributes or selects an alternative
   highlights the fact that we are not sure of the translation ...
   */

  z-tag z-tran {
    display: block;

    margin-top: -9px;
    margin-bottom: 0;

    padding: 2px;

    border-radius: 0.3em 0.3em 0.3em 0.3em;
    background-clip: padding-box;

    background-color: #ffe086;

    font-size: medium;
    line-height: 1em;
    max-width: 24em;
    font-weight: 300;
    color: #4f4f4f;
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
    border-bottom: 1px dashed #ffbb54;
    width: 100%;
    color: #ffbb54;
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
    color: #4f4f4f;
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
    transition: visibility 0s 2s, opacity 2s linear;
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

    background-color: lightgoldenrodyellow;
    /* background: #ffe086; */

    color: white;
    /* text-align: center; */

    border-radius: 0.3em;
    /* width: 8em; */
    /* padding: 0.3em; */
    margin-top: 0.5em;
    /* margin-top: 3.3em; */
  }

  .altermenu .additionalTrans {
    /* width: 100%; */
    height: 100%;
    text-transform: lowercase;
    white-space: normal;
    border-bottom: 1px solid #f8d486 !important;
    color: #383838;
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
    color: #484848;
    font-weight: 400;
    /* text-align: center; */
    border: none;
    padding: 0.3em;
    font-size: x-small;
    background: lightgoldenrodyellow;
  }
`;

export { TranslatableText };
