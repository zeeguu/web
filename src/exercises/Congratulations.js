import Word from '../words/Word'
import { NarrowColumn, CenteredContent } from '../components/NarrowColumn.sc'
import { OrangeButton, WhiteButton } from '../reader/ArticleReader.sc'
import { Link } from 'react-router-dom'

export default function Congratulations ({
  articleID,
  correctBookmarks,
  incorrectBookmarks,
  api
}) {
  return (
    <NarrowColumn>
      <br />

      <h2>&nbsp;&nbsp;&nbsp;Good Job! 🥳 🎉 </h2>

      {correctBookmarks.length > 0 && (
        <h3>
          😊 Correct
          <br />
          <br />
          {correctBookmarks.map(each => (
            <Word bookmark={each} api={api} />
          ))}
        </h3>
      )}

      {incorrectBookmarks.length > 0 && (
        <h3>
          <br />
          <br />
          😳 Pay more attention to
          <br />
          <br />
          {incorrectBookmarks.map(each => (
            <Word bookmark={each} api={api} />
          ))}
        </h3>
      )}

      <br />
      <br />
      <br />
      <br />
      <CenteredContent>
        <OrangeButton>
          <a href='/exercises'>
            <h2>More Exercises </h2>
          </a>
        </OrangeButton>

        <WhiteButton>
          <a href='/articles'>
            <h2>Back to Reading </h2>
          </a>
        </WhiteButton>
      </CenteredContent>
    </NarrowColumn>
  )
}
