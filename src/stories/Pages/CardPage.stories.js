import CardPage from "../../pages/_pages_shared/CardPage";
import { MemoryRouter } from "react-router-dom";
import LogIn from "../../pages/LogIn";
import NotFound from "../../pages/NotFound";
import "../../index.css";

export default {
  title: "Pages/CardPage",
  component: CardPage,
  args: {
    pageWidth: "default",
    layoutVariant: "default",
    isBackgroundFixed: false,
    isTransparent: false,
    reducedPadding: false,
    defaultEmail: "user@example.com",
    defaultPassword: "password",
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/login"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = {
  render: (args) => (
    <CardPage {...args}>
      <h2>Card Page</h2>
      <p className="centered">This is sample content inside the card.</p>
    </CardPage>
  ),
};

export const NarrowWidth = {
  args: {
    pageWidth: "narrow",
  },
  render: (args) => (
    <CardPage {...args}>
      <h2>Narrow Card</h2>
      <p className="centered">Uses the narrow page width variant.</p>
    </CardPage>
  ),
};

export const CardUnderMenu = {
  args: {
    layoutVariant: "card-under-menu",
  },
  render: (args) => (
    <CardPage {...args}>
      <h2>Card Under Menu</h2>
      <p className="centered">Uses the card-under-menu layout variant.</p>
    </CardPage>
  ),
};

export const FixedBackground = {
  args: {
    isBackgroundFixed: true,
  },
  render: (args) => (
    <CardPage {...args}>
      <h2>Fixed Background</h2>
      <p className="centered">Backdrop is fixed to viewport.</p>
    </CardPage>
  ),
};

export const TransparentCard = {
  args: {
    isTransparent: true,
  },
  render: (args) => (
    <CardPage {...args}>
      <h2>Transparent Card</h2>
      <p className="centered">Card surface background is transparent.</p>
    </CardPage>
  ),
};

export const ReducedPadding = {
  args: {
    reducedPadding: true,
  },
  render: (args) => (
    <CardPage {...args}>
      <h2>Reduced Padding</h2>
      <p className="centered">Card uses compact inner spacing.</p>
    </CardPage>
  ),
};
export const LoginPage = {
  render: () => <LogIn handleSuccessfulLogIn={() => {}} />,
};

export const NotFoundPage = {
  render: () => <NotFound />,
};
