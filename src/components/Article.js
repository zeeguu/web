import './Article.css'
import { Link } from 'react-router-dom'

export default function Article ({ article }) {
  return (
    <div className='articleLinkEntry'>
      <h3>
        <img
          alt=''
          style={{ width: 20 }}
          src={`/news-icons/${article.icon_name}`}
        />{' '}
        &nbsp;
        <Link to={`/read/article?id=${article.id}`}>{article.title}</Link>(
        {(article.metrics.difficulty * 100) / 10}, {article.metrics.word_count})
      </h3>
      {article.summary}
      <br />
      <br />( {article.topics.trim()} )
    </div>
  )
}
