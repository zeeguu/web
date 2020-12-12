import AllTexts from './ArticleList'
import MenuOnTheLeft from '../components/MenuOnTheLeft'
import './reader-header.css'
import { ReadingTab, SeparatorBar } from './ReadingTab'
import SideBar from '../components/SideBar'

export default function Articles ({ zapi }) {
  return (
    <div className='main-container'>
      <MenuOnTheLeft />
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

        <AllTexts zapi={zapi} />
      </div>
    </div>
  )
}
