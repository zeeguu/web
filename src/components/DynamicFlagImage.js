import * as s from "./DynamicFlagImage.sc";

// Extra props pass through so callers can place the flag (margins, title)
// without wrapping it in a span just to nudge it.
export default function DynamicFlagImage({ languageCode, size, ...rest }) {
  return (
    <s.DynamicFlagImage
      src={`/static/flags-new/${languageCode}.svg`}
      alt=""
      $size={size}
      {...rest}
    />
  );
}
