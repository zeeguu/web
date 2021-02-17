import styled from 'styled-components'
import { veryPaleOrange } from './colors'

let TopMessage = styled.div`
  text-align: center;
  margin: auto;
  background-color: ${veryPaleOrange};
  border-radius: 0.9em;
  max-width: 80%;
  margin-bottom: 0.5em;

  p {
    padding: 0.4em 0.6em;
  }

  @media (min-width: 768px) {
    width: 36em;
  }
`

export { TopMessage }
