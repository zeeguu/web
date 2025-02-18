import * as s from "./ArticleReader.sc";

export default function ArticleAuthors({ articleInfo }) {
  const firstAuthor = articleInfo.authors.split(",")[0].trim();

  if (!firstAuthor || firstAuthor === "") return <></>;
  return (
    <s.AuthorLinksContainer>
      <div>{firstAuthor}</div>
    </s.AuthorLinksContainer>
  );
}
