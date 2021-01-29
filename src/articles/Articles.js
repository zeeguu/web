import NewArticles from './NewArticles'
import BookmarkedArticles from './BookmarkedArticles'
// import './reader-header.css'
import { ReadingTab, SeparatorBar } from './ReadingTab'
import { PrivateRoute } from '../PrivateRoute'
import Search from './Search'
import ClassroomArticles from './ClassroomArticles'

export default function Articles ({ api }) {
  return (
    <>
      <header>
        <div className='select-article'>
          <h1>Select an Article</h1>

          <div className='all__tabs'>
            <ReadingTab text='New' link='/articles' />

            <SeparatorBar />

            <ReadingTab text='Bookmarked' link='/articles/bookmarked' />

            <SeparatorBar />

            <ReadingTab text='Classroom' link='/articles/classroom' />
          </div>
        </div>
      </header>

      <PrivateRoute path='/articles' exact zapi={api} component={NewArticles} />

      <PrivateRoute
        path='/articles/search/:term'
        zapi={api}
        component={Search}
      />

      <PrivateRoute
        path='/articles/bookmarked'
        zapi={api}
        component={BookmarkedArticles}
      />

      <PrivateRoute
        path='/articles/classroom'
        zapi={api}
        component={ClassroomArticles}
      />
    </>
  )
}
