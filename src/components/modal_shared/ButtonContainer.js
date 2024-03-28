import * as s from "./ButtonContainer.sc";

export default function ButtonContainer({ children, buttonCountNum }) {
  return (
    <s.ButtonContainer buttonCountNum={buttonCountNum}>
      {children}
    </s.ButtonContainer>
  );
}
