import { useState, useRef, useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import * as s from '../components/FormPage.sc'

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

        history.push('/articles')
      })
    })
  }

  return (
    <s.PageBackground>
      <s.LogoOnTop />

      <s.NarrowFormContainer>
        <form action='' method='post'>
          <s.FormTitle>Sign In</s.FormTitle>

          {errorMessage && <div className='error'>{errorMessage}</div>}

          <div className='inputField'>
            <label>Email</label>
            <input
              type='email'
              className='field'
              id='email'
              name='email'
              placeholder='Email'
              background-color='#FFFFFF'
              ref={emailInputDOM}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className='inputField'>
            <label>Password</label>
            <input
              type='password'
              className='field'
              id='password'
              name='password'
              placeholder='Password'
              background-color='#FFFFFF'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className='inputField'>
            <s.FormButton
              onClick={handleSignIn}
              name='login'
              value='Login'
              className='loginButton'
            >
              Sign In
            </s.FormButton>
          </div>

          <p>
            Alternatively you can{' '}
            <a className='links' href='create_account'>
              create an account
            </a>{' '}
            or{' '}
            <a className='links' href='/reset_pass'>
              reset your password
            </a>
            .
          </p>
        </form>
      </s.NarrowFormContainer>
    </s.PageBackground>
  )
}
