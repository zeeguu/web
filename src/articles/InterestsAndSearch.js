import TagsOfInterests from './TagsOfInterests'
import { useState } from 'react'

export default function InterestsAndSearch ({ setArticleList, zapi }) {
  const [showingInterests, setShowingInterests] = useState(false)

  function toggleInterests () {
    setShowingInterests(!showingInterests)
  }

  return (
    <>
      <div
        className='options'
        id='optionsID'
        style={{ display: 'inline-flex' }}
      >
        <br />
        <br />
        <br />
        <div className='interestButton'>
          <button
            type='button'
            className='orangeButton show-topic-subscriber'
            onClick={e => toggleInterests()}
          >
            <span className='orangeButtonText'>Interests</span>
          </button>
        </div>
        <div id='searchesList'></div>

        <div id='topicsList'>
          <div id='any_topic' style={{ display: 'block' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <i style={{ color: 'gray' }}>Showing all Interests...</i>
          </div>
        </div>
        <div style={{ fontSize: 'xx-small' }}>&nbsp;</div>
        <div className='interestButton'>
          <button type='button' className='orangeButton show-filter-subscriber'>
            <span className='orangeButtonText'>
              <nobr>Non-Interests</nobr>
            </span>
          </button>
        </div>
        <div id='searchesFilterList'></div>
        <div id='topicsFilterList'></div>
        <div style={{ fontSize: 'xx-small' }}>&nbsp;</div>
        <br />
        <div className='seachField'>
          <input
            className='searchTextfieldInput'
            type='text'
            id='search-expandable'
            placeholder='Search all articles'
          />
        </div>
      </div>

      <TagsOfInterests visible={showingInterests} zapi={zapi} />
    </>
  )
}
