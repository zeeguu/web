import * as s from "./ButtonContainer.sc";

export default function ButtonContainer({ children, contentAlignment }) {
  return (
    <s.ButtonContainer contentAlignment={contentAlignment}>
      {children}
    </s.ButtonContainer>
  );
}
