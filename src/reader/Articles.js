import AllTexts from './ArticleList'
import './reader-header.css'
import { ReadingTab, SeparatorBar } from './ReadingTab'
import { PrivateRoute } from '../PrivateRoute'
import ArticleReader from './ArticleReader'

export default function Articles ({ api }) {
  return (
    <div>
      <div>
        <header>
          <div className='select-article'>
            <h1>Select an Article</h1>

            <div className='all__tabs'>
              <ReadingTab
                id='inbox_tab'
                text='Articles'
                link='/read'
                isActive={true}
              />

              <SeparatorBar />

              <ReadingTab
                id='starred_tab'
                text='Bookmarks'
                link='/read/bookmarks'
              />

              <SeparatorBar />

              <ReadingTab
                id='classroom_tab'
                text='Classroom'
                link='/read/classroom'
              />
            </div>
          </div>
        </header>

        <PrivateRoute path='/read' exact zapi={api} component={AllTexts} />
      </div>

      <PrivateRoute path='/read/article' api={api} component={ArticleReader} />
    </div>
  )
}
