import { useState } from 'react'
import './FindWordInContext.css'

import BottomInput from './BottomInput'
import BottomFeedback from './BottomFeedback'

const EXERCISE_TYPE = 'Recognize_L1W_in_L2T'
export default function FindWordInContext ({
  api,
  bookmarkToStudy,
  correctAnswer
}) {
  const [isCorrect, setIsCorrect] = useState(false)
  const [initialTime, setCurrentTime] = useState(new Date())
  const [firstTypeTime, setFirstTypeTime] = useState()

  function colorWordInContext (context, word) {
    return context.replace(word, `<span class='highlightedWord'>${word}</span>`)
  }

  function inputKeyPress () {
    if (firstTypeTime === undefined) {
      console.log('first time key prss!')
      setFirstTypeTime(new Date())
    }
  }

  function handleCorrectAnswer () {
    console.log(new Date() - initialTime)
    console.log('^^^^ time elapsed')
    console.log(firstTypeTime - initialTime)
    console.log('^^^^ to first key press')

    setIsCorrect(true)
    api.uploadExerciseFeedback(
      'Correct',
      EXERCISE_TYPE,
      firstTypeTime - initialTime,
      bookmarkToStudy.id
    )
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

      {!isCorrect && (
        <BottomInput
          handleCorrectAnswer={handleCorrectAnswer}
          bookmarkToStudy={bookmarkToStudy}
          notifyKeyPress={inputKeyPress}
        />
      )}
      {isCorrect && (
        <BottomFeedback
          bookmarkToStudy={bookmarkToStudy}
          correctAnswer={correctAnswer}
        />
      )}
    </div>
  )
}
