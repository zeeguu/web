import { useState } from 'react'

import { WordsOnDate } from './WordsOnDate'

export default function WordHistory ({ zapi }) {
  const [wordsByDay, setWordsByDay] = useState(null)

  if (!wordsByDay) {
    zapi.getBookmarksByDay(bookmarks_by_day => {
      setWordsByDay(bookmarks_by_day)
    })
    return <div className='loading'>loading...</div>
  }

  function deleteBookmark (id) {
    console.log('deleting bookmark with id: ' + id)
  }

  function toggleStarred (day, bookmark) {
    console.log('toggling star of: ')
    console.log(bookmark)
    if (bookmark.starred) {
      zapi.unstarBookmark(bookmark.id)
    } else {
      zapi.starBookmark(bookmark.id)
    }

    console.log(day)
    console.log(bookmark)
    console.log(wordsByDay)

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
      <div className='topMessageContainer'>
        <div className='topMessage'>
          Star a word to ensure it appears in your exercises.
        </div>
      </div>

      {wordsByDay.map(day => (
        <>
          <div className='outerDate'>
            <div className='dateContainer'>
              <h1 className='date'>{day.date} </h1>
            </div>
          </div>

          <WordsOnDate
            day={day}
            toggleStarred={toggleStarred}
            deleteBookmark={deleteBookmark}
          />
        </>
      ))}
    </>
  )
}
