import { MemoryRouter } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import "../../index.css";

export default {
  title: "Pages/NotFound",
  component: NotFound,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/nonexistent"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = {};
