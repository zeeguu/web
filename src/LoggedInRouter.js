import Articles from './articles/Articles'
import Bookmarks from './pages/Bookmarks'
import Exercises from './exercises/Exercises'
import Settings from './pages/Settings'
import { PrivateRoute } from './PrivateRoute'
import SideBar from './components/SideBar'
import ArticleReader from './reader/ArticleReader'
import LocalStorage from './LocalStorage'
import './LoggedInRouter.css'
import { useState } from 'react'

export default function LoggedInRouter ({ api, user, setUser }) {
  const [visible, setVisible] = useState(true)

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
      <SideBar visible={visible} setVisible={setVisible} />

      <div
        className='main-container'
        style={{ marginLeft: visible ? '12.5em' : '0px' }}
      >
        <PrivateRoute path='/articles' api={api} component={Articles} />
        <PrivateRoute path='/words' api={api} component={Bookmarks} />
        <PrivateRoute path='/exercises' api={api} component={Exercises} />

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
      </div>
    </>
  )
}
