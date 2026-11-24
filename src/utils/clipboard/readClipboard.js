import { Capacitor } from "@capacitor/core";
import { Clipboard } from "@capacitor/clipboard";

// The text on the clipboard, or "" when there is none or the read is refused.
// Call it only on a tap. In the app this is the native clipboard: the web
// view's own refuses on Android. iOS still asks "Allow Paste" unless the
// learner allowed it once in Settings.
export async function readClipboard() {
  try {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Clipboard.read();
      return value || "";
    }
    return await navigator.clipboard.readText();
  } catch {
    return "";
  }
}
