import { useState } from 'react'

import Article from './Article'

import './reader-list.css'
import './article-settings.css'

export default function AllTexts ({ zapi }) {
  const [articleList, setArticleList] = useState(null)
  const [currentSort, setCurrentSort] = useState('')
  const [wordCountSortState, setwordCountSortState] = useState('')

  var originalList = null

  if (articleList == null) {
    zapi.getUserArticles(articles => {
      setArticleList(articles)
      originalList = [...articles]
    })

    return (
      <div>
        <p>loading...</p>
      </div>
    )
  }

  function changeDifficultySorting (
    e,
    currentSort,
    setCurrentSort,
    setOtherSort,
    sortingFunction
  ) {
    if (currentSort === 'flip clicked') {
      setArticleList(articleList.sort(sortingFunction))
      setCurrentSort('clicked')
      setOtherSort('')
    } else if (currentSort === 'clicked') {
      setArticleList(originalList)
      setCurrentSort('')
    } else {
      setArticleList(articleList.sort((a, b) => 0 - sortingFunction(a, b)))
      setCurrentSort('flip clicked')
      setOtherSort('')
    }
  }

  return (
    <div>
      <div
        className='sortingCategories'
        id='sortingBox'
        style={{ display: 'flex' }}
      >
        <div className='sortContainer'>
          <p id='sortby'> Sort by:</p>
          <div className='wordsSorting'>
            <div className='wordLabel'>words</div>
            <div
              id='triangleWords'
              className={'triangle ' + wordCountSortState}
              onClick={e =>
                changeDifficultySorting(
                  e,
                  wordCountSortState,
                  setwordCountSortState,
                  setCurrentSort,
                  (a, b) => b.metrics.word_count - a.metrics.word_count
                )
              }
            ></div>
          </div>
          <div className='levelSorting'>
            <div className='levelLabel'>level</div>
            <div
              id='triangleLevel'
              className={'triangle ' + currentSort}
              onClick={e =>
                changeDifficultySorting(
                  e,
                  currentSort,
                  setCurrentSort,
                  setwordCountSortState,
                  (a, b) => b.metrics.difficulty - a.metrics.difficulty
                )
              }
            ></div>
          </div>
        </div>
      </div>

      <ul id='articleLinkList' className='articleLinkList'>
        {articleList.map(each => (
          <Article key={each.id} article={each} />
        ))}
      </ul>
    </div>
  )
}
