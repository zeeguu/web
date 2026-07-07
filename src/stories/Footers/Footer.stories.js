import Footer from "../../pages/_pages_shared/Footer.sc";
import Button from "../../pages/_pages_shared/Button.sc";

export default {
  title: "Footers/Footer",
  component: Footer,
};

export const Default = {
  render: () => (
    <Footer>
      <Button className="full-width-btn">Primary Action</Button>
      <Button className="grey small">Secondary Action</Button>
    </Footer>
  ),
};

export const SingleChild = {
  render: () => (
    <Footer>
      <Button>Continue</Button>
    </Footer>
  ),
};
