import { useEffect, useState } from 'react'

import LoadingAnimation from '../components/LoadingAnimation'
import { setTitle } from '../components/setTitle'
import Word from './Word'
import * as s from '../components/TopMessage.sc'

export default function Top ({ api }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    api.topBookmarks(300, topWords => {
      console.log(topWords)
      setWords(topWords)
    })
    setTitle('Ranked Words')
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
        Words that you have translated ranked by importance.
      </s.TopMessage>

      {words.map(each => (
        <Word key={each.id} bookmark={each} api={api} />
      ))}
    </>
  )
}
