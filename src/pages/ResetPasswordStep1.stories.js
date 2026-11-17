import ResetPasswordStep1 from "./ResetPasswordStep1";

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
