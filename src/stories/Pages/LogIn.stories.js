import { MemoryRouter } from "react-router-dom";
import LogIn from "../../pages/LogIn";
import "../../index.css";

export default {
  title: "Pages/LogIn",
  component: LogIn,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/login"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = {
  args: {
    defaultEmail: "user@example.com",
    defaultPassword: "password",
  },
};
