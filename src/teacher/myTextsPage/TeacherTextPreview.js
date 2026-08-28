import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RoutingContext } from "../../contexts/RoutingContext";
import { APIContext } from "../../contexts/APIContext";
import DynamicFlagImage from "../../components/DynamicFlagImage";
import { effectiveCefrLevel } from "../../utils/misc/cefrHelpers";
import { LANGUAGE_CODE_TO_NAME } from "../../utils/misc/languageCodeToName";
import AddToCohortDialog from "./AddToCohortDialog";
import * as s from "../styledComponents/TeacherTextRow.sc";

const MAX_TITLE_LENGTH = 128;

export default function TeacherTextPreview({ article, onSharingChanged }) {
  const api = useContext(APIContext);
  // Set so that Cancel inside the editor comes back to the list.
  const { setReturnPath } = useContext(RoutingContext) || {};
  const [showAddToCohort, setShowAddToCohort] = useState(false);
  const [removing, setRemoving] = useState(null);

  const editPath = `/teacher/texts/editText/${article.id}`;
  const level = effectiveCefrLevel(article.cefr_assessments);
  const isTeacherSet = Boolean(article.cefr_assessments?.teacher?.level);
  const languageName = LANGUAGE_CODE_TO_NAME[article.language] || article.language;
  const wordCount = article.metrics?.word_count;

  // `shared_with` carries ids; `cohorts` is the older names-only field, kept so
  // the list still renders against an API that has not been deployed yet.
  const sharedWith =
    article.shared_with || (article.cohorts || []).map((name) => ({ id: name, name }));

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
        <s.TitleLine>
          <Link to={editPath} onClick={() => setReturnPath?.("/teacher/texts")}>
            <s.Title>{article.title.substring(0, MAX_TITLE_LENGTH)}</s.Title>
          </Link>
          {level && (
            <s.Level title={isTeacherSet ? "You set this level by hand" : "Automatically assessed"}>
              {level}
              {isTeacherSet && <s.LevelSetByYou> · yours</s.LevelSetByYou>}
            </s.Level>
          )}
        </s.TitleLine>

        <s.Meta>
          {languageName}
          {wordCount ? ` · ${wordCount} words` : ""}
        </s.Meta>

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
