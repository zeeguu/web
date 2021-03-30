import * as s from "./LoadingAnimation.sc";
import strings from "../i18n/definitions"

export default function LoadingAnimation({ text }) {
  let _text = text ? text : strings.loadingMsg;
  return <s.LoadingAnimation>{_text}</s.LoadingAnimation>;
}
