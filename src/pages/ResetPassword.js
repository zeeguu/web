import { useState } from "react";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Footer from "./info_page_shared/Footer";

import ResetPasswordStep1 from "./ResetPasswordStep1";
import ResetPasswordStep2 from "./ResetPasswordStep2";

export default function ResetPassword({ api }) {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  function validEmail() {
    setCodeSent(true);
  }

  return (
    <InfoPage type={"narrow"}>
      <Header>
        <Heading>Reset Password</Heading>
      </Header>
      <Main>
        {!codeSent && (
          <ResetPasswordStep1
            api={api}
            email={email}
            setEmail={setEmail}
            notifyOfValidEmail={validEmail}
          />
        )}

        {codeSent && (
          <ResetPasswordStep2 api={api} email={email} setEmail={setEmail} />
        )}
      </Main>
      <Footer>
        <p>
          Remember password?{" "}
          <a className="links" href="login">
            <b>Log in</b>
          </a>{" "}
        </p>
      </Footer>
    </InfoPage>
  );
}
