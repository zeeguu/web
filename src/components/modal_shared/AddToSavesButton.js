import * as s from "./AddToSavesButton.sc";

export default function AddToSavesButton({ children, onClick }) {
  return (
    <s.AddToSavesButton role="button" onClick={onClick}>
      {children}
    </s.AddToSavesButton>
  );
}
