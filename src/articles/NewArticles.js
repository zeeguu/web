import { useState } from 'react'

import Article from './Article'

// import './reader-list.css'
// import './article-settings.css'
import SortingButtons from './SortingButtons'
import InterestsAndSearch from './InterestsAndSearch'

export default function NewArticles ({ zapi }) {
  const [articleList, setArticleList] = useState(null)

  var originalList = null

  if (articleList == null) {
    zapi.getUserArticles(articles => {
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

  function articlesListShouldChange () {
    setArticleList(null)
    zapi.getUserArticles(articles => {
      setArticleList(articles)
      originalList = [...articles]
    })
  }

  return (
    <div>
      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />

      <InterestsAndSearch
        zapi={zapi}
        articlesListShouldChange={articlesListShouldChange}
      />

      <ul id='articleLinkList' className='articleLinkList'>
        {articleList.map(each => (
          <Article key={each.id} article={each} />
        ))}
      </ul>
    </div>
  )
}
