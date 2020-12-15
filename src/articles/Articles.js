import AllArticles from './AllArticles'
import BookmarkedArticles from './BookmarkedArticles'
import './reader-header.css'
import { ReadingTab, SeparatorBar } from './ReadingTab'
import { PrivateRoute } from '../PrivateRoute'

import { NavLink } from 'react-router-dom'

export default function Articles ({ api }) {
  return (
    <>
      <header>
        <div className='select-article'>
          <h1>Select an Article</h1>

          <div className='all__tabs'>
            <ReadingTab
              id='inbox_tab'
              text='New'
              link='/articles'
              isActive={true}
            />

            <SeparatorBar />

            <ReadingTab
              id='starred_tab'
              text='Bookmarked'
              link='/articles/bookmarked'
            />

            <SeparatorBar />

            <ReadingTab
              id='classroom_tab'
              text='Classroom'
              link='/articles/classroom'
            />
          </div>
        </div>
      </header>

      <PrivateRoute path='/articles' exact zapi={api} component={AllArticles} />

      <PrivateRoute
        path='/articles/bookmarked'
        zapi={api}
        component={BookmarkedArticles}
      />
    </>
  )
}
