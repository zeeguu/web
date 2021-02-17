import * as s from '../components/FormPage.sc'
import { useState } from 'react'
import * as EmailValidator from 'email-validator'
import validator from './validator'

export default function ResetPasswordStep1 ({
  api,
  email,
  setEmail,
  notifyOfValidEmail
}) {
  const [errorMessage, setErrorMessage] = useState('')

  let validatorRules = [
    [!EmailValidator.validate(email), 'Please provide a valid email']
  ]

  function handleResetPassword (e) {
    e.preventDefault()

    if (!validator(validatorRules, setErrorMessage)) {
      return
    }

    api.sendCode(
      email,
      () => {
        notifyOfValidEmail()
      },
      () => {
        setErrorMessage('inexistent email')
      }
    )
  }
  return (
    <form action='' method='post'>
      <s.FormTitle>Reset Password</s.FormTitle>

      <p>To do this we need the email that you registered with us.</p>
      {errorMessage && <div className='error'>{errorMessage}</div>}

      <div className='inputField'>
        <label>Email</label>
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className='inputField'>
        <s.FormButton
          onClick={handleResetPassword}
          name='login'
          value='Login'
          className='loginButton'
        >
          Reset Password
        </s.FormButton>
      </div>
    </form>
  )
}
