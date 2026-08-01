import * as s from "./ArticleReader.sc";

// Scrapers sometimes store a "published on <date>" fragment as the first
// author (e.g. "Publiceret D.", "Publié Le Mai À"). The backend now strips
// these at ingestion, but older articles still carry them, so we also skip
// them here. Matches a publish/update verb at the start of a byline part.
const JUNK_AUTHOR_PREFIX =
  /^(publiceret|publicerad|publisert|publié|publie|published|veröffentlicht|pubblicato|publicado|gepubliceerd|julkaistu|opdateret|uppdaterad|oppdatert|updated|aktualisiert)\b/i;

export default function ArticleAuthors({ articleInfo }) {
  const firstAuthor = (articleInfo.authors || "")
    .split(",")
    .map((a) => a.replace(/\s+/g, " ").trim())
    .find((a) => a && !JUNK_AUTHOR_PREFIX.test(a));

  if (!firstAuthor) return <></>;
  return (
    <s.AuthorLinksContainer>
      <div>{firstAuthor}</div>
    </s.AuthorLinksContainer>
  );
}
