import { Fragment, useEffect, useState } from "react";

const StudentTranslations = ({ article }) => {
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    if (article) {
      const filteredArray = article.translations.reduce((acc, current) => {
        const found = acc.find((item) => item.id === current.id);
        if (!found) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      setTranslations(filteredArray);
    }
    //eslint-disable-next-line
  }, []);
  console.log(translations);

  const DivideSentence = ({ sentence, word, isPracticed }) => {
    console.log(isPracticed);
    const wordStart = sentence.indexOf(word);
    const prefix = sentence.substring(0, wordStart);
    const wordLength = word.length;
    const suffix = sentence.substring(wordStart + wordLength);

    return (
      <div
        style={{
            borderLeft: "solid 3px #4492b3",
            margin:"0 20px 20px 30px",
            lineHeight:2,
            paddingLeft:"15px",
        }}
      >
        {prefix}
        <span
          style={{
            display: "inline",
            border: "solid 2px #54cdff",
            margin: "15px 0px 0px 0px",
            padding:"5px",
            borderRadius: "25px",
          }}
        >
          <b>{word}</b>
        </span>
        {isPracticed === 1 && (
          <span style={{ color: "#54cdff", fontSize: "25px" }}>
            <b>*</b>
          </span>
        )}
        {suffix}
      </div>
    );
  };

  return (
    <Fragment>
      <h4 className="panel-headline">
        Translated words in the context of their sencences
      </h4>
      {translations &&
        translations.map((translation) => (
          <DivideSentence
            sentence={translation.context}
            word={translation.word}
            isPracticed={translation.practiced}
          />
        ))}

      {translations === null ||
        (translations.length === 0 && (
          <p className="panel-no-words">
            The student translated no words in this text.STRINGS
          </p>
        ))}
    </Fragment>
  );
};
export default StudentTranslations;
