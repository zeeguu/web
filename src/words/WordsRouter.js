import { PrivateRoute } from '../PrivateRoute'
import WordsForArticle from './WordsForArticle'
import Words from './Words'
import { Switch } from 'react-router-dom'

export default function WordsRouter ({ api }) {
  return (
    <Switch>
      <PrivateRoute
        path='/words/forArticle/:articleID'
        api={api}
        component={WordsForArticle}
      />

      <PrivateRoute path='/words/' api={api} component={Words} />
    </Switch>
  )
}
