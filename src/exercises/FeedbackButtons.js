import './FeedbackButtons.css'
import { Link } from 'react-router-dom'

const buttons = [
  { name: 'Too Easy', value: 'too_easy' },
  { name: 'Too Hard', value: 'too_hard' },
  { name: 'Bad example', value: 'not_a_good_example' },
  { name: 'Bad word', value: 'bad_word' },
  { name: 'Other', value: 'dont_show_it_to_me_again' }
]
export default function FeedbackButtons ({ show, setShow, feedbackFunction }) {
  function toggleShow () {
    console.log('toggle show')
    setShow(!show)
  }
  return (
    <div>
      <div className='feedback_link_holder'>
        <Link to={'#'} className='discrete-link' onClick={toggleShow}>
          Stop showing this
        </Link>
      </div>

      {show && (
        <div className='feedback_buttons_holder'>
          {buttons.map(each => (
            <button onClick={() => feedbackFunction(each.value)}>
              {each.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
