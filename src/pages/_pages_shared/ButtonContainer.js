import * as s from "./ButtonContainer.sc";

export default function ButtonContainer({
  children,
  contentAlignment,
  className,
}) {
  return (
    <s.ButtonContainer
      className={className}
      contentAlignment={contentAlignment}
    >
      {children}
    </s.ButtonContainer>
  );
}
