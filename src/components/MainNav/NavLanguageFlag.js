import DynamicFlagImage from "../DynamicFlagImage";
import NavIcon from "./NavIcon";

// The learned language's flag in place of a generic globe, so the nav says
// which language is active even when collapsed to icons. Sized like the
// MUI nav icons (1.5rem).
export default function NavLanguageFlag({ languageCode }) {
  if (!languageCode) return <NavIcon name="language" />;
  return <DynamicFlagImage languageCode={languageCode} size="1.5rem" style={{ borderColor: "rgba(255, 255, 255, 0.8)" }} />;
}
