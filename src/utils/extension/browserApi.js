/*global chrome*/
/*global browser*/

import { runningInChromeDesktop } from "../misc/browserDetection";

export const BROWSER_API = runningInChromeDesktop() ? chrome : browser;
