import { useSpeechSynthesis } from 'react-speech-kit'

function randomElement (x) {
  return x[Math.floor(Math.random() * x.length)]
}

export default function BottomFeedback ({ bookmarkToStudy, correctAnswer }) {
  const { speak, voices } = useSpeechSynthesis()

  const voice = randomElement(
    voices.filter(v => v.lang.includes(bookmarkToStudy.from_lang))
  )

  function handleSpeak () {
    speak({ text: bookmarkToStudy.from, voice: voice })
  }

  return (
    <div className='bottomInput'>
      <button onClick={e => handleSpeak()}>Speak</button>

      <button onClick={e => correctAnswer()} autoFocus>
        Next
      </button>
    </div>
  )
}
