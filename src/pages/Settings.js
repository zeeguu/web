import './Settings.css'

import { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { attemptToSave, getUserDetails2 } from '../api/zeeguuAPI'

import { languages, language_from_id, language_id } from '../languages'

import { LanguageSelector } from '../components/LanguageSelector'
import MenuOnTheLeft from '../components/MenuOnTheLeft'
import { UserContext } from '../UserContext'

export default function Settings ({ updateUserInfo }) {
  const [userDetails, setUserDetails] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const history = useHistory()
  const user = useContext(UserContext)

  useEffect(() => {
    console.log('fetching user data')
    getUserDetails2(user.session, data => {
      console.log(data)
      setUserDetails(data)
    })
  }, [])

  console.log(userDetails)
  function handleSave (e) {
    e.preventDefault()

    attemptToSave(userDetails, setErrorMessage, () => {
      console.log('saved!')
      updateUserInfo(userDetails)
      history.push('/read')
    })
  }

  if (!userDetails) {
    return (
      <div>
        <MenuOnTheLeft />
        <h1>Account Settings</h1>
        loading...
      </div>
    )
  }

  return (
    <div>
      <MenuOnTheLeft />
      <h1>Account Settings</h1>
      <h5>{errorMessage}</h5>

      <form>
        <label>Name: </label>
        <input
          type='text'
          value={userDetails.name}
          onChange={e =>
            setUserDetails({ ...userDetails, name: e.target.value })
          }
        />
        <label>Email: </label>
        <input
          type='text'
          value={userDetails.email}
          onChange={e =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
        />
        <label>Learned Language: </label>
        <LanguageSelector
          languages={languages()}
          selected={language_from_id(userDetails.learned_language)}
          onChange={e => {
            setUserDetails({
              ...userDetails,
              learned_language: language_id(e.target.value)
            })
          }}
        />
        <label>Native Language: </label>
        <LanguageSelector
          languages={languages()}
          selected={language_from_id(userDetails.native_language)}
          onChange={e => {
            setUserDetails({
              ...userDetails,
              native_language: language_id(e.target.value)
            })
          }}
        />
        <br />
        <br /> <br />
        <br />
        <div>
          <input type='submit' value='Save' onClick={handleSave} />
        </div>
      </form>
    </div>
  )
}
