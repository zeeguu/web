import * as s from "./Modal.sc";

export default function ButtonContainer({ children, buttonCountNum }) {
  return (
    <s.ButtonsContainer buttonCountNum={buttonCountNum}>
      {children}
    </s.ButtonsContainer>
  );
}
