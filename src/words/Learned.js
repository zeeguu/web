import { useEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import Word from './Word'
import * as s from './WordHistory.sc'

export default function Learned ({ zapi }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    zapi.learnedBookmarks(300, learnedWords => {
      setWords(learnedWords)
    })
    document.title = 'Zeeguu Words - Learned'
  }, [zapi])

  if (!words) {
    return <LoadingAnimation />
  }

  let whatAreLearnedWordsMessage = (
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
    </>
  )

  if (words.length === 0) {
    return whatAreLearnedWordsMessage
  }

  return (
    <>
      {whatAreLearnedWordsMessage}

      {words.map(each => (
        <Word key={each.id} bookmark={each} zapi={zapi} hideStar={true}>
          <small>
            Correct on:
            {' ' + each.learned_datetime}
            <br />
            <br />
          </small>
        </Word>
      ))}
    </>
  )
}
