import './MenuOnTheLeft.css'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../UserContext'

export default function MenuOnTheLeft () {
  const user = useContext(UserContext)

  return (
    <div className='sidenav'>
      <h2>Welcome {user.name}</h2>

      <small>Native: {user.native_language}</small>
      <br />
      <small>Learned: {user.learned_language}</small>
      <br />
      <small>Session: {user.session}</small>
      <br />

      <button onClick={() => user.logoutMethod()}>Logout</button>

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
    </div>
  )
}
