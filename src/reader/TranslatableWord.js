import { useState, useRef, useEffect } from 'react'
import AlterMenu from './AlterMenu'
import extractContext from './contextExtractor'

export default function TranslatableWord ({
  zapi,
  word,
  showTranslation,
  wordUpdated,
  articleInfo,
  translating,
  pronouncing,
  pronounce
}) {
  const [showingAlternatives, setShowingAlternatives] = useState(false)
  const domEl = useRef(null)

  function clickOnWord (word) {
    if (translating) {
      showTranslation(word, domEl)
    }
    if (pronouncing) {
      pronounce(word)
    }
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
        word.translation
      )
      .then(response => response.json())
      .then(data => {
        word.alternatives = data.translations.map(each => each.translation)
        wordUpdated(word)
        setShowingAlternatives(!showingAlternatives)
      })
  }

  function selectAlternative (alternative) {
    console.log(extractContext(domEl.current))
    zapi.contributeTranslation(
      articleInfo.language,
      localStorage.native_language,
      word.word,
      alternative,
      extractContext(domEl.current),
      window.location,
      articleInfo.title
    )
    word.translation = alternative
    word.service_name = 'Own alternative selection'

    wordUpdated()
    setShowingAlternatives(false)
  }

  function clickedOutsideAlterMenu () {
    setShowingAlternatives(false)
  }

  function hideTranslation (e, word) {
    word.translation = undefined
    wordUpdated()
  }

  if (!word.translation) {
    return (
      <>
        <z-tag ref={domEl} onClick={e => clickOnWord(word)}>
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
          translation0={word.translation}
          onClick={e => toggleAlternatives(e, word)}
        />
        <z-orig>
          <span onClick={e => hideTranslation(e, word)}>{word.word} </span>
          {showingAlternatives && (
            <AlterMenu
              word={word}
              setShowingAlternatives={setShowingAlternatives}
              selectAlternative={selectAlternative}
              clickedOutsideAlterMenu={clickedOutsideAlterMenu}
            />
          )}
        </z-orig>
      </z-tag>
      <span>{'  '} </span>
    </>
  )
}
