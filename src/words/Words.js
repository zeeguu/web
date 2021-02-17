import { PrivateRoute } from '../PrivateRoute'
import WordHistory from './WordHistory'
import Starred from './Starred'
import Learned from './Learned'
import Top from './Top'
import * as s from '../components/NarrowColumn.sc'
import TopTabs from '../components/TopTabs'

export default function Words ({ api }) {
  return (
    <s.NarrowColumn>
      <TopTabs
        title='Your Words'
        tabsAndLinks={{
          History: '/words/history',
          Starred: '/words/starred',
          Ranked: '/words/top',
          Learned: '/words/learned'
        }}
      />

      <PrivateRoute
        path='/words/history'
        exact
        api={api}
        component={WordHistory}
      />

      <PrivateRoute path='/words/starred' api={api} component={Starred} />

      <PrivateRoute path='/words/learned' api={api} component={Learned} />

      <PrivateRoute path='/words/top' api={api} component={Top} />
    </s.NarrowColumn>
  )
}
