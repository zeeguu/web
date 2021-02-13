import { useState } from 'react'

import { WordsOnDate } from './WordsOnDate'
import LoadingAnimation from '../components/LoadingAnimation'

import * as s from './WordHistory.sc'

export default function WordHistory ({ zapi }) {
  const [wordsByDay, setWordsByDay] = useState(null)

  if (!wordsByDay) {
    zapi.getBookmarksByDay(bookmarks_by_day => {
      setWordsByDay(bookmarks_by_day)
    })
    return <LoadingAnimation />
  }

  function deleteBookmark (day, bookmark) {
    zapi.deleteBookmark(bookmark.id)

    let updatedDay = {
      date: day.date,
      bookmarks: day.bookmarks.filter(b => b.id !== bookmark.id)
    }

    if (updatedDay.bookmarks.length === 0) {
      // if there's no more bookmarks left for the day,
      // just filter out the whole day from the list
      setWordsByDay(wordsByDay.filter(e => e.date !== day.date))
    } else {
      setWordsByDay([
        ...wordsByDay.map(e => (e.date !== day.date ? e : updatedDay))
      ])
    }
  }

  function toggleStarred (day, bookmark) {
    if (bookmark.starred) {
      zapi.unstarBookmark(bookmark.id)
    } else {
      zapi.starBookmark(bookmark.id)
    }

    let updatedDay = {
      date: day.date,
      bookmarks: [
        ...day.bookmarks.map(b =>
          b.id !== bookmark.id ? b : { ...bookmark, starred: !bookmark.starred }
        )
      ]
    }
    setWordsByDay([
      ...wordsByDay.map(e => (e.date !== day.date ? e : updatedDay))
    ])
  }

  return (
    <>
      <s.TopMessage>
        <p>
          Star a word to ensure it appears in exercises. Delete to avoid it.
        </p>
      </s.TopMessage>

      {wordsByDay.map(day => (
        <WordsOnDate
          key={day.date}
          day={day}
          zapi={zapi}
          toggleStarred={bookmark => toggleStarred(day, bookmark)}
          deleteBookmark={bookmark => deleteBookmark(day, bookmark)}
        />
      ))}
    </>
  )
}
