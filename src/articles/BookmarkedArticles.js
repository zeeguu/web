import { useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import { setTitle } from '../components/setTitle'

import ArticleOverview from './ArticleOverview'

import SortingButtons from './SortingButtons'

import * as s from '../components/TopMessage.sc'

export default function BookmarkedArticles ({ api }) {
  const [articleList, setArticleList] = useState(null)

  let originalList = articleList

  if (articleList == null) {
    api.getBookmarkedArticles(articles => {
      console.log(articles)
      setArticleList(articles)
    })

    setTitle('Bookmarked Articles')

    return <LoadingAnimation />
  }

  if (articleList.length === 0) {
    return (
      <s.TopMessage>
        <p>You haven't bookmarked any articles yet</p>
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
        <ArticleOverview
          key={each.id}
          article={each}
          dontShowPublishingTime={true}
        />
      ))}
    </>
  )
}
