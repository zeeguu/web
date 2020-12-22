import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import TranslatableWord from './TranslatableWord'

export function TranslatableParagraph ({ zapi, text, url }) {
  const [words, setWords] = useState(
    text
      .trim()
      .split(/[\s,]+/)
      .map(word => {
        return { id: uuid(), word: word, translation: null }
      })
  )

  function clicked (word) {
    zapi
      .getNextTranslations('fr', 'en', word.word, '', url, 1)
      .then(response => response.json())
      .then(data => {
        let t = data['translations'][0].translation

        setWords(
          words.map(e => (e.id !== word.id ? e : { ...word, translation: t }))
        )
      })
  }

  return (
    <div>
      (
      {words.map(word => (
        <TranslatableWord word={word} />
      ))}
      )
    </div>
  )
}
