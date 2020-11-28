import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { UserContext } from './UserContext'

// inspired from:
// https://dev.to/mychal/protected-routes-with-react-function-components-dh
// to lear from there how to also pass on the original url, so i can
// redirect to it from signin

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useContext(UserContext)

  if (!user.session) {
    return <Redirect to={{ pathname: '/login' }} />
  }
  return (
    <Route {...rest} render={props => <Component {...rest} {...props} />} />
  )
}

export { PrivateRoute }
