import { v4 as uuid } from 'uuid'
// used to be...
// return text
//   .trim()
//   .split(/[\s,]+/)
//   .map(word => {
//     return { id: uuid(), word: word, translation: null }
//   })

function createLinkedWordList (text) {
  let splitWords = text.trim().split(/[\s,]+/)

  let words = []

  // add the forward links
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
  words[splitWords.length - 1].nextWord = null

  return words
}

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

function wordUpdated2 (wordList, updatedWord) {
  setWords(
    wordList.map(e => {
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

function replace (wordList, word, updatedWord) {
  return wordList.map(e => {
    if (e.nextWord && e.nextWord.id === word.id) {
      return { ...e, nextWord: updatedWord }
    } else if (e.previousWord && e.previousWord.id === word.id) {
      return { ...e, previousWord: updatedWord }
    } else if (e.id === word.id) {
      return updatedWord
    } else {
      return e
    }
    // !== updatedWord.id ? e : updatedWord)))
  })
}

function fuse (word, prevWord, nextWord, context) {
  // push to history the current state of the paragraph
  // TODO: should be moved to the text level
  wordHistory.push(words)
  console.log('word history:')
  console.log(wordHistory)

  let fusedText
  let newWord = { ...word }
  let newWordsList = [...words]

  // fuse to the left when clicking at the right of an existing translation

  if (prevWord) {
    console.log('fusing to the left')
    fusedText = prevWord.word + ' ' + word.word

    console.log(word)

    newWord.id = uuid()
    newWord.word = fusedText

    // we are going to delete previous word... so fix the links if there are any
    if (prevWord.previousWord) {
      prevWord.previousWord.nextWord = newWord
      newWord.previousWord = prevWord.previousWord
    } else {
      newWord.previousWord = null
    }
    if (word.nextWord) {
      word.nextWord.previousWord = newWord
    }

    newWordsList = words.filter(e => e.id !== prevWord.id)
    // .filter(e => e.id !== word.id)
    newWordsList = replace(newWordsList, word, newWord)
  }

  // fuse to the right, when clicking at the left of an existing translation

  // secondNewWord because newWord is required while we point to things
  let secondNewWord = { ...newWord }

  if (nextWord) {
    console.log('!!!! fusing to the right')
    if (prevWord) {
      console.log('we already fused left')
      fusedText += ' ' + nextWord.word
      console.log('first fuse')
    } else {
      fusedText = word.word + ' ' + nextWord.word
    }
    console.log(fusedText)

    secondNewWord.id = uuid()
    secondNewWord.word = fusedText

    if (newWord.previousWord) {
      newWord.previousWord.nextWord = secondNewWord
    }
    // skip the going out link to the right
    secondNewWord.nextWord = nextWord.nextWord

    // if there is a word after the right fuse we make it point to us!
    if (nextWord.nextWord) {
      nextWord.nextWord.previousWord = secondNewWord
    }

    newWordsList = newWordsList.filter(e => e.id !== nextWord.id)
    newWordsList = replace(newWordsList, newWord, secondNewWord)
  }

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
      secondNewWord.translation = data.translations[0].translation

      // newWordsList = newWordsList.map(e =>
      //   e.id === word.id ? secondNewWord : e
      // )
      // setWords(newWordsList)

      wordUpdated2(newWordsList, secondNewWord)

      console.log(secondNewWord)
      console.log(newWordsList)
    })
}

export { createLinkedWordList, wordUpdated, wordUpdated2, fuse, replace }
