import { useEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import Word from './Word'

export default function Starred ({ zapi }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    zapi.starredBookmarks(30, starredWords => {
      console.log(starredWords)
      setWords(starredWords)
    })
    document.title = 'Zeeguu Words - Starred'
  }, [])

  if (!words) {
    return <LoadingAnimation />
  }

  console.log(words)
  console.log(words.length)

  if (words.length === 0) {
    return (
      <div className='topMessageContainer'>
        <div className='topMessage'>You have no starred words yet.</div>
      </div>
    )
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
          zapi={zapi}
          notifyUnstar={bookmarkHasBeenUnstared}
        />
      ))}
    </>
  )
}
