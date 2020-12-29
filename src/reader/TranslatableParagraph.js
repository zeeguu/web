import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import TranslatableWord from './TranslatableWord'

export function TranslatableParagraph ({
  zapi,
  text,
  articleInfo,
  translating,
  pronouncing,
  pronounce
}) {
  const [words, setWords] = useState(
    text
      .trim()
      .split(/[\s,]+/)
      .map(word => {
        return { id: uuid(), word: word, translation: null }
      })
  )

  function wordUpdated (updatedWord) {
    setWords(words.map(e => (e.id !== updatedWord.id ? e : updatedWord)))
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
