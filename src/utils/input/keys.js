// Keyboard decisions that every input and clickable element makes the same way.

// Enter that submits: not Shift+Enter (a new line), and not the Enter that
// picks a candidate in an input method (Japanese, Chinese, Korean; also some
// phone keyboards while a suggestion is showing). Safari reports that one as
// keyCode 229 rather than isComposing.
export function isSubmitEnter(e) {
  const event = e.nativeEvent || e;
  const composing = event.isComposing || event.keyCode === 229;
  return e.key === "Enter" && !e.shiftKey && !composing;
}

// Props that make a non-button element (a row, a card) open like a button:
// a tap, or Enter or Space once it has focus. Only keys aimed at the element
// itself, since Enter on a button inside it (a ×) bubbles up too.
export function opensLikeAButton(open) {
  return {
    role: "button",
    tabIndex: 0,
    onClick: open,
    onKeyDown: (e) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault(); // Space would scroll the page
      open();
    },
    style: { cursor: "pointer" },
  };
}
