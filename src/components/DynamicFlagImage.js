import * as s from "./DynamicFlagImage.sc";

export default function DynamicFlagImage({ languageCode }) {
  return (
    <s.DynamicFlagImage src={`/static/flags-new/${languageCode}.svg`} alt="" />
  );
}
