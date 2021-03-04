import { css } from 'styled-components'

let formStyling = css`
  input,
  select {
    border: 1px solid #ffbb54;
    border-radius: 5px;

    color: #222222;
    margin-bottom: 1em;
    font-size: large;

    padding: 0.5em 0.5em;
    width: 90%;

    @media (min-width: 768px) {
      width: 80%;
      padding: 0.5em 0.5em;
      font-size: 0.8em;
    }
  }

  label {
    display: block;

    margin-bottom: 0.5em;

    @media (min-width: 768px) {
      font-size: 0.8em;
    }
  }

  p {
    @media (min-width: 768px) {
      font-size: 0.8em;
    }
  }

  input:focus {
    border: 2px solid #ffbb54;
    outline: none;
  }

  .error {
    background-color: lightyellow;
    border: 1px solid orange;
    color: red;
    border-radius: 5px;

    margin-bottom: 1em;
    padding: 0.4em;
  }
  .inputField {
    @media (min-width: 768px) {
      margin-left: 1em;
    }
  }
`

export { formStyling }
