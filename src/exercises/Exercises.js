import { useState } from 'react'

import FindWordInContext from './recognize/FindWordInContext'
import Congratulations from './Congratulations'
import ProgressBar from './ProgressBar'

import './Exercises.css'
import FeedbackButtons from './FeedbackButtons'

const NUMBER_OF_EXERCISES = 4

export default function Exercises ({ api }) {
  const [bookmarksToStudyList, setbookmarksToStudyList] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentBookmarkToStudy, setCurretBookmarkToStudy] = useState(null)
  const [finished, setFinished] = useState(false)
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false)

  if (!bookmarksToStudyList) {
    api.getUserBookmarksToStudy(NUMBER_OF_EXERCISES, bookmarks => {
      setbookmarksToStudyList(bookmarks)
      setCurretBookmarkToStudy(bookmarks[currentIndex])
    })
  }

  if (finished) {
    return (
      <div>
        <Congratulations />
      </div>
    )
  }

  if (!currentBookmarkToStudy) {
    return <div>loading...</div>
  }

  function moveToNextExercise () {
    const newIndex = currentIndex + 1

    if (newIndex === NUMBER_OF_EXERCISES) {
      setFinished(true)
      return
    }

    setCurrentIndex(newIndex)
    setCurretBookmarkToStudy(bookmarksToStudyList[newIndex])
  }
  function correctAnswer () {
    moveToNextExercise()
  }

  function stopShowingThisFeedback (reason) {
    moveToNextExercise()
    api.uploadExerciseFeedback(
      reason,
      'Recognize_L1W_in_L2T',
      0,
      currentBookmarkToStudy.id
    )
    setShowFeedbackButtons(false)
  }

  return (
    <div>
      <div className='exercisesContainer'>
        <div className='exMain'>
          <ProgressBar index={currentIndex} total={NUMBER_OF_EXERCISES} />

          <div id='ex-module'>
            <div className='ex-form ex-container'>
              <FindWordInContext
                bookmarkToStudy={currentBookmarkToStudy}
                correctAnswer={correctAnswer}
                key={currentBookmarkToStudy.id}
                api={api}
              />
            </div>

            <FeedbackButtons
              show={showFeedbackButtons}
              setShow={setShowFeedbackButtons}
              feedbackFunction={stopShowingThisFeedback}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
