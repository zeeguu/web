import { useState } from 'react'

import Article from './Article'

import './reader-list.css'
import './article-settings.css'

export default function BookmarkedArticles ({ zapi }) {
  const [articleList, setArticleList] = useState(null)

  var originalList = null

  if (articleList == null) {
    zapi.getBookmarkedArticles(articles => {
      console.log(articles)
      setArticleList(articles)
      originalList = [...articles]
    })

    return (
      <div>
        <p>loading...</p>
      </div>
    )
  }

  return (
    <div>
      <ul id='articleLinkList' className='articleLinkList'>
        {articleList.map(each => (
          <Article key={each.id} article={each} dontShowPublishingTime={true} />
        ))}
      </ul>
    </div>
  )
}
