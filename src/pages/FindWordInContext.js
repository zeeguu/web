import { useState } from 'react'
import './FindWordInContext.css'
import { useSpeechSynthesis } from 'react-speech-kit'
import removeAccents from 'remove-accents'

function randomElement (x) {
  return x[Math.floor(Math.random() * x.length)]
}

export default function FindWordInContext ({ bookmarkToStudy, correctAnswer }) {
  const [currentInput, setCurrentInput] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [hintLength, setHintLength] = useState(0)
  const { speak, voices } = useSpeechSynthesis()

  const voice = randomElement(
    voices.filter(v => v.lang.includes(bookmarkToStudy.from_lang))
  )

  function eliminateTypos (x) {
    return x.trim().toUpperCase()
    // .replace(/[^a-zA-Z ]/g, '')
  }
  function checkResult () {
    var a = removeAccents(eliminateTypos(currentInput))
    var b = removeAccents(eliminateTypos(bookmarkToStudy.from))
    if (a === b) {
      setIsCorrect(true)
    }
  }

  function hint () {
    return bookmarkToStudy.from.substring(0, hintLength)
  }
  function handleHint () {
    setHintLength(hintLength + 1)
  }

  function colorWordInContext (context, word) {
    return context.replace(word, `<span class='highlightedWord'>${word}</span>`)
  }

  function handleSpeak () {
    speak({ text: bookmarkToStudy.from, voice: voice })
  }

  return (
    <div className='findWordInContext'>
      <h3>Find the word in context</h3>
      <h1>{bookmarkToStudy.to}</h1>
      <div className='contextExample'>
        <div
          dangerouslySetInnerHTML={{
            __html: isCorrect
              ? colorWordInContext(
                  bookmarkToStudy.context,
                  bookmarkToStudy.from
                )
              : bookmarkToStudy.context
          }}
        />
      </div>

      <div className='bottomInput'>
        {!isCorrect && <button onClick={e => handleHint()}>Hint</button>}

        {isCorrect && <button onClick={e => handleSpeak()}>Speak</button>}

        {!isCorrect && (
          <input
            type='text'
            placeholder={hint()}
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                checkResult()
              }
            }}
            autoFocus
          />
        )}

        {!isCorrect && <button onClick={checkResult}>Check</button>}

        {isCorrect && (
          <button onClick={e => correctAnswer()} autoFocus>
            Next
          </button>
        )}
      </div>
    </div>
  )
}
