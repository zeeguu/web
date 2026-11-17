import Form from "./Form.sc";
import Button from "./Button.sc";

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
