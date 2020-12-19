import './Article.css'
import { Link } from 'react-router-dom'
import moment from 'moment'

export default function Article ({ article, dontShowPublishingTime }) {
  let topics = article.topics.split(' ').filter(each => each !== '')
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10

  return (
    <li
      key={article.id}
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
            <span className='difficulty-level articleLinkDifficultyText'>
              {difficulty}
            </span>
            <span className='articleLinkDifficultyText'>
              {article.metrics.word_count}
            </span>
          </div>
        </div>

        <div className='articleLinkSummary'>{article.summary}</div>

        <div className='articleTopics'>
          <div className='articleLinkImage'>
            <img
              src={'/news-icons/' + article.icon_name}
              className='feedIcon'
              alt=''
            />
          </div>
          {!dontShowPublishingTime && (
            <span className='publishingTime'>
              {moment.utc(article.published).fromNow()}
            </span>
          )}
          {topics.map(topic => (
            <span key={topic} className='singleTopicTag'>
              {topic}
            </span>
          ))}
        </div>
      </Link>
    </li>
  )
}
