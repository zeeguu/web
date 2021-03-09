import { useState } from "react";

import * as s from "../components/FormPage.sc";

import ResetPasswordStep1 from "./ResetPasswordStep1";
import ResetPasswordStep2 from "./ResetPasswordStep2";

export default function ResetPassword({ api, notifySuccessfulSignIn }) {
  const [email, setEmail] = useState("");

  const [codeSent, setCodeSent] = useState(false);

  function validEmail() {
    setCodeSent(true);
  }

  return (
    <s.PageBackground>
      <s.LogoOnTop />

      <s.NarrowFormContainer>
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
      </s.NarrowFormContainer>
    </s.PageBackground>
  );
}
