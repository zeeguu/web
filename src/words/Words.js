import { WordsTab, SeparatorBar } from './WordsTab'
import { PrivateRoute } from '../PrivateRoute'
import WordHistory from './WordHistory'
import Starred from './Starred'
import Learned from './Learned'
import Top from './Top'
import './newStyleWords.css'

export default function Words ({ api }) {
  return (
    <>
      <header>
        <div className='select-article'>
          <h1>Your Words</h1>

          <div className='all__tabs'>
            <WordsTab text='Translated Words' link='/words/history' />

            <SeparatorBar />

            <WordsTab text='Starred Words' link='/words/starred' />

            <SeparatorBar />

            <WordsTab text='Learned Words' link='/words/learned' />

            <SeparatorBar />

            <WordsTab text='Top Words' link='/words/top' />
          </div>
        </div>
      </header>

      <PrivateRoute
        path='/words/history'
        exact
        zapi={api}
        component={WordHistory}
      />

      <PrivateRoute path='/words/starred' zapi={api} component={Starred} />

      <PrivateRoute path='/words/learned' zapi={api} component={Learned} />

      <PrivateRoute path='/words/top' zapi={api} component={Top} />
    </>
  )
}
