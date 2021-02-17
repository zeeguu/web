import * as s from '../components/FormPage.sc'
import { useState } from 'react'
import validator from './validator'

export default function ResetPasswordStep2 ({ api, email }) {
  const [errorMessage, setErrorMessage] = useState('')
  const [code, setCode] = useState('')
  const [newPass, setNewPass] = useState('')
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)

  let validatorRules = [
    [newPass.length < 4, 'Password should be at least 4 characters'],
    [code === '', 'Please provide a code']
  ]

  function handleResetPassword (e) {
    e.preventDefault()

    if (!validator(validatorRules, setErrorMessage)) {
      return
    }

    api.resetPassword(
      email,
      code,
      newPass,
      () => {
        setSuccess(true)
      },
      e => {
        console.log(e)
        setFailure(true)
      }
    )
  }

  if (failure) {
    return (
      <>
        <h1>Something went wrong</h1>
        <p>
          You can try <a href='/reset_pass'>to reset your password</a> again.{' '}
        </p>

        <p>
          Or contact us at <a href='#'>zeeguu.team@gmail.com</a>
        </p>
      </>
    )
  }
  if (success) {
    return (
      <>
        <h1>Sucess</h1>
        <p>Your password has been changed successfully.</p>
        <br />
        <p>
          You can go to <a href='signin'>sign in</a> now
        </p>
      </>
    )
  }

  return (
    <form action='' method='post'>
      <s.FormTitle>Reset Password</s.FormTitle>

      <p>
        Please check <b>{email}</b> for the one time code we sent you.
      </p>

      {errorMessage && <div className='error'>{errorMessage}</div>}

      <div className='inputField'>
        <label>Code</label>
        <input
          placeholder='Code received via email'
          value={code}
          onChange={e => setCode(e.target.value)}
        />
      </div>

      <div className='inputField'>
        <label>New Password</label>
        <input
          placeholder='New Password'
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
        />
      </div>

      <div className='inputField'>
        <s.FormButton onClick={handleResetPassword} className='loginButton'>
          Set New Password
        </s.FormButton>
      </div>
    </form>
  )
}
