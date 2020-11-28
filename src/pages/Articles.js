import { useState } from 'react'
import AllTexts from '../components/ArticleList'
import MenuOnTheLeft from '../components/MenuOnTheLeft'
import { getUserDetails } from '../zeeguuAPI'

export default function UserHome () {
  const [userName, setUserName] = useState(
    localStorage['name'] == undefined ? '' : localStorage['name']
  )

  if (!userName) {
    getUserDetails(data => {
      setUserName(data['name'])
      localStorage['name'] = data['name']
    })

    return <div>loading...</div>
  }

  return (
    <div>
      <MenuOnTheLeft />
      <div>
        <h1>Recommended Texts</h1>
        <AllTexts />
      </div>
    </div>
  )
}
