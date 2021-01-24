import './Settings.css'

import { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { language_for_id } from '../languages'

import { LanguageSelector } from '../components/LanguageSelector'

import { UserContext } from '../UserContext'

export default function Settings ({ api, updateUserInfo }) {
  const [userDetails, setUserDetails] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const history = useHistory()
  const user = useContext(UserContext)
  const [languages, setLanguages] = useState()

  useEffect(() => {
    api.getUserDetails(data => {
      api.getSystemLanguages(systemLanguages => {
        setLanguages(systemLanguages)
        setUserDetails(data)
      })
    })
  }, [user.session, api])

  function handleSave (e) {
    e.preventDefault()

    api.saveUserDetails(userDetails, setErrorMessage, () => {
      updateUserInfo(userDetails)
      history.goBack()
    })
  }

  if (!userDetails || !languages) {
    return (
      <div>
        <h1>Account Settings</h1>
        loading...
      </div>
    )
  }

  return (
    <form className='formSettings'>
      <h1 className='category'>Account Settings</h1>
      <h5>{errorMessage}</h5>
      <small>
        <label for='name'>Name </label>
        <input
          id='name'
          name='name'
          type='text'
          value={userDetails.name}
          onChange={e =>
            setUserDetails({ ...userDetails, name: e.target.value })
          }
        />
        <br />

        <label for='email'>Email </label>
        <input
          id='email'
          name='email'
          type='text'
          value={userDetails.email}
          onChange={e =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
        />
        <br />
        <label for='learned language'>Learned Language: </label>
        <LanguageSelector
          languages={languages.learnable_languages}
          selected={language_for_id(
            userDetails.learned_language,
            languages.learnable_languages
          )}
          onChange={e => {
            let code = e.target[e.target.selectedIndex].getAttribute('code')
            setUserDetails({
              ...userDetails,
              learned_language: code
            })
          }}
        />
        <br />
        <label for='native language'>Native Language: </label>
        <LanguageSelector
          languages={languages.native_languages}
          selected={language_for_id(
            userDetails.native_language,
            languages.native_languages
          )}
          onChange={e => {
            let code = e.target[e.target.selectedIndex].getAttribute('code')
            setUserDetails({
              ...userDetails,
              native_language: code
            })
          }}
        />
      </small>
      <br />
      <br /> <br />
      <br />
      <div>
        <input type='submit' value='Save' onClick={handleSave} />
      </div>
    </form>
  )
}
