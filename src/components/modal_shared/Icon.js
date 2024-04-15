import * as s from "./Icon.sc";

export default function Icon({ src, size }) {
  return <s.Icon type={size} src={src} alt=""/>;
}
