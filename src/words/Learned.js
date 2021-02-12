import { useEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import Word from './Word'
import * as s from './WordHistory.sc'

export default function Learned ({ zapi }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    zapi.learnedBookmarks(300, learnedWords => {
      console.log(learnedWords)
      setWords(learnedWords)
    })
  }, [zapi])

  if (!words) {
    return <LoadingAnimation />
  }

  if (words.length === 0) {
    return (
      <div className='topMessageContainer'>
        <div className='topMessage'>
          Learned words are words that were correct in exercises in 4 different
          days.
        </div>
      </div>
    )
  }

  function deleteBookmark (bookmark) {
    zapi.deleteBookmark(bookmark.id)
    setWords(words.filter(e => e.id !== bookmark.id))
  }

  return (
    <>
      <s.TopMessage>
        <p>
          Learned words are words that were correct in exercises in 4 different
          days.
        </p>
      </s.TopMessage>

      <s.TopMessage>
        <p>
          You have learned <b>{words.length}</b> words so far.
        </p>
      </s.TopMessage>

      {words.map(each => (
        <>
          <Word bookmark={each}>
            <small>
              Correct on:
              {' ' + each.learned_datetime}
              <br />
              <br />
            </small>
          </Word>
        </>
      ))}
    </>
  )
}
