import strings from "../../zeeguu-react/src/i18n/definitions";
import Word from "../../zeeguu-react/src/words/Word";
import { TopMessage } from "../../zeeguu-react/src/components/TopMessage.sc";
import { ContentOnRow } from "../../zeeguu-react/src/components/ColumnWidth.sc";
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


