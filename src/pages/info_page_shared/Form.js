export default function Form({ children, action, method }) {
  return (
    <s.Form action={action} method={method}>
      {children}
    </s.Form>
  );
}
