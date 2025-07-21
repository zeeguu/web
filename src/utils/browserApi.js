/*global chrome*/
/*global browser*/
import { runningInChromeDesktop } from "../zeeguu-react/src/utils/misc/browserDetection";

export const BROWSER_API = runningInChromeDesktop() ? chrome : browser