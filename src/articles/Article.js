import './Article.css'
import { Link } from 'react-router-dom'
import moment from 'moment'

export default function Article ({ article }) {
  let topics = article.topics.split(' ').filter(each => each != '')
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10
  console.log(topics)

  console.log(article)
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
            <img src={'/news-icons/' + article.icon_name} class='feedIcon' />
          </div>
          <span class='publishingTime'>
            {moment.utc(article.published).fromNow()}
          </span>
          {topics.map(topic => (
            <span class='singleTopicTag'>{topic}</span>
          ))}
        </div>
      </Link>
    </li>
  )
}
