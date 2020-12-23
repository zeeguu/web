import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import TranslatableWord from './TranslatableWord'

export function TranslatableParagraph ({ zapi, text, articleInfo }) {
  const [words, setWords] = useState(
    text
      .trim()
      .split(/[\s,]+/)
      .map(word => {
        return { id: uuid(), word: word, translation: null }
      })
  )

  return (
    <div>
      (
      {words.map(word => (
        <TranslatableWord
          key={word.id}
          articleInfo={articleInfo}
          zapi={zapi}
          word={word}
        />
      ))}
      )
    </div>
  )
}
