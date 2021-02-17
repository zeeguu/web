import { useEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import { setTitle } from '../components/setTitle'
import Word from './Word'
import * as s from '../components/TopMessage.sc'

export default function Learned ({ api }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    api.learnedBookmarks(300, learnedWords => {
      setWords(learnedWords)
    })
    setTitle('Learned Words')
  }, [api])

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
        <Word key={each.id} bookmark={each} api={api} hideStar={true}>
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
