import { useEffect, useState } from 'react'

export default function TagsOfInterests ({ visible, zapi }) {
  const [interestingTopics, setInterestingTopics] = useState(null)
  useEffect(() => {
    zapi.getInterestingTopics(data => {
      setInterestingTopics(data)
    })
  }, [zapi])

  if (!interestingTopics) return ''

  return (
    <>
      <div
        className='tagsOfInterests'
        style={{ display: visible ? 'block' : 'none' }}
      >
        <div className='interestsSettings'>
          <button className='addInterestButton'>＋</button>
          <button className='closeTagsOfInterests'>save</button>
        </div>

        {interestingTopics.map(topic => (
          <div key={topic.id} addableid={topic.id}>
            <button type='button' className='interests unsubscribed'>
              <span className='addableTitle'>{topic.title}</span>
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
