import * as s from "./ArticleReader.sc";
//only visible if the article has authors (like is a teacher has written it), otherwise it is not rendered at all

export default function ArticleAuthors({ articleInfo }) {
  const firstAuthor = articleInfo.authors.split(",")[0].trim();

  if (!firstAuthor || firstAuthor === "") return <></>;
  return (
    <s.AuthorLinksContainer>
      <div>{firstAuthor}</div>
    </s.AuthorLinksContainer>
  );
}
