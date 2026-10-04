import { Capacitor, registerPlugin } from "@capacitor/core";
import onAppResume from "../utils/misc/onAppResume";

// iOS plays lessons natively (native-plugins/zeeguu-audio). In the webview's
// <audio>, headset / lock-screen play stopped working a few minutes after a
// pause: iOS suspends the webview, so the commands reached nothing. The native
// player handles those commands itself and tells us what happened.
//
// NativeAudioElement stands in for the <audio> element: the same properties,
// methods and events CustomAudioPlayer uses, backed by the one native player.

const ZeeguuAudio = registerPlugin("ZeeguuAudio");

export function nativeAudioAvailable() {
  return Capacitor.getPlatform() === "ios" && Capacitor.isPluginAvailable("ZeeguuAudio");
}

const NATIVE_EVENTS = ["play", "playing", "pause", "ended", "timeupdate", "seeked", "loadedmetadata", "canplay", "error"];

// The element whose lesson is loaded in the native player, if any.
let owner = null;
let listenersInstalled = false;

function installListeners() {
  if (listenersInstalled) return;
  listenersInstalled = true;

  for (const name of NATIVE_EVENTS) {
    ZeeguuAudio.addListener(name, (data) => {
      if (owner && data && data.url === owner.src) owner._onNative(name, data);
    });
  }

  // Events sent while the webview was suspended can be lost; ask the native
  // player where things stand whenever we come back.
  const resync = () => {
    if (!document.hidden && owner) owner._sync();
  };
  document.addEventListener("visibilitychange", resync);
  onAppResume(resync); // for the app's lifetime, like the native player
}

export class NativeAudioElement extends EventTarget {
  constructor() {
    super();
    installListeners();
    this._src = "";
    this._paused = true;
    this._currentTime = 0;
    this._duration = NaN;
    this._rate = 1;
    this._muted = false;
    this._metadata = {};
    this.readyState = 0;
  }

  get src() {
    return this._src;
  }

  set src(url) {
    if (url === this._src) return;
    if (owner === this) {
      // Like <audio> on a new src: stop without a 'pause' event, which would
      // save the old lesson's position under the new one.
      owner = null;
      ZeeguuAudio.unload();
    }
    this._src = url;
    this._paused = true;
    this._currentTime = 0;
    this._duration = NaN;
    this.readyState = 0;
    if (!url) return;

    this._dispatch("loadstart");
    ZeeguuAudio.probe({ url })
      .then(({ duration }) => {
        if (this._src !== url) return;
        if (duration > 0) this._duration = duration;
        this.readyState = 4;
        this._dispatch("loadedmetadata");
        this._dispatch("canplay");
      })
      .catch(() => {
        // The duration shows up once it plays; still let the player be used.
        if (this._src !== url) return;
        this.readyState = 4;
        this._dispatch("canplay");
      });
  }

  get paused() {
    return this._paused;
  }

  get duration() {
    return this._duration;
  }

  get currentTime() {
    return this._currentTime;
  }

  set currentTime(position) {
    this._currentTime = position;
    // Before this lesson is loaded the position is passed along with prepare().
    if (owner === this) ZeeguuAudio.seek({ position });
  }

  get playbackRate() {
    return this._rate;
  }

  set playbackRate(rate) {
    if (rate === this._rate) return;
    this._rate = rate;
    if (owner === this) ZeeguuAudio.setRate({ rate });
  }

  // The native player has a single rate.
  get defaultPlaybackRate() {
    return this._rate;
  }

  set defaultPlaybackRate(rate) {
    this.playbackRate = rate;
  }

  get muted() {
    return this._muted;
  }

  set muted(muted) {
    this._muted = muted;
    if (owner === this) ZeeguuAudio.setMuted({ muted });
  }

  // Lock-screen title, artist and album.
  setMetadata(metadata) {
    this._metadata = metadata;
    if (owner === this) ZeeguuAudio.setMetadata(metadata);
  }

  async play() {
    if (!this._src) throw new Error("No source");
    if (owner !== this) {
      if (owner) owner._setPaused(true);
      owner = this;
      try {
        await ZeeguuAudio.prepare({
          url: this._src,
          position: this._currentTime,
          rate: this._rate,
          muted: this._muted,
          ...this._metadata,
        });
      } catch (err) {
        // Not loaded, so not ours: the next play() prepares again.
        if (owner === this) owner = null;
        throw err;
      }
    }
    // Another lesson was started while this one was being prepared. Reject,
    // as <audio> does when pause() interrupts play(), so callers don't treat
    // this one as playing.
    if (owner !== this) throw new DOMException("Another lesson started", "AbortError");
    await ZeeguuAudio.play();
    if (owner === this) this._setPaused(false);
  }

  pause() {
    if (owner !== this) return;
    ZeeguuAudio.pause();
    this._setPaused(true);
  }

  // Stop and release the native player (the <audio> equivalent of leaving the page).
  destroy() {
    if (owner !== this) return;
    owner = null;
    ZeeguuAudio.unload();
    this._setPaused(true);
  }

  async _sync() {
    try {
      const state = await ZeeguuAudio.getState();
      if (owner !== this) return;
      if (state.url !== this._src) {
        this._setPaused(true);
        return;
      }
      this._applyState(state);
      this._dispatch("timeupdate");
      if (state.ended && !this._paused) {
        // The 'ended' event was lost while the page was suspended.
        this._setPaused(true);
        this._dispatch("ended");
        return;
      }
      this._setPaused(!state.isPlaying);
    } catch {
      // Keep the last known state
    }
  }

  _onNative(name, data) {
    this._applyState(data);
    if (name === "play") this._setPaused(false);
    else if (name === "pause") this._setPaused(true);
    else if (name === "ended") {
      this._setPaused(true);
      this._dispatch("ended");
    } else if (name === "seeked") {
      // <audio> follows a seek with timeupdate; the progress bar listens for that.
      this._dispatch("seeked");
      this._dispatch("timeupdate");
    } else this._dispatch(name);
  }

  _applyState(state) {
    if (typeof state.position === "number") this._currentTime = state.position;
    if (state.duration > 0) this._duration = state.duration;
  }

  // play / pause events only on real transitions, as <audio> does.
  _setPaused(paused) {
    if (this._paused === paused) return;
    this._paused = paused;
    this._dispatch(paused ? "pause" : "play");
  }

  _dispatch(name) {
    this.dispatchEvent(new Event(name));
  }
}
