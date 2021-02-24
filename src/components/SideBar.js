import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { UserContext } from '../UserContext'

import * as s from './SideBar.sc'

export default function SideBar (props) {
  const user = useContext(UserContext)
  const [initialSidebarState, setInitialSidebarState] = useState(true)

  function toggleSidebar (e) {
    e.preventDefault()
    setInitialSidebarState(!initialSidebarState)
  }

  function resetSidebarToDefault (e) {
    setInitialSidebarState(true)
  }

  let sidebarContent = (
    <>
      <div className='logo'>
        <a href='/articles' rel='external'>
          <img
            src='/static/images/zeeguuWhiteLogo.svg'
            alt='Zeeguu Logo - The Elephant'
          />
        </a>
      </div>
      <div className='arrowHolder'>
        <span className='toggleArrow' onClick={toggleSidebar}>
          ▲
        </span>
      </div>
      <div className='navigationLink'>
        <Link to='/articles' onClick={resetSidebarToDefault}>
          Articles
        </Link>
      </div>
      <div className='navigationLink'>
        <Link to='/words/history' onClick={resetSidebarToDefault}>
          Words
        </Link>
      </div>
      <div className='navigationLink'>
        <Link to='/exercises' onClick={resetSidebarToDefault}>
          Exercises
        </Link>
      </div>
      {(user.is_teacher === 'true' || user.is_teacher === true) && (
        <div className='navigationLink'>
          <Link
            // target='_blank'
            to='/teacher-dashboard/'
            onClick={resetSidebarToDefault}
          >
            <small>My Students</small>
          </Link>
        </div>
      )}

      <div className='navigationLink'>
        <Link to='/account_settings' onClick={resetSidebarToDefault}>
          Settings
        </Link>
      </div>
      <br />
      <div className='navigationLink'>
        <Link
          to='/'
          onClick={() => {
            user.logoutMethod()
          }}
        >
          <small>Logout</small>
        </Link>
      </div>
    </>
  )

  if (!initialSidebarState) {
    return (
      <s.SideBarToggled>
        {sidebarContent}
        <s.MainContentToggled>{props.children}</s.MainContentToggled>
      </s.SideBarToggled>
    )
  }

  return (
    <s.SideBarInitial>
      {sidebarContent}
      <s.MainContentInitial>{props.children}</s.MainContentInitial>
    </s.SideBarInitial>
  )
}
