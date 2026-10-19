import { Capacitor, registerPlugin } from "@capacitor/core";

// Aiki mode on iOS (native-plugins/zeeguu-shield): the learner picks the apps
// they find distracting, and while the shield is on, opening one of them shows
// a shield screen instead. Uses Apple's Screen Time API (iOS 16+).

export const ZeeguuShield = registerPlugin("ZeeguuShield");

export function nativeShieldAvailable() {
  return Capacitor.getPlatform() === "ios" && Capacitor.isPluginAvailable("ZeeguuShield");
}
