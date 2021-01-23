import './App.css'
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import LandingPage from './landingPage/LandingPage'
import SignIn from './pages/SignIn'
import { UserContext } from './UserContext'

import LocalStorage from './LocalStorage'
import Zeeguu_API from './api/Zeeguu_API'
import LoggedInRouter from './LoggedInRouter'

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

  const [api] = useState(_api)

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

          <LoggedInRouter api={api} user={user} setUser={setUser} />
        </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
