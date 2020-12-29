import { useState } from 'react'
import { TranslatableParagraph } from './TranslatableParagraph'
import { useSpeechSynthesis } from 'react-speech-kit'

function randomElement (x) {
  return x[Math.floor(Math.random() * x.length)]
}

function getRandomVoice (voices, language) {
  let x = randomElement(voices.filter(v => v.lang.includes(language)))
  console.log(x)
  return x
}

export function TranslatableText ({
  text,
  zapi,
  articleInfo,
  translating,
  pronouncing
}) {
  const [paragraphs, setParagraphs] = useState(text.split(/\n\n/))

  const { speak, voices } = useSpeechSynthesis()

  function pronounce (word) {
    let voice = getRandomVoice(voices, articleInfo.language)
    speak({ text: word.word, voice: voice })
  }

  return (
    <div>
      {paragraphs.map((par, index) => (
        <div key={index} className='textParagraph'>
          <TranslatableParagraph
            articleInfo={articleInfo}
            zapi={zapi}
            text={par}
            translating={translating}
            pronouncing={pronouncing}
            pronounce={pronounce}
          />
        </div>
      ))}
    </div>
  )
}
