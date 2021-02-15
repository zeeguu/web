import { useState, useRef, useEffect } from 'react'
import Select from './Select'

import { useHistory } from 'react-router-dom'
import { NarrowColumn } from '../reader/ArticleReader.sc'

import validator from './validator'
import LoadingAnimation from '../components/LoadingAnimation'

import { CEFR_LEVELS } from './cefrLevels'

export default function CreateAccount ({ api, notifySuccessfulSignIn }) {
  const [inviteCode, setInviteCode] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [learned_language, setLearned_language] = useState('')
  const [native_language, setNative_language] = useState('')
  const [learned_cefr_level, setLearned_cefr_level] = useState('')

  const [systemLanguages, setSystemLanguages] = useState()

  const [errorMessage, setErrorMessage] = useState('')

  let history = useHistory()
  let inviteCodeInputDOM = useRef()

  useEffect(() => {
    api.getSystemLanguages(languages => {
      setSystemLanguages(languages)
      console.log(languages)
      inviteCodeInputDOM.current.focus()
    })
  }, [])

  if (!systemLanguages) {
    return <LoadingAnimation />
  }

  let validatorRules = [
    [name === '', 'Name is required... ;)'],
    [email === '', 'Please provide a valid email'],
    [learned_language === '', 'Learned language is required'],
    [learned_cefr_level === '', 'Language level is required'],
    [native_language === '', 'Please select a base language.'],
    [password.length < 4, 'Password should be at least 4 characters long.']
  ]

  function handleCreate (e) {
    e.preventDefault()

    if (!validator(validatorRules, setErrorMessage)) {
      return
    }

    let userInfo = {
      name: name,
      email: email,
      learned_language: learned_language,
      native_language: native_language,
      learned_cefr_level: learned_cefr_level
    }

    api.addUser(
      inviteCode,
      password,
      userInfo,
      session => {
        notifySuccessfulSignIn(userInfo)
        history.push('/articles')
      },
      error => {
        setErrorMessage(error)
      }
    )
  }

  return (
    <NarrowColumn>
      <form id='login' action='' method='post'>
        <h1>Become a Beta-Tester</h1>
        <p>
          We need people to test this concept and let us know what works and
          what can be improved
        </p>

        {errorMessage && <h5>{errorMessage}</h5>}

        <div className='inputField'>
          <label>
            Invite Code <small>(Contact us for code)</small>
          </label>
          <input
            ref={inviteCodeInputDOM}
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value)}
            placeholder='Code'
          />
        </div>

        <div className='inputField'>
          <label>Name</label>
          <input
            placeholder='Name'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className='inputField'>
          <label>Email</label>
          <input
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className='inputField'>
          <label>Password</label>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className='inputField'>
          <label>Learned Language</label>

          <Select
            elements={systemLanguages.learnable_languages}
            label={e => e.name}
            val={e => e.code}
            updateFunction={setLearned_language}
          />
        </div>

        <div className='inputField'>
          <label>Level in Learned Language</label>

          <Select
            elements={CEFR_LEVELS}
            label={e => e.label}
            val={e => e.value}
            updateFunction={setLearned_cefr_level}
          />
        </div>

        <div className='inputField'>
          <label>Base Language</label>

          <Select
            elements={systemLanguages.native_languages}
            label={e => e.name}
            val={e => e.code}
            updateFunction={setNative_language}
          />
        </div>

        <div className='inputField'>
          <button onClick={handleCreate} value='Create Account'>
            Create Account
          </button>
        </div>
      </form>
    </NarrowColumn>
  )
}
