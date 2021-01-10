import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './article.css'
import { TranslatableParagraph } from './TranslatableParagraph'
import { TranslatableText } from './TranslatableText'
import { useSpeechSynthesis } from 'react-speech-kit'
import InteractiveText from './InteractiveText'

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
  const [interactiveText, setInteractiveText] = useState()

  const [translating, setTranslating] = useState(true)
  const [pronouncing, setPronouncing] = useState(false)

  const { speak, voices } = useSpeechSynthesis()

  const [undoCount, setUndoCount] = useState(0)

  useEffect(() => {
    console.log('article with id ....' + articleID)

    api.getArticleInfo(articleID, data => {
      console.log(data)
      setInteractiveText(new InteractiveText(data, api))
      setArticleInfo(data)
    })
  }, [])

  function randomElement (x) {
    return x[Math.floor(Math.random() * x.length)]
  }

  function getRandomVoice (voices, language) {
    let x = randomElement(voices.filter(v => v.lang.includes(language)))
    console.log(x)
    return x
  }

  function pronounce (word) {
    let voice = getRandomVoice(voices, articleInfo.language)
    speak({ text: word.word, voice: voice })
  }

  function toggle (state, togglerFunction) {
    togglerFunction(!state)
  }

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
              <button
                className={'tool ' + (translating ? 'selected' : '')}
                id='toggle_translate'
                onClick={e => toggle(translating, setTranslating)}
              >
                <img
                  className='click_translate'
                  src='/static/images/translate.svg'
                  alt='translate on click'
                />
                <span className='tooltiptext'>translate on click</span>
              </button>
              <button
                className={'tool ' + (pronouncing ? 'selected' : '')}
                id='toggle_listen'
                onClick={e => toggle(pronouncing, setPronouncing)}
              >
                <img
                  className='click_listen'
                  src='/static/images/sound.svg'
                  alt='listen on click'
                />
                <span className='tooltiptext'>listen on click</span>
              </button>
              <button
                className='tool'
                id='toggle_undo'
                onClick={e => {
                  console.log('about to undo...')
                  interactiveText.undo()
                  setUndoCount(undoCount + 1)
                }}
              >
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
                    interactiveText={interactiveText}
                    articleInfo={articleInfo}
                    zapi={api}
                    text={articleInfo.content}
                    translating={translating}
                    pronouncing={pronouncing}
                    pronounce={pronounce}
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
