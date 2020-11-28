import './App.css'
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import Articles from './pages/Articles'
import Bookmarks from './pages/Bookmarks'
import Exercises from './pages/Exercises'
import Settings from './pages/Settings'
import ArticleReader from './pages/ArticleReader'
import { UserContext } from './UserContext'
import { PrivateRoute } from './PrivateRoute'
import LocalStorage from './LocalStorage'

function App () {
  let userDict = {}

  if (LocalStorage.hasSession()) {
    console.log('loading from localstorage')
    userDict = {
      session: localStorage['sessionID'],
      ...LocalStorage.userInfo()
    }
  }

  const [user, setUser] = useState(userDict)

  useEffect(() => {}, [])

  function updateUserState (sessionId, userInfo) {
    setUser({
      session: sessionId,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language
    })
    LocalStorage.setSession(sessionId)
    LocalStorage.setUserInfo(userInfo)
  }

  function doUpdateUserInfo (info) {
    console.log('in do update user name')

    LocalStorage.setUserInfo(userInfo)
    setUser({
      ...user,
      name: info.name,
      learned_language: info.learned_language,
      native_language: info.native_language
    })
  }

  function logout () {
    LocalStorage.deleteUserInfo()
    setUser({})
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ ...user, logoutMethod: logout }}>
        <Switch>
          <Route path='/' exact component={LandingPage} />

          {/* cf: https://ui.dev/react-router-v4-pass-props-to-components/ */}
          <Route
            path='/login'
            render={() => <SignIn setUserState={updateUserState} />}
          />

          <PrivateRoute path='/read' exact component={Articles} />
          <PrivateRoute path='/read/article' component={ArticleReader} />
          <PrivateRoute path='/bookmarks' component={Bookmarks} />
          <PrivateRoute path='/exercises' component={Exercises} />

          <PrivateRoute
            path='/account_settings'
            updateUserInfo={doUpdateUserInfo}
            component={Settings}
          />
        </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
