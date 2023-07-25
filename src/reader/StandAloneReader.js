import ArticleReader from "./ArticleReader";

export default function StandAloneReader({ api }) {
  return (
    <div id="scrollHolder">
      <ArticleReader api={api} />
    </div>
  );
}
