import { useState } from 'react'

import { WordsOnDate } from './WordsOnDate'
import LoadingAnimation from '../components/LoadingAnimation'

import * as s from './WordHistory.sc'

export default function WordHistory ({ api }) {
  const [wordsByDay, setWordsByDay] = useState(null)

  if (!wordsByDay) {
    api.getBookmarksByDay(bookmarks_by_day => {
      setWordsByDay(bookmarks_by_day)
    })

    document.title = 'Zeeguu Words - History'
    return <LoadingAnimation />
  }

  function deleteBookmark (day, bookmark) {
    api.deleteBookmark(bookmark.id)

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
      api.unstarBookmark(bookmark.id)
    } else {
      api.starBookmark(bookmark.id)
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
          api={api}
          toggleStarred={bookmark => toggleStarred(day, bookmark)}
          deleteBookmark={bookmark => deleteBookmark(day, bookmark)}
        />
      ))}
    </>
  )
}
