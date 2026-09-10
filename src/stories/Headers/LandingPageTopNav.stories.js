import LandingPageTopNav from "../../landingPage/LandingPageTopNav";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "Headers/LandingPageTopNav",
  component: LandingPageTopNav,
};

export const Default = {
  render: () => (
    <MemoryRouter>
      <LandingPageTopNav />
    </MemoryRouter>
  ),
};
