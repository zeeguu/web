import { useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'

import ArticleOverview from './ArticleOverview'

import SortingButtons from './SortingButtons'

export default function BookmarkedArticles ({ zapi }) {
  const [articleList, setArticleList] = useState(null)

  let originalList = articleList

  if (articleList == null) {
    zapi.getBookmarkedArticles(articles => {
      console.log(articles)
      setArticleList(articles)
    })

    document.title = 'Zeeguu Articles- Bookmarked'

    return <LoadingAnimation />
  }

  return (
    <>
      <br />
      <br />
      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />
      {articleList.map(each => (
        <ArticleOverview
          key={each.id}
          article={each}
          dontShowPublishingTime={true}
        />
      ))}
    </>
  )
}
