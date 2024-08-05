import * as s from "./Form.sc";

export default function Form({ children, action, method }) {
  return (
    <s.Form action={action} method={method}>
      {children}
    </s.Form>
  );
}
