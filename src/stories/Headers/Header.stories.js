import Header from "../../pages/_pages_shared/Header";

export default {
  title: "Headers/Header",
  component: Header,
};

export const Default = {
  render: () => <Header>Header Content</Header>,
};

export const WithoutLogo = {
  render: () => <Header withoutLogo>Header Content</Header>,
};

export const ShowVersion = {
  render: () => <Header showVersion>Header Content</Header>,
};
