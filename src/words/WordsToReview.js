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
  source,
}) {
  return (
    <>
      <div>
        <h1>{strings.ReviewTranslations}</h1>
        <medium>
          <b>{strings.from}</b>
          {articleInfo.title}
        </medium>
      </div>
      <TopMessage className="topMessage" style={{ textAlign: "left" }}>
        {words.length > 0 ? (
          <ul>
            <li>{strings.starTranslation}</li>
            <li>{strings.deleteTranslation}</li>
            <li>{strings.ifGreyedTranslation}</li>
          </ul>
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
    </>
  );
}
