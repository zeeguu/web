import { useContext, useState } from "react";
import { APIContext } from "../../contexts/APIContext";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import * as s from "../styledComponents/ImportFromLink.sc";

/**
 * On a new, empty text: paste a link, get the article's title and text in the
 * editor, ready to fix and share. Replaces the "Use a URL-address" dialog of
 * the old Add Texts page, which saved the text before the teacher saw it.
 *
 * onImported receives parse_url's answer: {title, text, htmlContent,
 * language_code, top_image}.
 */
export default function ImportFromLink({ onImported }) {
  const api = useContext(APIContext);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  function importArticle(event) {
    event.preventDefault();
    if (!url.trim()) return;
    setBusy(true);
    setFailed(false);
    api.parseArticleFromUrl(
      url.trim(),
      (info) => {
        setBusy(false);
        onImported(info);
      },
      () => {
        setBusy(false);
        setFailed(true);
      },
    );
  }

  return (
    <s.ImportForm onSubmit={importArticle}>
      <label htmlFor="import-link">Importing an article? Paste its link:</label>
      <div className="row">
        <input
          id="import-link"
          type="url"
          placeholder="https://…"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setFailed(false);
          }}
          disabled={busy}
        />
        <StyledButton $secondary type="submit" disabled={busy || !url.trim()}>
          {busy ? "Importing…" : "Import"}
        </StyledButton>
      </div>
      {failed && (
        <p className="failed">
          Could not get the text from that page. Some sites do not allow it; you can still paste the text below.
        </p>
      )}
    </s.ImportForm>
  );
}
