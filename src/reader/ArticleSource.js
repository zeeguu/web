export default function ArticleSource({ url }) {
  return (
    <div>
      {url && (
        <small>
          From: &nbsp;
          <a href={url} target="_blank" rel="noreferrer" id="source">
            {url.slice(0, 80) + (url.length > 80 ? "..." : "")}
          </a>
        </small>
      )}

      <br />
    </div>
  );
}
