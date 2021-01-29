import LocalStorage from '../LocalStorage'
import UserHome from '../articles/Articles'
import * as s from './LandingPage.sc.js'

export default function LandingPage () {
  if (!LocalStorage.hasSession) {
    return <UserHome />
  }
  return (
    <div>
      <s.LoginHeader>
        <s.HeaderTitle>Zeeguu</s.HeaderTitle>
        <nav>
          <s.HeaderButton>
            <a href='/login'>Sign In</a>
          </s.HeaderButton>
        </nav>
      </s.LoginHeader>

      <s.PageContent>
        <s.NarrowColumn>
          <s.BigLogo>
            <img src='/static/images/zeeguuLogo.svg' />
          </s.BigLogo>
          <h1>Zeeguu</h1>
          <h4>
            A research project aiming to personalize reading and vocabulary
            practice in foreign languages
          </h4>

          <s.InviteButton>
            <nav>
              <a href='./create_account'>Become a Betatester!</a>
            </nav>
          </s.InviteButton>
        </s.NarrowColumn>

        <s.PaleAdaptableColumn>
          <h1>How Does It Work?</h1>
          <h2>Personalized Recommendations</h2>
          <s.DescriptionText>
            <p>
              Our system continuously searches the net for texts based on your
              own declared interests.
            </p>

            <p>
              We help you find texts that are at the right difficulty level
              since you learn best when materials are challenging but not too
              difficult
            </p>

            <p>
              Unlike the generic texts that you can find in textbooks,
              personally relevant texts will motivate you to study more.
            </p>
          </s.DescriptionText>

          <h2>Easy Translations</h2>
          <s.DescriptionText>
            <p>
              Studies show that you learn best when the texts that you read are
              challenging. In such a text you will still encounter words that
              you don't understand.
            </p>

            <p>
              By using machine translation our system helps you obtain
              translations in any text with a simple click (or tap on
              touch-enabled devices).
            </p>

            <p>
              The system also provides word pronunciation support. For some
              languages, e.g. Danish, this is very important.
            </p>
          </s.DescriptionText>

          <h2>Personalized Practice</h2>
          <s.DescriptionText>
            <p>
              Spaced repetition algorithms optimize your practice and frequent
              words are prioritized.
            </p>
            <p>
              Zeeguu uses machine learning to create a model of your vocabulary
              knowledge based on your past interactions with texts the system.
            </p>
            <p>
              It then generates a variety of vocabulary exercises, some of
              which, even use the original context of the word because
              contextual learning works better.
            </p>
          </s.DescriptionText>
        </s.PaleAdaptableColumn>

        <s.AdaptableColumn>
          <h1>News</h1>
          <p>Paper at CHI'2021</p>
          <p>Two New Schools</p>
          <p>Paper at CHI'2020</p>
        </s.AdaptableColumn>

        <s.PaleAdaptableColumn>
          <h1>Contributors</h1>
          <p>Mircea Lungu</p>
          <p>Simon Marti</p>
        </s.PaleAdaptableColumn>
      </s.PageContent>
    </div>
  )
}
