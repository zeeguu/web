import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MenuOnTheLeft from '../components/MenuOnTheLeft'

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery () {
  return new URLSearchParams(useLocation().search)
}

export default function ArticleReader ({ api }) {
  let query = useQuery()

  const articleID = query.get('id')

  const [articleInfo, setArticleInfo] = useState()

  useEffect(() => {
    console.log('article with id ....' + articleID)
    api.getArticleInfo(articleID, data => {
      console.log(data)
      setArticleInfo(data)
    })
  }, [])

  if (!articleInfo) {
    return (
      <div>
        <MenuOnTheLeft />
        '...'
      </div>
    )
  }
  return (
    <div>
      <MenuOnTheLeft />
      <h1>{articleInfo.title}</h1>
      <h4>{articleInfo.authors}</h4>
      <h5>{articleInfo.published}</h5>
      <p>{articleInfo.content}</p>
    </div>
  )
}
