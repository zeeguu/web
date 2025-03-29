import * as s from "./DecorativeFlagImage.sc";

export default function DecorativeFlagImage({ languageCode }) {
  return (
    <s.DecorativeFlagImage
      src={`/static/flags-new/${languageCode}.svg`}
      alt=""
    />
  );
}
