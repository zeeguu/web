import ResetPasswordStep2 from "./ResetPasswordStep2";

export default {
  title: "Dialogs/ResetPassword/ResetPasswordStep2",
  component: ResetPasswordStep2,
};

export const Default = {
  render: () => <ResetPasswordStep2 email="ada@example.com" isLoggedIn={false} />,
};
