import Word from "./Word";
import { TopMessage } from "../components/TopMessage.sc";
import { ContentOnRow } from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";

export default function WordsToReview({
  words,
  articleInfo,
  deleteBookmark,
  api,
  notifyWordChanged,
  source
}) {
  return (
    <>
      <h1>{strings.ReviewTranslations}</h1>
      <small>
        {strings.from}
        {articleInfo.title}
      </small>

      <br />
      <br />
      <TopMessage style={{ textAlign: "left" }}>
        {words.length > 0 ? (
          <>
            <p>{strings.starTranslation}</p>
            <p>{strings.deleteTranslation}</p>
            <p>{strings.ifGreyedTranslation}</p>
          </>
        ) : (
          strings.theWordsYouTranslate
        )}
      </TopMessage>
      {words.map((each) => (
        <ContentOnRow className="contentOnRow">
          <Word
            key={each.id}
            bookmark={each}
            notifyDelete={deleteBookmark}
            api={api}
            notifyStar={notifyWordChanged}
            notifyUnstar={notifyWordChanged}
            source={source}
          />
        </ContentOnRow>
      ))}
      <br />
      <br />
      <br />
    </>
  );
}
