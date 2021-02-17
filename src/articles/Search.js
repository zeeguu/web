import { useParams } from 'react-router-dom'
import SortingButtons from './SortingButtons'
import { useState } from 'react'
import ArticleOverview from './ArticleOverview'
import LoadingAnimation from '../components/LoadingAnimation'

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
      <br />
      <div className='searchText articleLinkEntry'>
        You searched for: {term}
        <button
          className='deleteSearch headerElement'
          onClick={e => (window.location = '/articles')}
        >
          X
        </button>
      </div>

      <br />
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
