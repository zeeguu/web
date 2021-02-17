import styled from 'styled-components'

const RoundButton = styled.div`
  user-select: none;
  display: inline-block;

  margin-right: 0.25em;
  border-radius: 1.0625em;
  padding: 0.3125em 1.1875em;

  background-color: lightgray;
  color: #ffffff !important;
  font-weight: 500;
  text-align: center;

  cursor: pointer;
  margin-top: 3px;
  box-sizing: border-box;
`

const OrangeRoundButton = styled(RoundButton)`
  background-color: #ffbb54;
`

const ClosePopupButton = styled.div`
  height: 1.2em;
  width: 1.2em;
  border-radius: 50%;
  float: right;
  cursor: pointer;
  background-color: orange;
  color: white;
  font-size: 0.8em;
  padding: 0.1em;
  font-weight: 400;
`

const BigSquareButton = styled(RoundButton)`
  margin: 5px;
  width: 180px;
  height: 45px;
  border-color: #ffbb54;
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  font-size: 18px;
`

export { RoundButton, OrangeRoundButton, BigSquareButton, ClosePopupButton }
