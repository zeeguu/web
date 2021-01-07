import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import TranslatableWord from './TranslatableWord'
import extractContext from './contextExtractor'

function createWordList (text) {
  // return text
  //   .trim()
  //   .split(/[\s,]+/)
  //   .map(word => {
  //     return { id: uuid(), word: word, translation: null }
  //   })

  let splitWords = text.trim().split(/[\s,]+/)

  let words = []

  for (var i = 0; i < splitWords.length; i++) {
    let previousWord = null

    if (i !== 0) {
      previousWord = words[i - 1]
    }

    words[i] = {
      id: uuid(),
      word: splitWords[i],
      translation: null,
      previousWord: previousWord
    }
  }

  // add the backward links
  for (var i = 0; i < splitWords.length - 1; i++) {
    let nextWord = words[i + 1]
    words[i].nextWord = nextWord
  }

  return words
}
export function TranslatableParagraph ({
  zapi,
  text,
  articleInfo,
  translating,
  pronouncing,
  pronounce
}) {
  const [words, setWords] = useState(createWordList(text))
  const [wordHistory, setWordHistory] = useState([])

  function wordUpdated (updatedWord) {
    setWords(
      words.map(e => {
        if (e.nextWord && e.nextWord.id === updatedWord.id) {
          return { ...e, nextWord: updatedWord }
        } else if (e.previousWord && e.previousWord.id === updatedWord.id) {
          return { ...e, previousWord: updatedWord }
        } else if (e.id === updatedWord.id) {
          return updatedWord
        } else {
          return e
        }
        // !== updatedWord.id ? e : updatedWord)))
      })
    )
  }

  function fuse (word, prevWord, nextWord, context) {
    // fuse left.

    wordHistory.push(words)
    console.log('word history:')
    console.log(wordHistory)

    let fusedText = prevWord.word + ' ' + word.word

    console.log(word)
    let newWord = { ...word }

    newWord.id = uuid()
    newWord.word = fusedText
    word.previousWord.previousWord.nextWord = newWord
    newWord.previousWord = word.previousWord.previousWord
    word.nextWord.previousWord = newWord

    console.log(newWord)
    console.log(word)
    console.log(prevWord)
    console.log(prevWord.prevWord)

    zapi
      .getOneTranslation(
        articleInfo.language,
        localStorage.native_language,
        fusedText,
        context,
        window.location,
        articleInfo.title
      )
      .then(response => response.json())
      .then(data => {
        newWord.translation = data.translations[0].translation

        setWords(
          words
            .filter(e => e.id !== prevWord.id)
            .map(e => (e.id === word.id ? newWord : e))
        )
      })
  }

  function showTranslation (word, domEl) {
    console.log(word)
    let context = extractContext(domEl.current)

    let shouldFuseWithPrevious =
      word.previousWord && word.previousWord.translation
    let shouldFuseWithNext = word.nextWord && word.nextWord.translation

    let fused = ''
    let prevFused = null
    let nextFused = null

    if (shouldFuseWithPrevious) {
      console.log('should fuse with previous... ')
      prevFused = word.previousWord
    }
    if (shouldFuseWithNext) {
      console.log('should fuse with next... ')
      nextFused = word.nextWord
    }

    if (shouldFuseWithPrevious || shouldFuseWithPrevious) {
      fuse(word, prevFused, nextFused, context)
    } else {
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
          wordUpdated({
            ...word,
            translation: data['translations'][0].translation,
            service_name: data['translations'][0].service_name
          })
        })
    }
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
