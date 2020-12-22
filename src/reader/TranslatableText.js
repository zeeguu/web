import { useState } from 'react'
import { TranslatableParagraph } from './TranslatableParagraph'

export function TranslatableText ({ text, zapi, url }) {
  const [paragraphs, setParagraphs] = useState(text.split(/\n\n/))

  return (
    <div>
      {paragraphs.map((par, index) => (
        <div key={index} className='textParagraph'>
          <TranslatableParagraph url={url} zapi={zapi} text={par} />
        </div>
      ))}
    </div>
  )
}
