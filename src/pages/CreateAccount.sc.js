import styled from 'styled-components'

import { NarrowColumn, CenteredContent } from '../reader/ArticleReader.sc'
import { OrangeButton, WhiteButton } from '../reader/ArticleReader.sc'

let CreateAccountPage = styled.div`
  background: #ffbb54;
  top: 0px;
  position: fixed;
  width: 100%;
  overflow-y: scroll;
  display: block;
  height: 100vh;
`

let WhiteNarrowColumn = styled(NarrowColumn)`
  background-color: white;
  border-radius: 1em;
  padding: 0.5em;
  margin-top: 20px;
  width: 80vw;
  padding-bottom: 150px;

  @media (min-width: 768px) {
    width: 22em;
    padding: 1em;
  }

  input,
  select {
    border: 1px solid #ffbb54;
    border-radius: 5px;

    padding: 0.2em 0.3em;
    color: #333333;
    margin-bottom: 1em;
    font-size: large;

    @media (min-width: 768px) {
      width: 22em;
      padding: 0.3em 0.5em;
      font-size: 0.6em;
    }
  }

  input:focus {
    border: 2px solid #ffbb54;
    outline: none;
  }

  .error {
    background-color: yellow;
    color: red;
    border-radius: 5px;
    font-size: small;
    margin-bottom: 1em;
    padding: 0.4em;
  }
  .inputField {
    @media (min-width: 768px) {
      margin-left: 1em;
    }
  }
`

export { CreateAccountPage, WhiteNarrowColumn, CenteredContent, OrangeButton }
