import LocalStorage from "../assorted/LocalStorage";
import News from "./News";
import * as s from "./LandingPage.sc.js";
import Contributors from "./Contributors";
import { Redirect } from "react-router-dom";

export default function LandingPage() {
  if (LocalStorage.hasSession()) {
    return <Redirect to={{ pathname: "/articles" }} />;
  }
  return (
    <div>
      <s.LoginHeader>
        <s.HeaderTitle>Zeeguu</s.HeaderTitle>
        <nav>
          <s.HeaderButton>
            <a href="/login">Sign In</a>
          </s.HeaderButton>
        </nav>
      </s.LoginHeader>

      <s.PageContent>
        <s.NarrowColumn>
          <s.BigLogo>
            <img src="/static/images/zeeguuLogo.svg" alt="elephant logo" />
          </s.BigLogo>
          <h1>Zeeguu</h1>
          <h4>
            A research project aiming to personalize reading and vocabulary
            practice in foreign languages
          </h4>

          <s.InviteButton>
            <nav>
              <a href="./create_account">Become a Betatester!</a>
            </nav>
          </s.InviteButton>
        </s.NarrowColumn>

        <s.PaleAdaptableColumn>
          <h1>How Does It Work?</h1>
          <h2>Personalized Recommendations</h2>
          <s.DescriptionText>
            <p>
              Our system continuously searches the net for texts based on your
              personalized interests. We believe that personally relevant texts
              will motivate you to study more.
            </p>

            <p>
              Moreover, we aim to help you to find texts that are at the right
              difficulty level since you learn best when materials are
              challenging but not too difficult (this is what is called
              "studying in the zone of proximal development").
            </p>
          </s.DescriptionText>

          <h2>Easy Translations</h2>
          <s.DescriptionText>
            <p>
              If a text is challenging it will also include words that you don't
              understand.
            </p>

            <p>
              By using machine translation our system helps you obtain
              translations in any text with a simple click (or tap on
              touch-enabled devices).
            </p>

            <p>
              The system also provides word pronunciation support. For some
              languages, e.g. Danish, this is actually very important.
            </p>
          </s.DescriptionText>

          <h2>Personalized Practice</h2>
          <s.DescriptionText>
            <p>
              Zeeguu generates personalized vocabulary exercises by using the
              original context in which you encountered words that you didn't
              understand. We do this because contextual learning works better.
            </p>

            <p>
              Spaced repetition algorithms optimize your practice. Moreover, if
              you have limited time, our algorithms will prioritize frequent
              words in your exercises.
            </p>
            {/* <p>
              Zeeguu uses machine learning to create a model of your vocabulary
              knowledge based on your past interactions with texts the system.
            </p> */}
          </s.DescriptionText>
        </s.PaleAdaptableColumn>

        <s.AdaptableColumn>
          <News />
        </s.AdaptableColumn>

        <s.PaleAdaptableColumn>
          <Contributors />
        </s.PaleAdaptableColumn>
      </s.PageContent>
    </div>
  );
}
