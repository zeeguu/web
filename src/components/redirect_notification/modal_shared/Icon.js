import * as s from "./Modal.sc";

export default function Icon({ src, size }) {
  return <s.Icon type={size} src={src} alt=""/>;
}
