import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './article.css'
import { TranslatableParagraph } from './TranslatableParagraph'
import { TranslatableText } from './TranslatableText'

const Z_TAG = 'z-tag'
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

  function zTagClicked (e) {
    console.log(e.target.innerText)
  }

  if (!articleInfo) {
    return <div>'...'</div>
  }
  return (
    <>
      <header className='articleHeader'>
        <div id='toolbarContainer' className='toolbar'>
          <div className='main-tools'>
            <div>
              <button className='tool selected' id='toggle_translate'>
                <img
                  className='click_translate'
                  src='/static/images/translate.svg'
                  alt='click and translate'
                />
                <span className='tooltiptext'>click and translate</span>
              </button>
              <button className='tool' id='toggle_listen'>
                <img
                  className='click_listen'
                  src='/static/images/sound.svg'
                  alt='click and listen'
                />
                <span className='tooltiptext'>click and listen</span>
              </button>
              <button className='tool' id='toggle_undo'>
                <img src='/static/images/undo.svg' alt='undo a translation' />
                <span className='tooltiptext'>undo translation</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='layout__content'>
        <div id='main_article_content' className='page-content-container'>
          <div className='content-container'>
            <div className='page-content'>
              <div className='title translatable noselect'>
                <span id='articleTitle'>
                  <TranslatableParagraph
                    articleInfo={articleInfo}
                    zapi={api}
                    text={articleInfo.title}
                  />
                </span>
              </div>
              <hr className='seperator'></hr>

              <div className='articleDetails'>
                <button id='bookmark_button' className='bookmark_button'>
                  <img
                    className='bookmark_icon_done'
                    src='/static/images/bookmark-done.svg'
                    alt='bookmark this article'
                  />
                  <img
                    className='bookmark_icon_undone'
                    src='/static/images/bookmark-undone.svg'
                    alt='bookmark this article'
                    style={{ display: 'none' }}
                  />
                  <span className='bookmarkText'>Save to Bookmarks</span>
                </button>

                <div id='articleInfo' className='noselect'>
                  <div id='articleURL'>
                    <a href={articleInfo.url} target='_blank' id='source'>
                      source
                    </a>
                  </div>
                  <div id='authors'>{articleInfo.authors}</div>
                </div>
              </div>

              <div id='articleContent'>
                <div className='p-article-reader'>
                  <TranslatableText
                    articleInfo={articleInfo}
                    zapi={api}
                    text={articleInfo.content}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
