import './MenuOnTheLeft.css'

import MenuOnTheLeft from './MenuOnTheLeft'
import './MenuOnTheLeftWithLoading.css'

export default function MenuOnTheLeftWithLoading () {
  return (
    <div>
      <MenuOnTheLeft />
      <div className='loadingMessageContainer'>
        <div>loading...</div>
      </div>
    </div>
  )
}
