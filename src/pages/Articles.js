import { useState } from 'react'
import AllTexts from '../components/ArticleList'
import MenuOnTheLeft from '../components/MenuOnTheLeft'

export default function Articles ({ api }) {
  return (
    <div>
      <MenuOnTheLeft />
      <div>
        <h1>Recommended Texts</h1>
        <AllTexts api={api} />
      </div>
    </div>
  )
}
