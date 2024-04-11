import * as s from "./MainImage.sc";

export default function MainImage({ src, alt }) {
  return <s.MainImage src={`../static/images/${src}`} alt={alt} />;
}
