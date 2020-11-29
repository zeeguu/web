import { useState } from 'react'
import './FindWordInContext.css'

import BottomInput from './BottomInput'
import BottomFeedback from './BottomFeedback'
import { uploadExerciseFeedback } from './../../api/zeeguuAPI'

export default function FindWordInContext ({ bookmarkToStudy, correctAnswer }) {
  const [isCorrect, setIsCorrect] = useState(false)

  function colorWordInContext (context, word) {
    return context.replace(word, `<span class='highlightedWord'>${word}</span>`)
  }

  function handleCorrectAnswer () {
    setIsCorrect(true)
    uploadExerciseFeedback(
      'Correct',
      'Recognize_L1W_in_L2T',
      1234,
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
