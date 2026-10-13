import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { APIContext } from "../../../contexts/APIContext";
import { SpeechContext } from "../../../contexts/SpeechContext";
import LoadingAnimation from "../../../components/LoadingAnimation";
import EmptyState from "../../../components/EmptyState";
import ArticleStatInfo from "../../../components/ArticleStatInfo";
import { TranslatableText } from "../../../reader/TranslatableText";
import * as s from "../../../reader/ArticleReader.sc";
import ReadOnlyInteractiveText from "./ReadOnlyInteractiveText";
import { studentArticleHeader } from "./studentArticleHeader";
import * as h from "./StudentArticle.sc";

// The text a student read, as they left it: every word they translated shown
// with its translation, in place. Opened from a reading session in the
// student's Activity. Read-only: no translating, nothing logged.
export default function StudentArticle({ studentName }) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const { studentID, cohortID, articleID } = useParams();
  const [article, setArticle] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.getStudentArticle(studentID, cohortID, articleID, setArticle, () => setFailed(true));
  }, [api, studentID, cohortID, articleID]);

  const { title, fragments } = useMemo(() => {
    if (!article) return {};
    const common = { api, sourceId: article.source_id, language: article.language, zeeguuSpeech: speech };
    return {
      title: new ReadOnlyInteractiveText({
        ...common,
        tokenizedParagraphs: article.tokenized_title_new.tokens,
        previousBookmarks: article.tokenized_title_new.past_bookmarks || [],
        contextIdentifier: article.tokenized_title_new.context_identifier,
      }),
      fragments: article.tokenized_fragments.map(
        (fragment) =>
          new ReadOnlyInteractiveText({
            ...common,
            tokenizedParagraphs: fragment.tokens,
            previousBookmarks: fragment.past_bookmarks || [],
            contextIdentifier: fragment.context_identifier,
            formatting: fragment.formatting,
          }),
      ),
    };
  }, [api, speech, article]);

  if (failed) {
    return <EmptyState message="This text could not be opened." fillHeight={false} />;
  }
  if (!fragments) return <LoadingAnimation />;

  const header = studentArticleHeader(studentName, article);

  return (
    <h.ReadOnlyReader>
      <h.ReadingHeader>
        <div>{header.lead}</div>
        {header.details && <div className="details">{header.details}</div>}
      </h.ReadingHeader>
      <div id="text">
        <h1>
          <TranslatableText interactiveText={title} translating={false} pronouncing={false} />
        </h1>
        <s.ArticleInfoContainer>
          <ArticleStatInfo articleInfo={article} />
        </s.ArticleInfoContainer>
        <s.MainText>
          {fragments.map((interactiveText, index) => (
            <TranslatableText key={index} interactiveText={interactiveText} translating={false} pronouncing={false} />
          ))}
        </s.MainText>
      </div>
    </h.ReadOnlyReader>
  );
}
