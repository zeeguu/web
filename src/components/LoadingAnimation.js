import * as s from "./LoadingAnimation.sc";

export default function LoadingAnimation({ text }) {
  let _text = text ? text : "loading...";
  return <s.LoadingAnimation>{_text}</s.LoadingAnimation>;
}
