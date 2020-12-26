import { useState, useRef } from 'react'
import AlterMenu from './AlterMenu'
import extractContext from './contextExtractor'

export default function TranslatableWord ({
  zapi,
  word,
  wordUpdated,
  articleInfo
}) {
  const [showingAlternatives, setShowingAlternatives] = useState(false)
  const domEl = useRef(null)

  function showTranslation (word) {
    zapi
      .getOneTranslation(
        articleInfo.language,
        localStorage.native_language,
        word.word,
        extractContext(domEl.current),
        window.location,
        articleInfo.title
      )
      .then(response => response.json())
      .then(data => {
        wordUpdated({
          ...word,
          translation: data['translations'][0].translation,
          service_name: data['translations'][0].service_name
        })
      })
  }

  function toggleAlternatives (e, word) {
    if (showingAlternatives) {
      setShowingAlternatives(false)
      return
    }

    zapi
      .getNextTranslations(
        articleInfo.language,
        localStorage.native_language,
        word.word,
        extractContext(domEl.current),
        articleInfo.url,
        -1,
        word.service_name,
        'underline'
      )
      .then(response => response.json())
      .then(data => {
        wordUpdated({
          ...word,
          alternatives: data.translations.map(each => each.translation)
        })
        setShowingAlternatives(!showingAlternatives)
      })
  }

  if (!word.translation) {
    return (
      <>
        <z-tag ref={domEl} onClick={e => showTranslation(word)}>
          {word.word}
        </z-tag>
        <span> </span>
      </>
    )
  }
  return (
    <>
      <z-tag ref={domEl}>
        <z-tran
          chosen={word.translation}
          suggestion=''
          possibly_more_translations=''
          translation0={word.translation}
          servicenametranslation0='Google - without context'
          transcount='1'
          onClick={e => toggleAlternatives(e, word)}
        ></z-tran>
        <z-orig>
          {word.word}
          {showingAlternatives && (
            <AlterMenu
              word={word}
              setShowingAlternatives={setShowingAlternatives}
            />
          )}
        </z-orig>
      </z-tag>
      <span>{'  '} </span>
    </>
  )
}
