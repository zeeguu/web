import { Link } from 'react-router-dom'

export function WordsOnDate ({ day, deleteBookmark, toggleStarred }) {
  function groupBy (list, keyGetter) {
    const map = new Map()
    list.forEach(item => {
      const key = keyGetter(item)
      const collection = map.get(key)
      if (!collection) {
        map.set(key, [item])
      } else {
        collection.push(item)
      }
    })
    return map
  }

  let bookmarks_by_article = groupBy(day.bookmarks, x => x.article_id)

  let articleIDs = Array.from(bookmarks_by_article.keys())

  return (
    <div key={day.date}>
      <div className='outerDate'>
        <div className='dateContainer'>
          <h1 className='date'>{day.date} </h1>
        </div>
      </div>

      {articleIDs.map(article_id => (
        <div key={article_id}>
          <div className='articleContainer'>
            <div className='verticalLine'></div>
            <div className='titleContainer'>
              <h2 className='articleTitle'>
                {bookmarks_by_article.get(article_id)[0].article_title}
              </h2>
            </div>
            <div className='openArticle'>
              <Link className='open' to={'/read/article?id=' + article_id}>
                <p className='customP'>Open</p>
              </Link>
            </div>
          </div>
          <table width='100%' className='table table-no-borders'>
            <tbody>
              {bookmarks_by_article.get(article_id).map(bookmark => (
                <tr key={bookmark.id}>
                  <td
                    style={{
                      textAlign: 'left',
                      width: '1em',
                      paddingLeft: '1em',
                      paddingTop: '0.4em'
                    }}
                  >
                    <Link
                      to='/'
                      onClick={e => {
                        e.preventDefault()
                        deleteBookmark(day, bookmark)
                      }}
                      id='trash'
                    >
                      <img src='/static/images/trash.svg' alt='trash' />
                    </Link>
                  </td>

                  <td width='40px'>
                    <div onClick={e => toggleStarred(day, bookmark)}>
                      <img
                        src={
                          '/static/images/star' +
                          (bookmark.starred ? '.svg' : '_empty.svg')
                        }
                        alt='star'
                      />
                    </div>
                  </td>

                  <td colSpan='2' className='word-details-td'>
                    <div className='impression'>
                      {bookmark.from}
                      <span style={{ color: 'black' }}> – </span>
                      {bookmark.to}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
