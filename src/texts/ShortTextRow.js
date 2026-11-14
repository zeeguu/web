import { useHistory } from "react-router-dom";

import { MetaStrip, MetaItem } from "../components/MetaStrip.sc";
import * as row from "../articles/SavedArticleRow.sc";
import { Row } from "../articles/SharedArticleRow.sc";
import { languageName } from "../utils/misc/languageCodeToName";
import { timeAgo } from "../utils/misc/readableTime";
import strings from "../i18n/definitions";

// A text the learner brought in, as a row in Inbox. Opens in the text reader.
export default function ShortTextRow({ text, onForget }) {
  const history = useHistory();
  const open = () => history.push(`/texts/read?id=${text.id}`);
  return (
    <Row
      role="button"
      tabIndex={0}
      onClick={open}
      // Only keys aimed at the row itself: Enter on × bubbles here too
      onKeyDown={(e) => e.target === e.currentTarget && (e.key === "Enter" || e.key === " ") && open()}
    >
      <row.Content>
        <row.Title>{text.preview}</row.Title>
        <MetaStrip>
          <MetaItem>{strings.sharedByYou}</MetaItem>
          <MetaItem>{languageName(text.language)}</MetaItem>
          <MetaItem>{timeAgo(text.last_opened_at)}</MetaItem>
        </MetaStrip>
      </row.Content>
      <row.RemoveButton
        aria-label={strings.removeText}
        title={strings.removeText}
        onClick={(e) => {
          e.stopPropagation();
          onForget(text.id);
        }}
      >
        ×
      </row.RemoveButton>
    </Row>
  );
}
