import { useState } from 'react'

export default function SortingButtons ({
  articleList,
  setArticleList,
  originalList
}) {
  const [currentSort, setCurrentSort] = useState('')
  const [wordCountSortState, setwordCountSortState] = useState('')

  function sortArticleList (sorting) {
    setArticleList([...articleList].sort(sorting))
  }

  function changeDifficultySorting (
    e,
    currentSort,
    setCurrentSort,
    setOtherSort,
    sortingFunction
  ) {
    if (currentSort === 'flip clicked') {
      sortArticleList(sortingFunction)
      setCurrentSort('clicked')
      setOtherSort('')
    } else if (currentSort === 'clicked') {
      setArticleList(originalList)
      setCurrentSort('')
    } else {
      sortArticleList((a, b) => 0 - sortingFunction(a, b))
      setCurrentSort('flip clicked')
      setOtherSort('')
    }
  }

  return (
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
  )
}
