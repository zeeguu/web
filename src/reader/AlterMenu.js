import { useClickOutside } from 'react-click-outside-hook'

export default function AlterMenu ({ word, setShowingAlternatives }) {
  const [refToAlterMenu, hasClickedOutside] = useClickOutside()

  console.log('%%%%%%%%%%% rendering alter menu')
  console.log(word)

  function handleAlternative (alternative) {
    console.log('selected alternative: ' + alternative)
  }

  if (hasClickedOutside) {
    setShowingAlternatives(false)
  }

  return (
    <div ref={refToAlterMenu} className='altermenu'>
      {word.alternatives.map(each => (
        <div
          key={each}
          onClick={e => handleAlternative(each)}
          className='additionalTrans'
        >
          {each}
        </div>
      ))}

      <input
        className='searchTextfieldInput matchWidth'
        type='text'
        id='#userAlternative'
        placeholder='Own translation...'
      />
    </div>
  )
}
