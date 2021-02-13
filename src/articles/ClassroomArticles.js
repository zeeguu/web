import { useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'

import ArticleOverview from './ArticleOverview'

import SortingButtons from './SortingButtons'

export default function ClassroomArticles ({ zapi }) {
  const [articleList, setArticleList] = useState(null)

  let originalList = articleList

  if (articleList == null) {
    zapi.getCohortArticles(articles => {
      console.log(articles)
      setArticleList(articles)
    })

    document.title = 'Zeeguu Articles - Classroom'

    return <LoadingAnimation />
  }

  if (articleList.length === 0) {
    return <div>no articles found</div>
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
        <ArticleOverview key={each.id} article={each} dontShowImage={true} />
      ))}
    </>
  )
}
