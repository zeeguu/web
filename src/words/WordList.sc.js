import styled from 'styled-components'

let Word = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  /* background-color: green; */
  margin-bottom: 10px;
  /* align-items: stretch; */
`

let StarIcon = styled.div`
  cursor: pointer;
  /* background-color: yellow; */
  color: yellow;

  margin-right: 0.3em;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding-top: 10px;

  img {
    height: 26px;
    /* background-color: red; */
  }
`

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
`

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
`

let Importance = styled.div`
  color: orange;
  font-size: xx-small;

  .imp1 {
    color: #fbf4d8;
  }

  .imp2 {
    color: #f9e7bd;
  }

  .imp3 {
    color: #f6d6a2;
  }

  .imp10 {
    color: #bf1e06;
  }
  .imp9 {
    color: #bf1e06;
  }

  .imp8 {
    color: #f28750;
  }
  .imp7 {
    color: #f28750;
  }

  .imp6 {
    color: #f3a66c;
  }
  .imp5 {
    color: #f5c187;
  }

  .imp4 {
    color: #ffc187;
  }
`

export { Word, TrashIcon, StarIcon, WordPair, Importance }
//
