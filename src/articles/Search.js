import { useParams } from 'react-router-dom'
import SortingButtons from './SortingButtons'
import { useState } from 'react'
import ArticleOverview from './ArticlePreview'
import LoadingAnimation from '../components/LoadingAnimation'
import * as s from './Search.sc'

export default function Search ({ api }) {
  const [articleList, setArticleList] = useState(null)

  let { term } = useParams()

  var originalList = null

  if (articleList == null) {
    api.search(term, articles => {
      setArticleList(articles)
      originalList = [...articles]
    })

    return <LoadingAnimation text='searching...' />
  }

  return (
    <>
      <s.TopMessage>
        <p>
          {' '}
          You searched for: {term}
          <s.ClosePopupButton onClick={e => (window.location = '/articles')}>
            X
          </s.ClosePopupButton>
        </p>
      </s.TopMessage>

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
