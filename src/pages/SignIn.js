import { useState, useRef, useEffect } from 'react'

import { attemptToSignIn, getUserDetails2 } from '../zeeguuAPI'
import { useHistory } from 'react-router-dom'

export default function SignIn ({ setUserState }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  let history = useHistory()
  let emailInputDOM = useRef()

  useEffect(() => {
    emailInputDOM.current.focus()
  }, [])

  function handleSignIn (e) {
    e.preventDefault()
    attemptToSignIn(email, password, setErrorMessage, function onSuccess (
      sessionId
    ) {
      console.log('successful login')

      getUserDetails2(sessionId, userInfo => {
        setUserState(sessionId, userInfo)

        history.push('/read')
      })
    })
  }

  return (
    <div>
      <h1>Sign In</h1>
      <h5>{errorMessage}</h5>
      <form>
        <input
          type='text'
          value={email}
          onChange={e => setEmail(e.target.value)}
          ref={emailInputDOM}
        />
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input type='submit' value='Sign In' onClick={handleSignIn} />
      </form>
    </div>
  )
}
