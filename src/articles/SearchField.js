import { useState } from 'react'

export default function SearchField ({}) {
  const [searchTerm, setSearchTerm] = useState('')

  function keyDownInSearch (e) {
    if (e.key === 'Enter') {
      console.log(searchTerm)
      window.location = `/articles/search/${searchTerm}`
    }
  }

  return (
    <>
      <div id='searchesList'></div>

      <div id='topicsList'>
        <div id='any_topic' style={{ display: 'block' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <i style={{ color: 'gray' }}>Showing all Interests...</i>
        </div>
      </div>
      <div style={{ fontSize: 'xx-small' }}>&nbsp;</div>

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
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={keyDownInSearch}
        />
      </div>
    </>
  )
}
