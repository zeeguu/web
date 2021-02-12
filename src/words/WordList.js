import Word from './Word'

export default function WordList ({ wordList, deleteBookmark, toggleStarred }) {
  return (
    <>
      {wordList.map(bookmark => (
        <Word
          bookmark={bookmark}
          deleteBookmark={deleteBookmark}
          toggleStarred={toggleStarred}
        />
      ))}
    </>
  )
}
