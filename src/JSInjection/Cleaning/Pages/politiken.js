export const politikenRegex = /(http|https):\/\/(politiken.dk).*/;

export function removeSignUp(readabilityContent) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = readabilityContent;
  const signUp = newDiv.querySelectorAll('[data-element-type="relation"]');
  if (signUp) {
    for (let i = 0; i < signUp.length; i++) {
      signUp[i].remove();
    }
  }
  return newDiv.innerHTML;
}
