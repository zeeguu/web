import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import art from './article.css'

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery () {
  return new URLSearchParams(useLocation().search)
}

export default function ArticleReader ({ api }) {
  let query = useQuery()

  const articleID = query.get('id')

  const [articleInfo, setArticleInfo] = useState()

  useEffect(() => {
    console.log('article with id ....' + articleID)
    api.getArticleInfo(articleID, data => {
      console.log(data)
      setArticleInfo(data)
    })
  }, [])

  if (!articleInfo) {
    return <div>'...'</div>
  }
  return (
    <div>
      <main clasName='layout__content'>
        <div id='main_article_content' className='page-content-container'>
          <div className='content-container'>
            <div className='page-content'>
              <div className='title translatable noselect'>
                <span id='articleTitle'>{articleInfo.title}</span>
              </div>
              <hr class='seperator'></hr>

              <div className='articleDetails'>
                <button id='bookmark_button' class='bookmark_button'>
                  <img
                    class='bookmark_icon_done'
                    src='/static/images/bookmark-done.svg'
                    alt='bookmark this article'
                  />
                  <img
                    class='bookmark_icon_undone'
                    src='/static/images/bookmark-undone.svg'
                    alt='bookmark this article'
                    style={{ display: 'none' }}
                  />
                  <span class='bookmarkText'>Save to Bookmarks</span>
                </button>

                <div id='articleInfo' class='noselect'>
                  <div id='articleURL'>
                    <a href={articleInfo.url} target='_blank' id='source'>
                      source
                    </a>
                  </div>
                  <div id='authors'>{articleInfo.authors}</div>
                </div>
              </div>

              <div id='articleContent'>
                <p className='p-article-reader'>{articleInfo.content}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
