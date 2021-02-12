import { useEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import WordList from './WordList'

export default function Starred ({ zapi }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    zapi.starredBookmarks(30, starredWords => {
      setWords(starredWords)
    })
  }, [zapi])

  if (!words) {
    return <LoadingAnimation />
  }

  if (words.length === 0) {
    return (
      <div className='topMessageContainer'>
        <div className='topMessage'>You have no starred words yet.</div>
      </div>
    )
  }

  function unstarBookmark (bookmark) {
    zapi.unstarBookmark(bookmark.id)
    setWords(words.filter(w => w.id !== bookmark.id))
  }

  function deleteBookmark (bookmark) {
    zapi.deleteBookmark(bookmark.id)
    setWords(words.filter(w => w.id !== bookmark.id))
  }

  return (
    <>
      <WordList
        wordList={words}
        deleteBookmark={deleteBookmark}
        toggleStarred={unstarBookmark}
      />
    </>
  )
}
