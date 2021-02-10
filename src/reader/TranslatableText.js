import { useState } from "react";
import TranslatableWord from "./TranslatableWord";

export function TranslatableText({
  interactiveText,
  translating,
  pronouncing,
}) {
  const [translationCount, setTranslationCount] = useState(0);

  function wordUpdated() {
    setTranslationCount(translationCount + 1);
  }
  return (
    <div>
      {interactiveText.getParagraphs().map((par, index) => (
        <div key={index} className="textParagraph">
          {par.getWords().map((word) => (
            <TranslatableWord
              interactiveText={interactiveText}
              key={word.id}
              word={word}
              wordUpdated={wordUpdated}
              translating={translating}
              pronouncing={pronouncing}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
