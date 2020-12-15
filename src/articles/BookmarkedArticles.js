import { useState } from 'react'

import Article from './Article'

import './reader-list.css'
import './article-settings.css'

export default function BookmarkedArticles ({ zapi }) {
  const [articleList, setArticleList] = useState(null)

  var originalList = null

  return (
    <div>
      <h1>bookmarked articles...</h1>
    </div>
  )
}
