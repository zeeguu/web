import { useEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import { setTitle } from '../components/setTitle'
import Word from './Word'

export default function Starred ({ api }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    api.starredBookmarks(30, starredWords => {
      console.log(starredWords)
      setWords(starredWords)
    })
    setTitle('Starred Words')
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
          api={api}
          notifyUnstar={bookmarkHasBeenUnstared}
        />
      ))}
    </>
  )
}
