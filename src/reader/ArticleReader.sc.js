import styled from 'styled-components'

import { BigSquareButton } from '../components/Buttons.sc'

import * as color from '../components/colors'

let ArticleReader = styled.div`
  /* border: 1px solid lightgray; */
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;

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

  .arrow {
    content: '▼';
    color: #4f4f4f;
  }

  z-tag z-tran moreAlternatives:after {
    content: '▼';
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
    content: ' ';
    color: white;
  }

  .handContributed:after {
    content: ' ';
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

  z-tag z-tran[chosen]:after {
    content: attr(chosen);
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
`

let Toolbar = styled.div`
  /* border: 1px solid wheat; */
  position: sticky;
  background-color: white;
  right: 1em;
  height: 110px;
  top: -10px;

  display: flexbox;
  flex-direction: row;
  justify-content: flex-end;

  button {
    width: 55px;
    height: 55px;
    background-color: #ffe086;
    border-style: none;
    box-shadow: none;
    border-radius: 10px;
    margin: 10px;
    padding: 1px;
    user-select: none;
  }

  button:focus {
    outline: none;
  }

  button.selected {
    background-color: #ffbb54;
  }

  .tooltiptext {
    visibility: hidden;
    color: #ffbb54;
  }

  button:hover .tooltiptext {
    visibility: visible;
  }
`

let Title = styled.div`
  font-size: x-large;
  font-weight: 800;
  margin-top: 0.5em;
`

let BookmarkButton = styled.div`
  cursor: pointer;
  float: right;
  img {
    height: 1.4em;
  }

  .tooltiptext {
    visibility: hidden;
    color: #ffbb54;
  }

  :hover .tooltiptext {
    visibility: visible;
  }
`

let MainText = styled.div`
  font-size: 1.3em;
  line-height: 3em;
  padding: 0.2em;
`

let _BottomButton = styled(BigSquareButton)`
  width: 5em;
  height: auto;
  display: inline-block;
`

let CenteredContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

let WhiteButton = styled(_BottomButton)`
  background-color: white;
  color: orange !important;
`

let OrangeButton = styled(_BottomButton)`
  background-color: orange;
  width: 16em;
  display: flex;
  align-items: center;
  justify-content: center;
`

let FeedbackBox = styled.div`
  border: 1px solid lightgray;
  background-color: #f8f8f8;
  border-radius: 1em;
  padding: 1em;
  padding-bottom: 1em;
  margin-top: 3em;

  @media (min-width: 768px) {
    width: 30em;
  }
  margin-left: auto;
  margin-right: auto;
  h2 {
    text-align: center;
  }
  h4 {
    text-align: center;
  }
  .selected {
    background-color: ${color.lightOrange} !important;
    color: white !important;
  }
`

let ExtraSpaceAtTheBottom = styled.div`
  margin-bottom: 8em;
`

export {
  ArticleReader,
  Toolbar,
  Title,
  BookmarkButton,
  MainText,
  WhiteButton,
  OrangeButton,
  FeedbackBox,
  CenteredContent,
  ExtraSpaceAtTheBottom
}
