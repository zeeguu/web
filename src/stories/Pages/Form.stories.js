import Form from "../../pages/_pages_shared/Form.sc";
import Button from "../../pages/_pages_shared/Button.sc";

export default {
  title: "Pages/Form",
  component: Form,
};

export const Default = {
  render: () => (
    <Form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <Button className="full-width-btn">Submit</Button>
    </Form>
  ),
};
