import TagsOfInterests from './TagsOfInterests'
import TagsOfFilters from './TagsOfFilters'
import { useState } from 'react'
import SearchField from './SearchField'

export default function InterestsAndSearch ({
  zapi,
  articlesListShouldChange
}) {
  const [showingInterests, setShowingInterests] = useState(false)
  const [showingFilters, setShowingFilters] = useState(false)

  function toggleInterests () {
    if (showingFilters) {
      return
    }
    setShowingInterests(!showingInterests)
  }

  function toggleFilters () {
    if (showingInterests) {
      return
    }
    setShowingFilters(!showingFilters)
  }

  function closeTagsOfInterestAndNotifyArticleListOfChange () {
    articlesListShouldChange()
    toggleInterests()
  }

  return (
    <>
      <div className='options' style={{ display: 'inline-flex' }}>
        <br />
        <br />
        <br />

        <div className='interestButton'>
          <button className='orangeButton' onClick={e => toggleInterests()}>
            Interests
          </button>
        </div>

        <div className='interestButton'>
          <button onClick={e => toggleFilters()} className='orangeButton'>
            <nobr>Non-Interests</nobr>
          </button>
        </div>

        <SearchField />
      </div>

      <TagsOfInterests
        visible={showingInterests}
        zapi={zapi}
        articlesListShouldChange={
          closeTagsOfInterestAndNotifyArticleListOfChange
        }
      />

      <TagsOfFilters
        visible={showingFilters}
        zapi={zapi}
        articlesListShouldChange={
          closeTagsOfInterestAndNotifyArticleListOfChange
        }
      />
    </>
  )
}
