import styled from "styled-components";

let Word = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  /* background-color: green; */
  margin-bottom: 10px;
  /* align-items: stretch; */
`;

let StarIcon = styled.div`
  cursor: pointer;
  /* background-color: yellow; */
  color: yellow;

  margin-right: 0.3em;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding-top: 10px;

  margin-left: 2em;

  img {
    height: 26px;
    /* background-color: red; */
  }
`;

let WordPair = styled.div`
  /* color: rebeccapurple; */
  /* background-color: #f0f0f0; */

  word-break: break-all;

  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1em;
  font-weight: 600;

  p {
    margin-top: 0px;
    font-weight: 300;
  }
`;

let TrashIcon = styled.div`
  cursor: pointer;

  /* background-color: #e0e0e0; */

  display: flex;
  flex-direction: column;

  justify-content: center;

  margin-left: 0.5em;

  padding-top: 10px;

  img {
    height: 30px;
    /* background-color: red; */
  }
`;

export { Word, TrashIcon, StarIcon, WordPair };
//
