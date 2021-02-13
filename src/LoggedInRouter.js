import Articles from './articles/Articles'
import WordsRouter from './words/WordsRouter'
import Exercises from './exercises/Exercises'
import Settings from './pages/Settings'
import { PrivateRoute } from './PrivateRoute'
import SideBar from './components/SideBar'
import ArticleReader from './reader/ArticleReader'
import LocalStorage from './LocalStorage'

import { Link } from 'react-router-dom'

import { useState } from 'react'

export default function LoggedInRouter ({ api, user, setUser }) {
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

  return (
    <>
      <SideBar>
        <PrivateRoute path='/articles' api={api} component={Articles} />
        <PrivateRoute path='/exercises' api={api} component={Exercises} />
        <PrivateRoute path='/words' api={api} component={WordsRouter} />

        <PrivateRoute
          path='/account_settings'
          updateUserInfo={doUpdateUserInfo}
          api={api}
          component={Settings}
        />

        <PrivateRoute
          path='/read/article'
          api={api}
          component={ArticleReader}
        />
      </SideBar>
    </>
  )
}
