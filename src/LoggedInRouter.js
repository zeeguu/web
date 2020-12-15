import Articles from './reader/Articles'
import Bookmarks from './pages/Bookmarks'
import Exercises from './exercises/Exercises'
import Settings from './pages/Settings'
import { PrivateRoute } from './PrivateRoute'
import SideBar from './components/SideBar'
import LocalStorage from './LocalStorage'
import './LoggedInRouter.css'

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
      <SideBar />

      <div className='main-container'>
        <PrivateRoute path='/read' api={api} component={Articles} />
        <PrivateRoute path='/bookmarks' api={api} component={Bookmarks} />
        <PrivateRoute path='/exercises' api={api} component={Exercises} />

        <PrivateRoute
          path='/account_settings'
          updateUserInfo={doUpdateUserInfo}
          api={api}
          component={Settings}
        />
      </div>
    </>
  )
}
