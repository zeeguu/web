import { useState } from 'react'

import ArticleOverview from './ArticleOverview'

import SortingButtons from './SortingButtons'
import Interests from './Interests'
import SearchField from './SearchField'
import * as s from './NewArticles.sc'
import LoadingAnimation from '../components/LoadingAnimation'

export default function NewArticles ({ api }) {
  const [articleList, setArticleList] = useState(null)

  var originalList = null

  if (articleList == null) {
    api.getUserArticles(articles => {
      console.log(articles)
      setArticleList(articles)
      originalList = [...articles]
    })

    document.title = 'Zeeguu Articles - Find'

    return <LoadingAnimation />
  }

  function articlesListShouldChange () {
    setArticleList(null)
    api.getUserArticles(articles => {
      setArticleList(articles)
      originalList = [...articles]
    })
  }

  return (
    <>
      <s.MaterialSelection>
        <Interests
          api={api}
          articlesListShouldChange={articlesListShouldChange}
        />

        <SearchField />
      </s.MaterialSelection>

      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />

      {articleList.map(each => (
        <ArticleOverview key={each.id} article={each} />
      ))}
    </>
  )
}
