import { useState, useRef, useEffect } from 'react'

import { useHistory } from 'react-router-dom'

export default function SignIn ({ api, notifySuccessfulSignIn }) {
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
    api.signIn(email, password, setErrorMessage, sessionId => {
      console.log('successful login')

      api.getUserDetails(userInfo => {
        notifySuccessfulSignIn(userInfo)

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
