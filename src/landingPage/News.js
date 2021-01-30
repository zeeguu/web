export default function News () {
  function item (month, text) {
    return (
      <>
        <div style={{ textAlign: 'left' }}>
          <p>
            <small>({month})</small> {text}
          </p>
        </div>
      </>
    )
  }
  return (
    <>
      <h1>News</h1>

      <h2>2021</h2>

      {item('Feb', <>Kick off of project about using Zeeguu to teach Danish</>)}

      <h2>2020</h2>

      {item('Jan', <>Paper about Zeeguu accepted at CHI'2021</>)}

      {item(
        'Sep',
        <>
          👨‍🎓 A highschool in Rotterdam starts using Zeeguu in their language
          classes
        </>
      )}

      {item('Aug', <> Workshop about Zeeguu at EuroCALL 2020</>)}

      {item(
        'Jul',
        <>
          The beta-testers of Zeeguu reach 40'000 distinct words practiced
          within the exercises
        </>
      )}

      <h2>2019</h2>

      {item(
        'Oct',
        <>
          The beta-testers of Zeeguu have reached 100'000 translations in their
          foreign language readings
        </>
      )}

      {item(
        'Sep',
        <>
          👩‍🎓 A highschool in Amsterdam starts using Zeeguu in the French courses
        </>
      )}

      {item('Aug', <>Mircea talks about Zeeguu at EuroCALL 2019</>)}

      <h2>2018</h2>
      {item(
        'Jan',
        <>
          Paper about Zeeguu accepted at CHI 2018 -- the top international
          conference on HCI
        </>
      )}

      {item(
        'Sep',
        <>
          👩‍🎓 Students at the Language Center from the University of Groningen
          use Zeeguu in their Dutch classes
        </>
      )}

      <h2>2017</h2>

      {item(
        'May',
        <>
          {' '}
          👩‍🎓 Students at the Gomarus College in Netherlands start using Zeeguu
          in their French classes
        </>
      )}

      <h2>2016</h2>
      {item('Dec', <> Zeeguu is online and ready to welcome beta-testers</>)}
    </>
  )
}
