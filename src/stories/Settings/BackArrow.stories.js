import BackArrow from "../../pages/Settings/SharedComponents/BackArrow";
import "../../index.css";

export default {
  title: "Settings/BackArrow",
  component: BackArrow,
};

export const Default = {};

export const WithRedirect = {
  args: {
    redirectLink: "/account_settings",
  },
};
