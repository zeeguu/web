import { useEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import { setTitle } from '../assorted/setTitle'
import Word from './Word'

import * as s from '../components/TopMessage.sc'

export default function Starred ({ api }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    api.starredBookmarks(30, starredWords => {
      setWords(starredWords)
    })
    setTitle('Starred Words')
    // eslint-disable-next-line
  }, [])

  if (!words) {
    return <LoadingAnimation />
  }

  if (words.length === 0) {
    return <s.TopMessage>You have no starred words yet.</s.TopMessage>
  }

  function bookmarkHasBeenUnstared (bookmark) {
    setWords(words.filter(w => w.id !== bookmark.id))
  }

  return (
    <>
      {words.map(bookmark => (
        <Word
          key={bookmark.id}
          bookmark={bookmark}
          api={api}
          notifyUnstar={bookmarkHasBeenUnstared}
        />
      ))}
    </>
  )
}
