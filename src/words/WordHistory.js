import { useState } from 'react'

import { WordsOnDate } from './WordsOnDate'
import LoadingAnimation from '../components/LoadingAnimation'

import * as s from '../components/TopMessage.sc'
import { setTitle } from '../components/setTitle'

export default function WordHistory ({ api }) {
  const [wordsByDay, setWordsByDay] = useState(null)

  if (!wordsByDay) {
    api.getBookmarksByDay(bookmarks_by_day => {
      setWordsByDay(bookmarks_by_day)
    })

    setTitle('Translation History')
    return <LoadingAnimation />
  }

  return (
    <>
      <s.TopMessage>
        Star a word to ensure it appears in exercises. Delete to avoid it.
      </s.TopMessage>

      {wordsByDay.map(day => (
        <WordsOnDate key={day.date} day={day} api={api} />
      ))}
    </>
  )
}
