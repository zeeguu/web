import * as s from './WordList.sc'

export default function Word ({ bookmark, deleteBookmark, toggleStarred }) {
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
    <s.Word key={bookmark.id}>
      <s.TrashIcon onClick={e => deleteBookmark(bookmark)}>
        <img src='/static/images/trash.svg' alt='trash' />
      </s.TrashIcon>

      <s.WordPair>
        <div>
          {bookmark.from}

          {/* <span style={{ color: "black" }}> – </span> */}
          <s.Importance>
            <span className={'im' + importance}>{importanceBars}</span>
          </s.Importance>
          <p>{bookmark.to}</p>
        </div>
      </s.WordPair>

      <s.StarIcon onClick={e => toggleStarred(bookmark)}>
        <img
          src={
            '/static/images/star' + (bookmark.starred ? '.svg' : '_empty.svg')
          }
          alt='star'
        />
      </s.StarIcon>
    </s.Word>
  )
}
