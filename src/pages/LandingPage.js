import LocalStorage from '../LocalStorage'
import UserHome from './Articles'
export default function LandingPage () {
  if (!LocalStorage.hasSession) {
    return <UserHome />
  }
  return (
    <div>
      <h1>Welcome to simple Zeeguu</h1>
      <p>A research project...</p>
      <a href='/login'>Sign In</a>
    </div>
  )
}
