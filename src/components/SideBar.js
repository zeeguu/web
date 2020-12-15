// import './MenuOnTheLeft.css'
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { UserContext } from '../UserContext'
import './SideBar.css'

export default function SideBar () {
  const user = useContext(UserContext)

  const [visible, setVisible] = useState(true)

  function hideSidebar (e) {
    e.preventDefault()
    setVisible(!visible)
    console.log(visible)
  }

  if (!visible) {
    return (
      <nav class='nav-menu'>
        <span class='arrow-none-block' id='arrow-p' onClick={hideSidebar}>
          <p class='arrow-nav-icon'>▲</p>
        </span>
      </nav>
    )
  }

  return (
    <nav className='sidenav' id='myTopnav'>
      <a href='/read' rel='external'>
        <img
          className='zeeguuLogo'
          src='/static/images/zeeguuWhiteLogo.svg'
          alt='Zeeguu Logo - The Elephant'
        />
      </a>

      <span class='arrow-icon' id='arrow-p' onClick={hideSidebar}>
        <p class='arrow-nav-icon'>▲</p>
      </span>

      <div className='dropdown'>
        <div className='dropbtn'>
          <Link to='/read'>Readings</Link>
        </div>
      </div>
      <div className='dropdown'>
        <div className='dropbtn'>
          <Link to='/bookmarks'>Words</Link>
        </div>
      </div>
      <div className='dropdown'>
        <div className='dropbtn'>
          <Link to='/exercises'>Exercises</Link>
        </div>
      </div>
      <div className='dropdown'>
        <div className='dropbtn'>
          <Link to='/account_settings'>Settings</Link>
        </div>
      </div>
    </nav>
  )
}
