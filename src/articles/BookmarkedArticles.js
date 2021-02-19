import { useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import { setTitle } from '../assorted/setTitle'

import ArticleOverview from './ArticlePreview'

import SortingButtons from './SortingButtons'

import * as s from '../components/TopMessage.sc'

export default function BookmarkedArticles ({ api }) {
  const [articleList, setArticleList] = useState(null)

  let originalList = articleList

  if (articleList == null) {
    api.getBookmarkedArticles(articles => {
      setArticleList(articles)
    })

    setTitle('Bookmarked Articles')

    return <LoadingAnimation />
  }

  if (articleList.length === 0) {
    return <s.TopMessage>You haven't bookmarked any articles yet</s.TopMessage>
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
