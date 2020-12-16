import { useEffect, useState } from 'react'

export default function TagsOfInterests ({
  visible,
  zapi,
  articlesListShouldChange
}) {
  const [interestingTopics, setInterestingTopics] = useState(null)
  const [subscribedTopics, setSubscribedTopics] = useState(null)

  useEffect(() => {
    zapi.getInterestingTopics(data => {
      setInterestingTopics(data)
    })

    zapi.getSubscribedTopics(data => {
      setSubscribedTopics(data)
    })
  }, [zapi])

  if (!interestingTopics || !subscribedTopics) return ''

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

  function toggleInterest (topic) {
    console.log(topic)
    console.log(subscribedTopics)
    if (subscribedTopics.includes(topic)) {
      unsubscribeFromTopicOfInterest(topic)
    } else {
      subscribeToTopicOfInterest(topic)
    }
  }

  return (
    <>
      <div
        className='tagsOfInterests'
        style={{ display: visible ? 'block' : 'none' }}
      >
        <div className='interestsSettings'>
          <button className='addInterestButton'>＋</button>
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
      </div>
    </>
  )
}
