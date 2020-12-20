import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Starred ({ zapi }) {
  const [words, setWords] = useState(null)

  useEffect(() => {
    zapi.starredBookmarks(30, starredWords => {
      console.log(starredWords)
      setWords(starredWords)
    })
  }, [])

  if (!words) {
    return (
      <>
        <h1>Starred</h1>
      </>
    )
  }

  function unstarBookmark (id) {
    console.log('unstarring bookmark')
  }

  function deleteBookmark (id) {
    console.log('delete bookmark ' + id)
  }

  return words.map(each => (
    <>
      <div className='StarredContainer'>
        <div class='one verticalLine'></div>
        <div class='two' id='star154363'>
          <Link onClick={e => unstarBookmark(each.id)}>
            <img src='/static/images/star.svg' alt='star' />
          </Link>
        </div>
        <div class='three impression'>
          {each.from}-{each.to}
        </div>
        <div class='five delete'>
          <Link onClick={e => deleteBookmark(each.id)} id='trash'>
            <img src='/static/images/trash.svg' alt='trash' />
          </Link>
        </div>
      </div>
    </>
  ))
}
