import { BROWSER_API } from "../utils/browserApi";

export async function getCurrentTab() {
  const [tab] = await BROWSER_API.tabs.query({ active: true, currentWindow: true });
  return tab;
}
