function ReadingTab ({ id, text, link, isActive }) {
  return (
    <div className='row__tab'>
      <a
        id={id}
        href={link}
        className={'headmenuTab ' + (isActive ? 'is-active' : '')}
      >
        {text}
      </a>
    </div>
  )
}

function SeparatorBar () {
  return (
    <div className='row__bar'>
      <div className='bar'></div>
    </div>
  )
}

export { ReadingTab, SeparatorBar }
