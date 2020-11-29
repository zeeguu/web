function percentageDone (index, total) {
  var p = Math.floor((index / total) * 100)
  return p
}

export default function ProgressBar ({ index, total }) {
  return (
    <div className='progressModule'>
      <div className='ex-progress'>
        <div
          id='ex-bar'
          style={{ width: percentageDone(index, total) + '%' }}
        ></div>
      </div>
    </div>
  )
}
