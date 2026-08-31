import ResetPasswordStep2 from "../../../pages/ResetPasswordStep2";
import "../../../index.css";

export default {
  title: "Dialogs/ResetPassword/ResetPasswordStep2",
  component: ResetPasswordStep2,
};

export const Default = {
  render: () => <ResetPasswordStep2 email="ada@example.com" isLoggedIn={false} />,
};
