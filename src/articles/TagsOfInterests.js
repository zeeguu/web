import { useEffect, useState } from 'react'
import React from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'

export default function TagsOfInterests ({
  visible,
  zapi,
  articlesListShouldChange
}) {
  const [interestingTopics, setInterestingTopics] = useState(null)
  const [subscribedTopics, setSubscribedTopics] = useState(null)
  const [subscribedSearches, setSubscribedSearches] = useState(null)
  const [
    showingSpecialInterestModal,
    setshowingSpecialInterestModal
  ] = useState(false)

  useEffect(() => {
    zapi.getInterestingTopics(data => {
      setInterestingTopics(data)
    })

    zapi.getSubscribedTopics(data => {
      setSubscribedTopics(data)
    })

    zapi.getSubscribedSearchers(data => {
      setSubscribedSearches(data)
    })
  }, [zapi])

  if (!interestingTopics || !subscribedTopics || !subscribedSearches) return ''

  console.log(subscribedSearches)

  let allTopics = [...interestingTopics, ...subscribedTopics]
  allTopics.sort((a, b) => a.title.localeCompare(b.title))

  function subscribeToTopicOfInterest (topic) {
    setSubscribedTopics([...subscribedTopics, topic])
    setInterestingTopics(interestingTopics.filter(each => each.id !== topic.id))
    zapi.subscribeToTopic(topic)
  }

  function unsubscribeFromTopicOfInterest (topic) {
    setSubscribedTopics(subscribedTopics.filter(each => each.id !== topic.id))
    setInterestingTopics([...interestingTopics, topic])
    zapi.unsubscribeFromTopic(topic)
  }

  function removeSearch (search) {
    console.log('unsubscribing from search' + search)
    setSubscribedSearches(
      subscribedSearches.filter(each => each.id !== search.id)
    )
    zapi.unsubscribeFromSearch(search)
  }

  function toggleInterest (topic) {
    console.log(topic)
    console.log(subscribedTopics)
    if (subscribedTopics.includes(topic)) {
      unsubscribeFromTopicOfInterest(topic)
    } else {
      subscribeToTopicOfInterest(topic)
    }
  }

  const onConfirm = response => {
    zapi.subscribeToSearch(response, data => {
      console.log(data)
      console.log(subscribedSearches)
      setSubscribedSearches([...subscribedSearches, data])
    })

    setshowingSpecialInterestModal(false)
  }

  const onCancel = () => {
    setshowingSpecialInterestModal(false)
  }

  return (
    <>
      {showingSpecialInterestModal && (
        <SweetAlert
          input
          showCancel
          title='Add a personal interest'
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
            onClick={e => setshowingSpecialInterestModal(true)}
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

        {allTopics.map(topic => (
          <div key={topic.id} addableid={topic.id}>
            <button
              onClick={e => toggleInterest(topic)}
              type='button'
              className={
                'interests ' +
                (subscribedTopics.includes(topic) ? '' : 'unsubscribed')
              }
            >
              <span className='addableTitle'>{topic.title}</span>
            </button>
          </div>
        ))}

        {subscribedSearches.map(search => (
          <div key={search.id} searchremovabeid={search.id}>
            <button
              onClick={e => removeSearch(search)}
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
