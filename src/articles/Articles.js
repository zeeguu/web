import NewArticles from './NewArticles'
import BookmarkedArticles from './BookmarkedArticles'

import { PrivateRoute } from '../PrivateRoute'
import Search from './Search'
import ClassroomArticles from './ClassroomArticles'
import TopTabs from '../components/TopTabs'

import * as s from './Articles.sc'

export default function Articles ({ api }) {
  return (
    <>
      {/* Rendering top menu first, then routing to corresponding page */}
      <s.Articles>
        <TopTabs
          title='Articles'
          tabsAndLinks={{
            Find: '/articles',
            Bookmarked: '/articles/bookmarked',
            Classroom: '/articles/classroom'
          }}
        />

        <PrivateRoute
          path='/articles'
          exact
          api={api}
          component={NewArticles}
        />
        <PrivateRoute
          path='/articles/search/:term'
          api={api}
          component={Search}
        />
        <PrivateRoute
          path='/articles/bookmarked'
          api={api}
          component={BookmarkedArticles}
        />
        <PrivateRoute
          path='/articles/classroom'
          api={api}
          component={ClassroomArticles}
        />
      </s.Articles>
    </>
  )
}
