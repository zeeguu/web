function shorten(url, maxLength = 120) {
  return url.slice(0, maxLength) + (url.length > maxLength ? "..." : "");
}

export default function ArticleSource({ url }) {
  return (
    <div>
      {url && (
        <>
          Source:{" "}
          <a href={url} target="_blank" rel="noreferrer" id="source">
            {shorten(url, 256)}
          </a>
        </>
      )}

      <br />
    </div>
  );
}
