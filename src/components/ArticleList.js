import { useState } from 'react'
import { getUserArticles } from '../api/zeeguuAPI'
import Article from './Article'

export default function AllTexts () {
  const [articleList, setArticleList] = useState(null)
  const [currentSort, setCurrentSort] = useState('')
  const [wordCountSortState, setwordCountSortState] = useState('')

  var originalList = null

  if (articleList == null) {
    getUserArticles(articles => {
      console.log(articles)
      setArticleList(articles)
      originalList = [...articles]
    })

    return (
      <div>
        <h1>Your Texts</h1>
        <p>loading...</p>
      </div>
    )
  }

  function changeDifficultySorting (
    e,
    currentSort,
    setCurrentSort,
    sortingFunction
  ) {
    if (currentSort === '△') {
      setArticleList(articleList.sort(sortingFunction))
      setCurrentSort('▽')
    } else if (currentSort === '▽') {
      setArticleList(originalList)
      setCurrentSort('')
    } else {
      setArticleList(articleList.sort((a, b) => 0 - sortingFunction(a, b)))
      setCurrentSort('△')
    }
  }

  return (
    <div>
      <p>
        Sort By: &nbsp;
        <button
          onClick={e =>
            changeDifficultySorting(
              e,
              currentSort,
              setCurrentSort,
              (a, b) => b.metrics.difficulty - a.metrics.difficulty
            )
          }
        >
          Difficulty
        </button>
        {currentSort}
        &nbsp;
        <button
          onClick={e =>
            changeDifficultySorting(
              e,
              wordCountSortState,
              setwordCountSortState,
              (a, b) => b.metrics.word_count - a.metrics.word_count
            )
          }
        >
          Words
        </button>
        {wordCountSortState}
      </p>

      {articleList.map(each => (
        <Article key={each.id} article={each} />
      ))}
    </div>
  )
}
