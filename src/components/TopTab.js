import { NavLink } from 'react-router-dom'

function TopTab ({ id, text, link, isActive, addSeparator }) {
  return (
    <>
      <div className='row__tab'>
        <NavLink
          id={id}
          className={'headmenuTab'}
          to={link}
          exact
          activeStyle={{ fontWeight: 600 }}
        >
          {text}
        </NavLink>
      </div>
      {addSeparator && SeparatorBar()}
    </>
  )
}

function SeparatorBar () {
  return (
    <div className='row__bar'>
      <div className='bar'></div>
    </div>
  )
}

export { TopTab, SeparatorBar }
