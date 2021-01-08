import { useState } from 'react'
import TranslatableWord from './TranslatableWord'
import extractContext from './contextExtractor'
import LinkedWordList from './LinkedWordListClass'

export function TranslatableParagraph ({
  zapi,
  text,
  articleInfo,
  translating,
  pronouncing,
  pronounce
}) {
  const [linkedWordsList, setLinkedWordsList] = useState(
    new LinkedWordList(text)
  )
  const [words, setWords] = useState(linkedWordsList.getWords())
  const [wordHistory, setWordHistory] = useState([])

  function wordUpdated () {
    setWords(linkedWordsList.getWords())
  }

  function showTranslation (word, domEl) {
    let context = extractContext(domEl.current)

    word = word.fuseWithNeighborsIfNeeded()

    zapi
      .getOneTranslation(
        articleInfo.language,
        localStorage.native_language,
        word.word,
        context,
        window.location,
        articleInfo.title
      )
      .then(response => response.json())
      .then(data => {
        word.translation = data['translations'][0].translation
        wordUpdated()
      })
    // }
  }

  return (
    <div>
      (
      {words.map(word => (
        <TranslatableWord
          key={word.id}
          articleInfo={articleInfo}
          zapi={zapi}
          word={word}
          showTranslation={showTranslation}
          wordUpdated={wordUpdated}
          translating={translating}
          pronouncing={pronouncing}
          pronounce={pronounce}
        />
      ))}
      )
    </div>
  )
}
