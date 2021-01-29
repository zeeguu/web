import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../UserContext'
// import './SideBar.css'

export default function SideBar ({ visible, setVisible }) {
  const user = useContext(UserContext)

  function hideSidebar (e) {
    e.preventDefault()
    setVisible(!visible)
  }

  if (!visible) {
    return (
      <nav className='nav-menu'>
        <span class='arrow-none-block' id='arrow-p' onClick={hideSidebar}>
          <p className='arrow-nav-icon'>▲</p>
        </span>
      </nav>
    )
  }

  return (
    <nav className='sidenav' id='myTopnav'>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <small> Welcome {user.name}!</small>
      </div>

      <a href='/articles' rel='external'>
        <img
          className='zeeguuLogo'
          src='/static/images/zeeguuWhiteLogo.svg'
          alt='Zeeguu Logo - The Elephant'
        />
      </a>

      <span className='arrow-icon' id='arrow-p' onClick={hideSidebar}>
        <p className='arrow-nav-icon'>▲</p>
      </span>

      <div className='dropdown'>
        <div className='dropbtn'>
          <Link to='/articles'>Articles</Link>
        </div>
      </div>
      <div className='dropdown'>
        <div className='dropbtn'>
          <Link to='/words/history'>Words</Link>
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
