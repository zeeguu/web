import { Fragment, useEffect, useState } from "react";

const StudentTranslations = ({ article }) => {
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    if (article) {
      setTranslations(article.translations);
    }
    //eslint-disable-next-line
  }, []);
  //console.log(translations);

  const DivideSentence = ({sentence, word}) => {
     const wordStart = sentence.indexOf(word);
    const prefix = sentence.substring(0, wordStart - 1);
    const wordLength = word.length;
    const suffix = sentence.substring(wordStart + wordLength);
    console.log(sentence)
    console.log(prefix + word.toUpperCase() + suffix)
    return (
      <>
        <p className="prefix">{prefix}</p>
        <p className="word">{word}</p>
        <p className="suffix">{suffix}</p>
      </>
    );
  };

  return (
    <Fragment>
      <h2 className="panel-headline">
        Translated words in the context of their sencences
      </h2>
        {translations && (translations.map((translation)=>{
            console.dir(translation)
            return <DivideSentence sentence={translation.context} word={translation.word}/>

      }))}

      <p className="panel-no-words">
        No words were translated in this reading session.
      </p>
    </Fragment>
  );
};
export default StudentTranslations;
