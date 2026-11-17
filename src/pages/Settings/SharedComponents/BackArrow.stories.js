import BackArrow from "./BackArrow";

export default {
  title: "Buttons/BackArrow",
  component: BackArrow,
};

export const Default = {};

export const WithRedirect = {
  args: {
    redirectLink: "/account_settings",
  },
};
