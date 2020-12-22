import { useState } from 'react'
import { v4 as uuid } from 'uuid'

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
        <>
          <z-tag class='origtrans' onClick={e => clicked(word)}>
            {word.word}
            {word.translation && (
              <tran
                chosen={word.translation}
                suggestion=''
                possibly_more_translations=''
                translation0={word.translation}
                servicenametranslation0='Google - without context'
                transcount='1'
              >
                <singlealternative></singlealternative>
              </tran>
            )}
          </z-tag>
          <span> </span>
        </>
      ))}
      )
    </div>
  )
}
