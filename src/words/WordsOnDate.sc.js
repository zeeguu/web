import styled from "styled-components";

let Day = styled.div``;

let ContentOnRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.5em;
  button {
    margin: 0.2em;
  }
`;

let Date = styled.div`
  font-size: small;
  font-weight: 600;
  margin-top: 2em;
  margin-left: 1em;
`;

let Article = styled.div`
  margin-left: 1em;
`;

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
    content: "[";
  }
  a:after {
    content: "]";
  }
  @media (max-width: 400px) {
    font-size: medium;
  }
`;

export { Day, Date, ArticleTitle, Article, ContentOnRow };
