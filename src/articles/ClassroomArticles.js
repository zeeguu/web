import { useState } from 'react'

import Article from './Article'

// import './reader-list.css'
// import './article-settings.css'

export default function ClassroomArticles ({ zapi }) {
  const [articleList, setArticleList] = useState(null)

  if (articleList == null) {
    zapi.getCohortArticles(articles => {
      console.log(articles)
      setArticleList(articles)
    })

    return (
      <div>
        <p>loading...</p>
      </div>
    )
  }

  if (articleList.length === 0) {
    return <div>no articles found</div>
  }

  return (
    <div>
      <ul id='articleLinkList' className='articleLinkList'>
        {articleList.map(each => (
          <Article key={each.id} article={each} dontShowImage={true} />
        ))}
      </ul>
    </div>
  )
}
