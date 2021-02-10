import styled from "styled-components";

import { sideBarWidthDesktop } from "../components/SideBar.sc";

let ArticleReader = styled.div`
  /* border: 1px solid lightgray; */
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
`;

let Toolbar = styled.div`
  /* border: 1px solid wheat; */
  position: sticky;
  background-color: white;
  right: 1em;
  height: 110px;
  top: -1px;

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
`;

let Title = styled.div`
  font-size: xx-large;
`;

let BookmarkButton = styled.div`
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
`;

let MainText = styled.div`
  font-size: 1.3em;
  line-height: 3em;
  padding: 0.2em;
  padding-bottom: 8em;
`;

export { ArticleReader, Toolbar, Title, BookmarkButton, MainText };
