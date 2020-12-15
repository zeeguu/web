import './Article.css'
import { Link } from 'react-router-dom'

export default function Article ({ article }) {
  let topics = article.topics.split(' ').filter(each => each != '')
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10
  console.log(topics)

  return (
    <li
      className={
        article.metrics.word_count +
        ' ' +
        difficulty +
        ' articleLinkEntry fadeOutOnClick'
      }
    >
      <Link to={`/read/article?id=${article.id}`}>
        <div className='articleLinkHeader'>
          <div className='articleLinkTitle headerElement'>{article.title}</div>
          <div className='articleLinkDifficulty headerElement'>
            <span class='difficulty-level articleLinkDifficultyText'>
              {difficulty}
            </span>
            <span class='articleLinkDifficultyText'>
              {article.metrics.word_count}
            </span>
          </div>
        </div>

        <div class='articleLinkSummary'>{article.summary}</div>

        <div class='articleTopics'>
          <div class='articleLinkImage'>
            <img src='/news-icons/dr.dk.png' class='feedIcon' />
          </div>
          <span class='publishingTime'>(4 hours ago)</span>
          {topics.map(topic => (
            <span class='singleTopicTag'>{topic}</span>
          ))}
        </div>
      </Link>
    </li>
  )
}
