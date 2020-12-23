import { useState, useRef } from 'react'

export default function TranslatableWord ({
  zapi,
  word,
  clicked,
  articleInfo
}) {
  const [showingAlternatives, setShowingAlternatives] = useState(false)
  const domEl = useRef(null)

  if (!word.translation) {
    return (
      <>
        <z-tag ref={domEl} class='origtrans' onClick={e => clicked(word)}>
          {word.word}
        </z-tag>
        <span> </span>
      </>
    )
  }

  function clicked (word) {
    console.log(extractPreContext())
    return

    // zapi
    //   .getOneTranslation(
    //     'fr',
    //     'en',
    //     word.word,
    //     '',
    //     window.location,
    //     articleInfo.title
    //   )
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('^^^^^^^^^^^^^^^ got oneTranslation result ^^^^^^^^^^^^^^^')
    //     console.log(data)
    //     let t = data['translations'][0].translation
    //     let s = data['translations'][0].service_name

    //     setWords(
    //       words.map(e =>
    //         e.id !== word.id ? e : { ...word, translation: t, service_name: s }
    //       )
    //     )
    //   })
  }

  function extractPreContext () {
    let context = ''

    let cur = domEl.current
    console.log(cur)

    let count = 0
    while (cur && count < 6) {
      console.log(cur)
      if ('innerText' in cur) {
        cur = cur.previousSibling
        context += cur.innerText + ' '
        count += 1
      }
    }

    return context
  }

  function toggleAlternatives (e, word) {
    if (showingAlternatives) {
      setShowingAlternatives(false)
      return
    }

    let m2 =
      domEl.current.previousSibling.previousSibling.previousSibling
        .previousSibling.innerText

    let m1 = domEl.current.previousSibling.previousSibling.innerText

    let contextLeft = `${m2} ${m1} ${word.word}`
    console.log(contextLeft)

    console.log(word)
    console.log('-------->>>>>>>> ')
    console.log(word.service_name)
    zapi
      .getNextTranslations(
        'fr',
        'en',
        word.word,
        contextLeft,
        articleInfo.url,
        -1,
        word.service_name,
        'underline'
      )
      .then(response => response.json())
      .then(data => {
        console.log('!!!!!')
        console.log(data)
        setShowingAlternatives(!showingAlternatives)
        console.log('alternatives...')
        console.log(e)
        console.log(e.target)
      })
  }

  function alternatives () {
    return (
      <div
        className='altermenu'
        style={{
          position: 'absolute',
          maxWidth: '30em',
          marginTop: '0.5em',
          backgroundColor: 'lightgoldenrodyellow'
        }}
      >
        <div className='additionalTrans'>one</div>
        <div className='additionalTrans'>two</div>

        <input
          className='searchTextfieldInput matchWidth'
          type='text'
          id='#userAlternative'
        />
      </div>
    )
  }

  return (
    <>
      <z-tag ref={domEl} class='origtrans'>
        <z-tran
          chosen={word.translation}
          suggestion=''
          possibly_more_translations=''
          translation0={word.translation}
          servicenametranslation0='Google - without context'
          transcount='1'
          onClick={e => toggleAlternatives(e, word)}
        ></z-tran>
        <z-orig>
          {word.word}

          {showingAlternatives && alternatives()}
        </z-orig>
      </z-tag>
      <span> </span>
    </>
  )
}
