import { useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import { setTitle } from '../components/setTitle'

import ArticleOverview from './ArticleOverview'

import SortingButtons from './SortingButtons'

import * as s from '../components/TopMessage.sc'

export default function ClassroomArticles ({ api }) {
  const [articleList, setArticleList] = useState(null)

  let originalList = articleList

  if (articleList == null) {
    api.getCohortArticles(articles => {
      setArticleList(articles)
    })

    setTitle('Classroom Articles')

    return <LoadingAnimation />
  }

  if (articleList.length === 0) {
    return (
      <s.TopMessage>
        <p>There are no articles in your classroom</p>
      </s.TopMessage>
    )
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
