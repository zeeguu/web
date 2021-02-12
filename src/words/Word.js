import * as s from './Word.sc'

export default function Word ({
  bookmark,
  deleteBookmark,
  toggleStarred,
  children
}) {
  let importance = Math.min(10, Math.floor(bookmark.origin_importance))
  let importanceBars = ''
  if (importance) {
    // importanceBars = '▰'.repeat(importance) + '▱'.repeat(11 - importance)
    // importanceBars = '⣿'.repeat(importance) + '⣀'.repeat(11 - importance)
    importanceBars = '■'.repeat(importance) + '□'.repeat(11 - importance)

    // ideas from:
    // https://changaco.oy.lc/unicode-progress-bars/
  }

  return (
    <>
      <s.Word key={bookmark.id}>
        <s.TrashIcon onClick={e => deleteBookmark(bookmark)}>
          <img src='/static/images/trash.svg' alt='trash' />
        </s.TrashIcon>

        {toggleStarred && (
          <s.StarIcon onClick={e => toggleStarred(bookmark)}>
            <img
              src={
                '/static/images/star' +
                (bookmark.starred ? '.svg' : '_empty.svg')
              }
              alt='star'
            />
          </s.StarIcon>
        )}

        <s.WordPair>
          <div className='from'>{bookmark.from}</div>

          <s.Importance>
            <span className={'im' + importance}>{importanceBars}</span>
          </s.Importance>

          <div className='to'>{bookmark.to}</div>
        </s.WordPair>
      </s.Word>
      {children}

      <s.Spacer />
    </>
  )
}
