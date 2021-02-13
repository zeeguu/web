import { useParams, Link } from 'react-router-dom'

import { useState, useEffect } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import Word from './Word'

import { TopMessage } from './WordHistory.sc'
import { NarrowColumn, CenteredContent } from '../components/NarrowColumn.sc'
import { OrangeButton, WhiteButton } from '../reader/ArticleReader.sc'

export default function WordsForArticle ({ zapi }) {
  let { articleID } = useParams()
  const [words, setWords] = useState(null)
  const [articleInfo, setArticleInfo] = useState(null)

  useEffect(() => {
    zapi.bookmarksForArticle(articleID, result => {
      setWords(result.bookmarks)
    })
    zapi.getArticleInfo(articleID, data => {
      setArticleInfo(data)
    })
  }, [])

  if (words === null || articleInfo === null) {
    return <LoadingAnimation />
  }

  function deleteBookmark (bookmark) {
    zapi.deleteBookmark(bookmark.id)
    setWords(words.filter(e => e.id !== bookmark.id))
  }

  return (
    <NarrowColumn>
      <br />
      <br />
      <br />
      <h1>Review Your Words</h1>

      <TopMessage>
        To ensure that a word is included in exercises: star it. Consequently
        delete the words you don't want to have in exercises.
      </TopMessage>

      <h4>Article: {articleInfo.title}</h4>

      {words.map(each => (
        <Word
          key={each.id}
          bookmark={each}
          deleteBookmark={deleteBookmark}
          zapi={zapi}
        />
      ))}

      <CenteredContent>
        <Link to={`/read/article?id=${articleID}`}>
          <WhiteButton>Back to Article</WhiteButton>
        </Link>

        <Link to={`/words/forArticle/${articleID}`}>
          <OrangeButton>To Exercises</OrangeButton>
        </Link>
      </CenteredContent>
    </NarrowColumn>
  )
}
