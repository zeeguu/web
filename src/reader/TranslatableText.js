import { useState } from 'react'
import { TranslatableParagraph } from './TranslatableParagraph'

export function TranslatableText ({ text, zapi, articleInfo }) {
  const [paragraphs, setParagraphs] = useState(text.split(/\n\n/))

  return (
    <div>
      {paragraphs.map((par, index) => (
        <div key={index} className='textParagraph'>
          <TranslatableParagraph
            articleInfo={articleInfo}
            zapi={zapi}
            text={par}
          />
        </div>
      ))}
    </div>
  )
}
