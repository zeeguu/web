import { useState } from 'react'
import { TranslatableParagraph } from './TranslatableParagraph'
import TranslatableWord from './TranslatableWord'

export function TranslatableText ({
  interactiveText,
  zapi,
  articleInfo,
  translating,
  pronouncing,
  pronounce
}) {
  const [translationCount, setTranslationCount] = useState(0)

  function wordUpdated () {
    setTranslationCount(translationCount + 1)
  }
  return (
    <div>
      {interactiveText.getParagraphs().map((par, index) => (
        <div key={index} className='textParagraph'>
          {par.getWords().map(word => (
            <TranslatableWord
              interactiveText={interactiveText}
              key={word.id}
              articleInfo={articleInfo}
              zapi={zapi}
              word={word}
              wordUpdated={wordUpdated}
              translating={translating}
              pronouncing={pronouncing}
              pronounce={pronounce}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
