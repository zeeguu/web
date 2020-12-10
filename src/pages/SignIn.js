import { useState, useRef, useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import './SignIn.css'

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
    <div className='loginBody'>
      <div className='loginPG'>
        <div className='logoContainer1'>
          <img
            className='zeeguuLogo'
            src='/static/images/zeeguuWhiteLogo.svg'
            alt='Zeeguu Logo - The Elephant'
          />
        </div>

        <form
          id='login'
          action=''
          method='post'
          role='form'
          novalidate='novalidate'
        >
          <div className='outerContainer'>
            <div className='innerContainer authentificationBox'>
              <p id='authentificationBoxTitle'>Sign In</p>

              {errorMessage && <h5>{errorMessage}</h5>}

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
                <button
                  onClick={handleSignIn}
                  name='login'
                  value='Login'
                  className='loginButton'
                >
                  Sign In
                </button>
              </div>

              <div>
                <small className='extraText'>
                  Or
                  <a className='links' href='create_account'>
                    create an account
                  </a>{' '}
                  or
                  <a className='links' href='/reset_pass'>
                    reset your password
                  </a>
                </small>
              </div>
            </div>
          </div>
        </form>

        {/* <form>
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
        </form> */}
      </div>
    </div>
  )
}
