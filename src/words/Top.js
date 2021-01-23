import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Top ({ zapi }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    console.log('in useEffect in Top')
    zapi.topBookmarks(300, topWords => {
      console.log(topWords)
      setWords(topWords)
    })
  }, [zapi])

  if (!words) {
    return (
      <>
        <h1>loading...</h1>
      </>
    )
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

  function toggleStarred (bookmark) {
    if (bookmark.starred) {
      zapi.unstarBookmark(bookmark.id)
    } else {
      zapi.starBookmark(bookmark.id)
    }

    setWords(
      words.map(e => (e.id !== bookmark.id ? e : { ...e, starred: true }))
    )
  }

  return (
    <div className='mainWordsContainer'>
      <div className='topMessageContainer'>
        <div className='topMessage'>
          Top Words are the words that are important to learn in the language
          you are practicing. The higher the "importance", the more often does
          the word appear in the language.
        </div>
      </div>

      <div class='importance'>
        <p>Importance</p>
      </div>

      {words.map(each => (
        <div id='bookmark39562' class='StarredContainer topWords'>
          <div class='verticalLine top'></div>

          <div class='one trash'>
            <Link
              to='/'
              onClick={e => {
                e.preventDefault()
                deleteBookmark(each.id)
              }}
              id='trash'
            >
              <img src='/static/images/trash.svg' alt='trash' />
            </Link>
          </div>

          <div class='two' id='star39562'>
            <Link
              to='/'
              onClick={e => {
                e.preventDefault()
                toggleStarred(each)
              }}
            >
              <img
                src={
                  '/static/images/star' + (each.starred ? '.svg' : '_empty.svg')
                }
                alt='star'
              />
            </Link>
          </div>

          <div class='three impression'>
            {each.from} - {each.to}
          </div>

          <div class='four rank'>
            <p class='word-rank'>{each.origin_importance}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
