import { useEffect, useState } from 'react'
import { useClickOutside } from 'react-click-outside-hook'

export default function AlterMenu ({
  word,
  clickedOutsideAlterMenu,
  selectAlternative
}) {
  const [refToAlterMenu, hasClickedOutside] = useClickOutside()
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (hasClickedOutside) {
      clickedOutsideAlterMenu()
    }
  }, [hasClickedOutside])

  function handleKeyDown (e) {
    if (e.code == 'Enter') {
      selectAlternative(inputValue)
    }
  }

  return (
    <div ref={refToAlterMenu} className='altermenu'>
      {word.alternatives.map(each => (
        <div
          key={each}
          onClick={e => selectAlternative(each)}
          className='additionalTrans'
        >
          {each}
        </div>
      ))}

      <input
        className='searchTextfieldInput matchWidth'
        type='text'
        id='#userAlternative'
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => handleKeyDown(e)}
        placeholder='Own translation...'
      />
    </div>
  )
}
