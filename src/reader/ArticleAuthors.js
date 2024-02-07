function multipleAuthors(authors_str) {
  return authors_str.split(",").length > 1;
}

export default function ArticleAuthors({ articleInfo }) {
const firstAuthor = articleInfo.authors.split(",")[0].trim();

  return (
    <div>
      {firstAuthor}
    </div>
  );
}