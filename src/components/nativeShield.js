import { Capacitor, registerPlugin } from "@capacitor/core";

// Aiki mode on iOS (native-plugins/zeeguu-shield): the learner picks the apps
// they find distracting, and while the shield is on, opening one of them shows
// a shield screen instead. Uses Apple's Screen Time API (iOS 16+).

export const ZeeguuShield = registerPlugin("ZeeguuShield");

export function nativeShieldAvailable() {
  return Capacitor.getPlatform() === "ios" && Capacitor.isPluginAvailable("ZeeguuShield");
}

// Which setup step a learner is at, from ZeeguuShield.getStatus().
export function aikiStep(status) {
  if (!status || !status.supported) return "unsupported";
  if (status.authorization !== "approved") return "authorize";
  if (pickedCount(status) === 0) return "pick";
  return "ready";
}

export function pickedCount(selection) {
  return (selection?.apps || 0) + (selection?.categories || 0) + (selection?.webDomains || 0);
}

// "2 apps and 1 category"
export function describePicked(selection) {
  const parts = [
    [selection?.apps, "app"],
    [selection?.categories, "category"],
    [selection?.webDomains, "website"],
  ]
    .filter(([n]) => n > 0)
    .map(([n, noun]) => `${n} ${n === 1 ? noun : noun === "category" ? "categories" : noun + "s"}`);
  return parts.join(" and ");
}
