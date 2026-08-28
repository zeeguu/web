import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RoutingContext } from "../../contexts/RoutingContext";
import { APIContext } from "../../contexts/APIContext";
import DynamicFlagImage from "../../components/DynamicFlagImage";
import ArticleStatInfo from "../../components/ArticleStatInfo";
import { MetaItem } from "../../components/MetaStrip.sc";
import { languageName } from "../../utils/misc/languageCodeToName";
import AddToCohortDialog from "./AddToCohortDialog";
import ClassPills from "../sharedComponents/ClassPills";
import * as s from "../styledComponents/TeacherListRow.sc";

const MAX_TITLE_LENGTH = 128;

export default function TeacherTextPreview({ article, onSharingChanged, onSelectClass }) {
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

        {/* The names double as the list's class filter: the chips at the top of
            My Texts are the same set, so a text tells you where it lives and
            takes you to the rest of what lives there. */}
        <ClassPills
          classes={sharedWith}
          onSelectClass={onSelectClass}
          onRemove={unshare}
          removingId={removing}
          onAdd={() => setShowAddToCohort(true)}
        />
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
