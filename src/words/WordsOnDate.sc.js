import styled from 'styled-components'

let Day = styled.div``

let Date = styled.div`
  font-size: small;
  font-weight: 600;
  margin-top: 2em;
`

let Article = styled.div`
  font-size: x-large;
`

let ArticleTitle = styled.div`
  font-size: large;
  font-weight: 600;

  margin-left: 0.3em;

  margin-top: 1em;
  margin-bottom: 1em;

  a {
    margin-left: 0.5em;
  }
  a:before {
    content: '[';
  }
  a:after {
    content: ']';
  }
`

export { Day, Date, ArticleTitle, Article }
