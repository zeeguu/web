import { useState } from 'react'
import AllTexts from '../components/ArticleList'
import MenuOnTheLeft from '../components/MenuOnTheLeft'
import { getUserDetails } from '../api/zeeguuAPI'

export default function UserHome () {
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
