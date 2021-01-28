import LocalStorage from '../LocalStorage'
import UserHome from '../articles/Articles'
import styled from 'styled-components'

export default function LandingPage () {
  if (!LocalStorage.hasSession) {
    return <UserHome />
  }
  return (
    <div>
      <nav>
        <LoginHeader>
          <Title>Zeeguu</Title>
          <Button>
            <a href='/login'>Sign In</a>
          </Button>
        </LoginHeader>
      </nav>

      <PageContent>
        <LogoContainer>
          <BigLogo>
            <img src='/static/images/zeeguuLogo.svg' />
          </BigLogo>
          <h1>Zeeguu</h1>
          <p>
            A research project aiming to personalize reading and vocabulary
            practice in foreign languages
          </p>

          <InviteButton>
            <a href='./create_account'>Become a Betatester!</a>
          </InviteButton>
        </LogoContainer>
      </PageContent>
    </div>
  )
}

const LoginHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 4em;
  background: #ffbb54;
  color: white;
  font-size: 18px;
  font-family: Montserrat;
  margin: 0;
  margin-bottom: 1em;
`

const Title = styled.div`
  font-size: 1.5em;
  font-weight: 600;
  margin-left: 1em;
  margin-top: 0.6em;
`

const Button = styled.div`
  background: white;
  width: 6em;
  height: 2em;
  border-radius: 1em;
  text-align: center;
  line-height: 2em;
  margin-top: 0.9em;
  margin-right: 1em;

  a {
    color: #ffbb54;
    font-size: 1em;
    font-weight: 500;
  }
`

const PageContent = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
`

const LogoContainer = styled.div`
  padding-top: 3em;
  padding-bottom: 3em;
  height: auto;

  width: 20em;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    color: #ffbb54;
  }

  p {
    padding: 0.5em 1em;
  }
`

const BigLogo = styled.div`
  transform-origin: top center;
  animation: swing 2s ease 3;
  text-align: center;

  img {
    width: 10em;
  }
`

const InviteButton = styled.button`
  height: 4em;
  width: 25em;
  background: #ffbb54;
  border: 0.3em solid #ffbb54;
  border-radius: 7em;
  margin-bottom: 3em;
  margin-top: 3em;

  overflow: hidden;

  a {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 1.5em;
    color: white;
  }
`
