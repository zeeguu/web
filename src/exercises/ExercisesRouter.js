import { Switch } from 'react-router-dom'
import { PrivateRoute } from '../PrivateRoute'
import Exercises from './Exercises'
import ExercisesForArticle from './ExercisesForArticle'

export default function ExercisesRouter ({ zapi }) {
  return (
    <Switch>
      <PrivateRoute
        path='/exercises/forArticle/:articleID'
        zapi={zapi}
        component={ExercisesForArticle}
      />

      <PrivateRoute path='/exercises' api={zapi} component={Exercises} />
    </Switch>
  )
}
