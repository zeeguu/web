import * as s from "./FullWidthImage.sc";

export default function FullWidthImage({ src, alt }) {
  return <s.FullWidthImage src={`../static/images/${src}`} alt={alt} />;
}
