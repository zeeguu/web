import { PrivateRoute } from '../PrivateRoute'
import WordHistory from './WordHistory'
import Starred from './Starred'
import Learned from './Learned'
import Top from './Top'
import * as s from './Words.sc'
import TopTabs from '../components/TopTabs'

export default function Words ({ api }) {
  return (
    <s.Words>
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
        zapi={api}
        component={WordHistory}
      />

      <PrivateRoute path='/words/starred' zapi={api} component={Starred} />

      <PrivateRoute path='/words/learned' zapi={api} component={Learned} />

      <PrivateRoute path='/words/top' zapi={api} component={Top} />
    </s.Words>
  )
}
