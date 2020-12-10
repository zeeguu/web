import './App.css'
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import LandingPage from './landingPage/LandingPage'
import SignIn from './pages/SignIn'
import Articles from './reader/Articles'
import Bookmarks from './pages/Bookmarks'
import Exercises from './exercises/Exercises'
import Settings from './pages/Settings'
import ArticleReader from './reader/ArticleReader'
import { UserContext } from './UserContext'
import { PrivateRoute } from './PrivateRoute'
import LocalStorage from './LocalStorage'
import Zeeguu_API from './api/Zeeguu_API'

function App () {
  let userDict = {}

  // we use the _api to initialize the api state variable
  let _api = new Zeeguu_API(process.env.REACT_APP_API_URL)

  if (LocalStorage.hasSession()) {
    console.log('loading from localstorage')
    userDict = {
      session: localStorage['sessionID'],
      ...LocalStorage.userInfo()
    }
    _api.session = localStorage['sessionID']
  }

  const [api, setAPI] = useState(_api)

  const [user, setUser] = useState(userDict)

  useEffect(() => {}, [])

  function handleSuccessfulSignIn (userInfo) {
    setUser({
      session: api.session,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language
    })
    LocalStorage.setSession(api.session)
    LocalStorage.setUserInfo(userInfo)
  }

  function doUpdateUserInfo (info) {
    console.log('in do update user name')

    LocalStorage.setUserInfo(info)
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
            render={() => (
              <SignIn
                api={api}
                notifySuccessfulSignIn={handleSuccessfulSignIn}
              />
            )}
          />

          <PrivateRoute path='/read' exact zapi={api} component={Articles} />
          <PrivateRoute
            path='/read/article'
            api={api}
            component={ArticleReader}
          />
          <PrivateRoute path='/bookmarks' api={api} component={Bookmarks} />
          <PrivateRoute path='/exercises' api={api} component={Exercises} />

          <PrivateRoute
            path='/account_settings'
            updateUserInfo={doUpdateUserInfo}
            api={api}
            component={Settings}
          />
        </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
