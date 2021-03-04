import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { UserContext } from './UserContext'

// inspired from:
// https://dev.to/mychal/protected-routes-with-react-function-components-dh

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
