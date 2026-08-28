import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RoutingContext } from "../../contexts/RoutingContext";
import { APIContext } from "../../contexts/APIContext";
import DynamicFlagImage from "../../components/DynamicFlagImage";
import ArticleStatInfo from "../../components/ArticleStatInfo";
import { MetaItem } from "../../components/MetaStrip.sc";
import { languageName } from "../../utils/misc/languageCodeToName";
import AddToCohortDialog from "./AddToCohortDialog";
import * as s from "../styledComponents/TeacherListRow.sc";

const MAX_TITLE_LENGTH = 128;

export default function TeacherTextPreview({ article, onSharingChanged }) {
  const api = useContext(APIContext);
  // Set so that Cancel inside the editor comes back to the list.
  const { setReturnPath } = useContext(RoutingContext) || {};
  const [showAddToCohort, setShowAddToCohort] = useState(false);
  const [removing, setRemoving] = useState(null);

  const editPath = `/teacher/texts/editText/${article.id}`;
  const wordCount = article.metrics?.word_count;
  const sharedWith = article.shared_with || [];

  function unshare(cohort) {
    setRemoving(cohort.id);
    api.deleteArticleFromCohort(
      article.id,
      cohort.id,
      () => {
        setRemoving(null);
        onSharingChanged?.(
          article.id,
          sharedWith.filter((each) => each.id !== cohort.id),
        );
      },
      () => setRemoving(null),
    );
  }

  return (
    <s.Row>
      <s.Flag>
        <DynamicFlagImage languageCode={article.language} size={"1.1rem"} />
      </s.Flag>

      <s.Body>
        <Link to={editPath} onClick={() => setReturnPath?.("/teacher/texts")}>
          <s.Title>{article.title.substring(0, MAX_TITLE_LENGTH)}</s.Title>
        </Link>

        {/* Same strip as the article list and the reader header, so the source
            link and the difficulty read identically wherever a teacher meets
            them; language and word count ride along as extra items. */}
        <ArticleStatInfo articleInfo={article}>
          <MetaItem>{languageName(article.language)}</MetaItem>
          {wordCount ? <MetaItem>{wordCount} words</MetaItem> : null}
        </ArticleStatInfo>

        <s.Pills>
          {sharedWith.length === 0 && <s.NotShared>Not shared with any class</s.NotShared>}
          {sharedWith.map((cohort) => (
            <s.Pill key={cohort.id}>
              {cohort.name}
              <s.PillRemove
                type="button"
                aria-label={`Stop sharing with ${cohort.name}`}
                disabled={removing !== null}
                onClick={() => unshare(cohort)}
              >
                ×
              </s.PillRemove>
            </s.Pill>
          ))}
          <s.AddPill type="button" onClick={() => setShowAddToCohort(true)}>
            {sharedWith.length === 0 ? "+ Share" : "+"}
          </s.AddPill>
        </s.Pills>
      </s.Body>

      {showAddToCohort && (
        <AddToCohortDialog
          articleID={article.id}
          setIsOpen={setShowAddToCohort}
          onCohortsUpdated={(cohorts) => onSharingChanged?.(article.id, cohorts)}
        />
      )}
    </s.Row>
  );
}
