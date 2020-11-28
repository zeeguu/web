import { getBookmarksToStudy } from '../api/zeeguuAPI'
import { useState } from 'react'

import MenuOnTheLeft from '../components/MenuOnTheLeft'
import FindWordInContext from './FindWordInContext'
import Congratulations from '../components/exercises/Congratulations'
import ProgressBar from '../components/exercises/ProgressBar'
import MenuOnTheLeftWithLoading from '../components/MenuOnTheLeftWithLoading'

import './Exercises.css'

const NUMBER_OF_EXERCISES = 4

export default function Exercises () {
  const [bookmarksToStudyList, setbookmarksToStudyList] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentBookmarkToStudy, setCurretBookmarkToStudy] = useState(null)
  const [finished, setFinished] = useState(false)

  if (!bookmarksToStudyList) {
    getBookmarksToStudy(NUMBER_OF_EXERCISES, bookmarks => {
      setbookmarksToStudyList(bookmarks)
      setCurretBookmarkToStudy(bookmarks[currentIndex])
    })
  }

  if (finished) {
    return (
      <div>
        <MenuOnTheLeft />
        <Congratulations />
      </div>
    )
  }

  if (!currentBookmarkToStudy) {
    return <MenuOnTheLeftWithLoading />
  }

  function correctAnswer () {
    const newIndex = currentIndex + 1

    if (newIndex == NUMBER_OF_EXERCISES) {
      setFinished(true)
      return
    }

    setCurrentIndex(newIndex)
    setCurretBookmarkToStudy(bookmarksToStudyList[newIndex])
  }

  return (
    <div>
      <MenuOnTheLeft />

      <div className='exercisesContainer'>
        <div className='exMain'>
          <ProgressBar index={currentIndex} total={NUMBER_OF_EXERCISES} />

          <div id='ex-module'>
            <div className='ex-form ex-container'>
              <FindWordInContext
                bookmarkToStudy={currentBookmarkToStudy}
                correctAnswer={correctAnswer}
                key={currentBookmarkToStudy.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
