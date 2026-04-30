import * as s from "./FullWidthImage.sc";

export default function FullWidthImage({ src, alt }) {
  const resolvedSrc = src.startsWith("/") || src.startsWith("http") ? src : `/static/images/${src}`;
  return <s.FullWidthImage src={resolvedSrc} alt={alt} />;
}
