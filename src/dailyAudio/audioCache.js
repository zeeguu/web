import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";

// Filesystem caching is only useful on native (iOS/Android) — on the web,
// the browser cache already handles repeat plays and there is no app-local
// FS to point an <audio> tag at.
const isNative = () => Capacitor.isNativePlatform();

const cachePath = (lessonId) => `audio/lesson_${lessonId}.mp3`;

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // result is `data:<mime>;base64,<payload>` — strip the prefix.
      const result = reader.result;
      const comma = typeof result === "string" ? result.indexOf(",") : -1;
      if (comma < 0) reject(new Error("unexpected reader result"));
      else resolve(result.slice(comma + 1));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const localUriFor = async (lessonId) => {
  const { uri } = await Filesystem.getUri({
    path: cachePath(lessonId),
    directory: Directory.Cache,
  });
  return Capacitor.convertFileSrc(uri);
};

// Resolve the best src for the given lesson's audio. On native, returns a
// local file:// URI after downloading once; on subsequent calls returns the
// cached URI instantly. On web (or any failure), falls back to the network
// URL so playback still works.
export async function getCachedAudioUrl(lessonId, networkUrl) {
  if (!isNative() || !lessonId) return networkUrl;

  try {
    await Filesystem.stat({
      path: cachePath(lessonId),
      directory: Directory.Cache,
    });
    return await localUriFor(lessonId);
  } catch {
    // not cached — fall through to download
  }

  try {
    const res = await fetch(networkUrl);
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const blob = await res.blob();
    const data = await blobToBase64(blob);
    await Filesystem.writeFile({
      path: cachePath(lessonId),
      data,
      directory: Directory.Cache,
      recursive: true,
    });
    return await localUriFor(lessonId);
  } catch (err) {
    console.warn("audioCache: falling back to streaming", err);
    return networkUrl;
  }
}
