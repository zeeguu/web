import ResetPasswordStep1 from "../../../pages/ResetPasswordStep1";
import "../../../index.css";

export default {
  title: "Dialogs/ResetPassword/ResetPasswordStep1",
  component: ResetPasswordStep1,
};

export const Default = {
  render: () => (
    <ResetPasswordStep1
      email=""
      setEmail={() => {}}
      validateEmail={() => true}
      isEmailValid={true}
      emailErrorMsg={""}
      notifyEmailSent={() => {}}
    />
  ),
};
