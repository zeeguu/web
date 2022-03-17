import Word from "./Word";
import { TopMessage } from "../components/TopMessage.sc";
import {ContentOnRow,} from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";

export default function WordsToReview({words, articleInfo, deleteBookmark, api}) {
    return (
        <>
        <br />
        <h1>{strings.ReviewTranslations}</h1>
        <small>{strings.from}{articleInfo.title}</small>
        <br />
        <br />
        <br />
        <TopMessage style={{ textAlign: "left" }}>
          {words.length > 0 ? (
            <>
              * {strings.deleteTranslation}
              <br />
              <br />
              * {strings.starTranslation}
              <br />
              <br />
              * {strings.ifGreyedTranslation}
              <br />
            </>
          ) : (
            strings.theWordsYouTranslate
          )}
        </TopMessage>
        {words.map((each) => (
          <ContentOnRow>
            <Word
              key={each.id}
              bookmark={each}
              notifyDelete={deleteBookmark}
              api={api}
            />
          </ContentOnRow>
        ))}
        <br />
        <br />
        <br />  
        </>
    );
}
