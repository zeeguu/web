import { useState } from 'react'

import { WordsOnDate } from './WordsOnDate'

export default function WordHistory ({ zapi }) {
  const [wordsByDay, setWordsByDay] = useState(null)

  if (!wordsByDay) {
    zapi.getBookmarksByDay(bookmarks_by_day => {
      console.log(bookmarks_by_day)
      setWordsByDay(bookmarks_by_day)
    })
    return <div className='loading'>loading...</div>
  }

  function deleteBookmark (id) {
    console.log('deleting bookmark with id: ' + id)
  }

  function toggleStarred () {}

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
            bookmarks_in_day={day.bookmarks}
            toggleStarred={toggleStarred}
            deleteBookmark={deleteBookmark}
          />
        </>
      ))}
    </>
  )
}
