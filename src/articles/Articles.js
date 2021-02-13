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

        {/* Routing */}
        <PrivateRoute
          path='/articles'
          exact
          zapi={api}
          component={NewArticles}
        />
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
      </s.Articles>
    </>
  )
}
