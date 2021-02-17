import { useParams, Link } from 'react-router-dom'

import { useState, useEffect } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import Word from './Word'

import { TopMessage } from './WordHistory.sc'
import { NarrowColumn, CenteredContent } from '../components/NarrowColumn.sc'
import { OrangeButton, WhiteButton } from '../reader/ArticleReader.sc'

export default function WordsForArticle ({ api }) {
  let { articleID } = useParams()
  const [words, setWords] = useState(null)
  const [articleInfo, setArticleInfo] = useState(null)

  useEffect(() => {
    api.bookmarksForArticle(articleID, bookmarks => {
      setWords(bookmarks)
    })
    api.getArticleInfo(articleID, data => {
      setArticleInfo(data)
      document.title = 'Zeeguu Words: "' + data.title + '"'
    })
  }, [])

  if (words === null || articleInfo === null) {
    return <LoadingAnimation />
  }

  function deleteBookmark (bookmark) {
    setWords(words.filter(e => e.id !== bookmark.id))
  }

  console.log(words)
  console.log(words.length)

  return (
    <NarrowColumn>
      <br />
      <h1>Review Your Words</h1>

      <h4>Article: {articleInfo.title}</h4>
      <TopMessage>
        {words.length > 0
          ? "To ensure that a word is included in exercises: star it. Consequently delete the words you don't want to have in exercises."
          : 'The words you translate in the article will appear here for review'}
      </TopMessage>

      {words.map(each => (
        <Word
          key={each.id}
          bookmark={each}
          notifyDelete={deleteBookmark}
          api={api}
        />
      ))}

      <br />
      <br />
      <br />
      <CenteredContent>
        <Link to={`/read/article?id=${articleID}`}>
          <WhiteButton>Back to Article</WhiteButton>
        </Link>

        {words.length > 0 && (
          <Link to={`/exercises/forArticle/${articleID}`}>
            <OrangeButton>To Exercises</OrangeButton>
          </Link>
        )}
      </CenteredContent>
    </NarrowColumn>
  )
}
