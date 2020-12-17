import { useEffect, useState } from 'react'
import React from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'

export default function TagsOfFilters ({
  visible,
  zapi,
  articlesListShouldChange
}) {
  const [availableFilters, setAvailableFilters] = useState(null)
  const [subscribedFilters, setSubscribedFilters] = useState(null)
  const [subscribedSearchFilters, setSubscribedSearchFilters] = useState(null)
  const [showingModal, setShowingModal] = useState(false)

  useEffect(() => {
    console.log('!!!+!+!!+!+!+ in use effect...')
    zapi.interestingButNotSubscribedTopics(topics => {
      setAvailableFilters(topics)
    })

    zapi.getFilteredTopics(filters => {
      setSubscribedFilters(filters)
    })

    zapi.getSubscribedFilterSearches(filters => {
      setSubscribedSearchFilters(filters)
    })
  }, [zapi])

  if (!availableFilters | !subscribedFilters | !subscribedSearchFilters)
    return ''

  function subscribeToFilter (filter) {}

  function unsubscribeFromFilter (filter) {}

  function removeSearchFilter (search) {}

  function toggleFilter (filter) {
    if (subscribedFilters.includes(filter)) {
      unsubscribeFromFilter(filter)
    } else {
      subscribeToFilter(filter)
    }
  }

  const onConfirm = response => {
    zapi.subscribeToSearchFilter(response, data => {
      setSubscribedSearchFilters([...subscribedSearchFilters, data])
    })

    setShowingModal(false)
  }

  const onCancel = () => {
    setShowingModal(false)
  }

  return (
    <>
      {showingModal && (
        <SweetAlert
          input
          showCancel
          title='Add a personal filter'
          placeHolder='interest'
          onConfirm={onConfirm}
          onCancel={onCancel}
        ></SweetAlert>
      )}

      <div
        className='tagsOfInterests'
        style={{ display: visible ? 'block' : 'none' }}
      >
        <div className='interestsSettings'>
          <button
            className='addInterestButton'
            onClick={e => setShowingModal(true)}
          >
            ＋
          </button>
          <button
            className='closeTagsOfInterests'
            onClick={e => articlesListShouldChange()}
          >
            save
          </button>
        </div>

        {availableFilters.map(filter => (
          <div key={filter.id} addableid={filter.id}>
            <button
              onClick={e => toggleFilter(filter)}
              type='button'
              className={
                'interests ' +
                (subscribedFilters.includes(filter) ? '' : 'unsubscribed')
              }
            >
              <span className='addableTitle'>{filter.title}</span>
            </button>
          </div>
        ))}

        {subscribedSearchFilters.map(search => (
          <div key={search.id} searchremovabeid={search.id}>
            <button
              onClick={e => removeSearchFilter(search)}
              type='button'
              className={'interests'}
            >
              <span className='addableTitle'>{search.search}</span>
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
