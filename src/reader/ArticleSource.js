export default function ArticleSource({ url }) {
  return (
    <div>
      {url && (
        <>
          Source: &nbsp;
          <a href={url} target="_blank" rel="noreferrer" id="source">
            {url.slice(0, 80) + (url.length > 80 ? "..." : "")}
          </a>
        </>
      )}

      <br />
    </div>
  );
}
