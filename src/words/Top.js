import { useEffect, useState } from 'react'

import LoadingAnimation from '../components/LoadingAnimation'
import Word from './Word'
import * as s from './WordHistory.sc'

export default function Top ({ api }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    console.log('in useEffect in Top')
    api.topBookmarks(300, topWords => {
      console.log(topWords)
      setWords(topWords)
    })
    document.title = 'Zeeguu Words - Ranked'
  }, [api])

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

  return (
    <>
      <s.TopMessage>
        <p>Words that you have translated ranked by importance.</p>
      </s.TopMessage>

      {words.map(each => (
        <Word key={each.id} bookmark={each} api={api} />
      ))}
    </>
  )
}
