import Foundation
import AVFoundation
import MediaPlayer
import UIKit
import Capacitor

/// Native lesson playback for iOS.
///
/// Playing lessons through the webview's <audio> worked until the lesson was
/// paused in the background: a few minutes later iOS suspends the webview, and
/// headset / lock-screen play then reaches nothing. Here the audio lives in the
/// app process (AVPlayer) and the remote commands are handled natively, so
/// they work no matter what state the webview is in. The page is told what
/// happened through events, and re-syncs with getState() when it wakes up.
///
/// One player for the whole app, like the system's Now Playing slot. Events
/// carry the url so the page can tell which lesson they're about.
@objc(ZeeguuAudioPlugin)
public class ZeeguuAudioPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ZeeguuAudioPlugin"
    public let jsName = "ZeeguuAudio"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "probe", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "prepare", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "play", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pause", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "seek", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setRate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setMuted", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setMetadata", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getState", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "unload", returnType: CAPPluginReturnPromise)
    ]

    private static let skipSeconds: Double = 10

    private let player = AVPlayer()
    private var url: String?
    private var rate: Float = 1.0
    private var title = "Audio Lesson"
    private var artist = "Zeeguu"
    private var album = ""

    // Where to start once the item is ready, and whether play() was asked for
    // before it was. Seeking a not-yet-ready item isn't reliable, so both wait
    // for readyToPlay.
    private var pendingStart: Double = 0
    private var playWhenReady = false
    // Whether the learner (not the system) last asked for playback; decides
    // whether to resume after an interruption such as a phone call.
    private var wantsToPlay = false
    private var resumeAfterInterruption = false
    private var reportedPlaying = false

    private var rateObservation: NSKeyValueObservation?
    private var timeControlObservation: NSKeyValueObservation?
    private var itemStatusObservation: NSKeyValueObservation?
    private var endObserver: NSObjectProtocol?
    private var timeObserver: Any?
    private var lastBackgroundTimeUpdate = Date.distantPast

    override public func load() {
        rateObservation = player.observe(\.rate, options: [.new]) { [weak self] _, _ in
            DispatchQueue.main.async { self?.playbackStateMayHaveChanged() }
        }
        timeControlObservation = player.observe(\.timeControlStatus, options: [.new]) { [weak self] player, _ in
            DispatchQueue.main.async {
                if player.timeControlStatus == .playing { self?.emit("playing") }
            }
        }
        timeObserver = player.addPeriodicTimeObserver(
            forInterval: CMTime(seconds: 0.5, preferredTimescale: 600),
            queue: .main
        ) { [weak self] _ in
            guard let self = self, self.player.rate != 0 else { return }
            // In the background, every 10s rather than every 0.5s: enough for
            // the page to keep saving progress if it's running, without piling
            // up JS evaluations in a suspended webview. It also re-syncs with
            // getState() on return.
            if UIApplication.shared.applicationState != .active {
                guard Date().timeIntervalSince(self.lastBackgroundTimeUpdate) >= 10 else { return }
                self.lastBackgroundTimeUpdate = Date()
            }
            self.emit("timeupdate")
        }
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleInterruption(_:)),
            name: AVAudioSession.interruptionNotification,
            object: AVAudioSession.sharedInstance()
        )
        setUpRemoteCommands()
    }

    // MARK: - JS API

    /// Duration of a file without loading it into the player, so every lesson
    /// card can show its length while another one is playing.
    @objc func probe(_ call: CAPPluginCall) {
        guard let urlString = call.getString("url"), let assetURL = URL(string: urlString) else {
            call.reject("Missing or invalid url")
            return
        }
        let asset = AVURLAsset(url: assetURL)
        asset.loadValuesAsynchronously(forKeys: ["duration"]) {
            var error: NSError?
            if asset.statusOfValue(forKey: "duration", error: &error) == .loaded {
                call.resolve(["duration": Self.seconds(asset.duration)])
            } else {
                call.reject(error?.localizedDescription ?? "Could not read duration")
            }
        }
    }

    @objc func prepare(_ call: CAPPluginCall) {
        guard let urlString = call.getString("url"), let assetURL = URL(string: urlString) else {
            call.reject("Missing or invalid url")
            return
        }
        DispatchQueue.main.async {
            if self.reportedPlaying, let previous = self.url {
                // Tell the lesson we're switching away from that it's paused.
                self.reportedPlaying = false
                self.emit("pause", url: previous)
            }
            self.wantsToPlay = false
            self.playWhenReady = false
            self.player.pause()

            self.url = urlString
            self.rate = call.getFloat("rate") ?? self.rate
            self.title = call.getString("title") ?? self.title
            self.artist = call.getString("artist") ?? self.artist
            self.album = call.getString("album") ?? self.album
            self.player.isMuted = call.getBool("muted") ?? false
            self.loadItem(assetURL, startingAt: call.getDouble("position") ?? 0)
            call.resolve()
        }
    }

    @objc func play(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard self.player.currentItem != nil else {
                call.reject("Nothing loaded")
                return
            }
            self.startPlayback()
            call.resolve()
        }
    }

    @objc func pause(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.pausePlayback()
            call.resolve()
        }
    }

    @objc func seek(_ call: CAPPluginCall) {
        let position = call.getDouble("position") ?? 0
        DispatchQueue.main.async {
            self.seek(to: position)
            call.resolve()
        }
    }

    @objc func setRate(_ call: CAPPluginCall) {
        let newRate = call.getFloat("rate") ?? 1.0
        DispatchQueue.main.async {
            self.rate = newRate
            if self.player.rate != 0 { self.player.rate = newRate }
            self.updateNowPlaying()
            call.resolve()
        }
    }

    @objc func setMuted(_ call: CAPPluginCall) {
        let muted = call.getBool("muted") ?? false
        DispatchQueue.main.async {
            self.player.isMuted = muted
            call.resolve()
        }
    }

    @objc func setMetadata(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.title = call.getString("title") ?? self.title
            self.artist = call.getString("artist") ?? self.artist
            self.album = call.getString("album") ?? self.album
            if self.player.currentItem != nil { self.updateNowPlaying() }
            call.resolve()
        }
    }

    @objc func getState(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            var state = self.stateData()
            state["isPlaying"] = self.player.rate != 0 || (self.playWhenReady && self.player.currentItem != nil)
            call.resolve(state)
        }
    }

    @objc func unload(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.wantsToPlay = false
            self.playWhenReady = false
            self.player.pause()
            self.player.replaceCurrentItem(with: nil)
            self.itemStatusObservation = nil
            if let endObserver = self.endObserver {
                NotificationCenter.default.removeObserver(endObserver)
                self.endObserver = nil
            }
            self.url = nil
            self.reportedPlaying = false
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
            try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
            call.resolve()
        }
    }

    // MARK: - Playback

    private func loadItem(_ assetURL: URL, startingAt position: Double) {
        pendingStart = position
        let item = AVPlayerItem(url: assetURL)
        item.audioTimePitchAlgorithm = .timeDomain // made for speech at non-1x rates
        observe(item)
        player.replaceCurrentItem(with: item)
        updateNowPlaying()
    }

    private func startPlayback() {
        guard var item = player.currentItem else { return }
        activateSession()
        wantsToPlay = true
        if item.status == .failed, let urlString = url, let assetURL = URL(string: urlString) {
            // A failed item never becomes ready (e.g. after a network drop);
            // try again with a fresh one from where it stopped.
            loadItem(assetURL, startingAt: Self.seconds(player.currentTime()))
            guard let fresh = player.currentItem else { return }
            item = fresh
        }
        if item.status != .readyToPlay {
            playWhenReady = true
            // Show "playing" right away, as <audio> does; the sound follows
            // once the item is ready.
            reportPlaying(true)
            return
        }
        let duration = Self.seconds(item.duration)
        if duration > 0 && Self.seconds(player.currentTime()) >= duration - 0.5 {
            player.seek(to: .zero)
        }
        player.rate = rate
    }

    private func pausePlayback() {
        wantsToPlay = false
        playWhenReady = false
        player.pause()
        // If nothing was audible yet the rate never changed, so report it here.
        reportPlaying(false)
        updateNowPlaying()
    }

    private func seek(to position: Double) {
        guard let item = player.currentItem else { return }
        if item.status != .readyToPlay {
            // Seeking a not-yet-ready item isn't reliable; start there instead.
            pendingStart = max(0, position)
            emit("seeked", extra: ["position": pendingStart])
            return
        }
        let target = CMTime(seconds: max(0, position), preferredTimescale: 600)
        player.seek(to: target, toleranceBefore: .zero, toleranceAfter: .zero) { [weak self] _ in
            DispatchQueue.main.async {
                self?.emit("seeked")
                self?.updateNowPlaying()
            }
        }
    }

    private func observe(_ item: AVPlayerItem) {
        if let endObserver = endObserver {
            NotificationCenter.default.removeObserver(endObserver)
        }
        endObserver = NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: item,
            queue: .main
        ) { [weak self] _ in
            guard let self = self else { return }
            self.wantsToPlay = false
            self.reportPlaying(false)
            self.emit("ended")
            self.updateNowPlaying()
        }

        itemStatusObservation = item.observe(\.status, options: [.new]) { [weak self] item, _ in
            DispatchQueue.main.async {
                guard let self = self, item == self.player.currentItem else { return }
                switch item.status {
                case .readyToPlay:
                    self.emit("loadedmetadata")
                    self.emit("canplay")
                    let start = self.pendingStart
                    self.pendingStart = 0
                    let begin = {
                        self.updateNowPlaying()
                        if self.playWhenReady {
                            self.playWhenReady = false
                            self.player.rate = self.rate
                        }
                    }
                    if start > 0 {
                        let target = CMTime(seconds: start, preferredTimescale: 600)
                        self.player.seek(to: target, toleranceBefore: .zero, toleranceAfter: .zero) { _ in
                            DispatchQueue.main.async { begin() }
                        }
                    } else {
                        begin()
                    }
                case .failed:
                    self.playWhenReady = false
                    self.wantsToPlay = false
                    self.reportPlaying(false)
                    self.emit("error", extra: ["message": item.error?.localizedDescription ?? "Playback failed"])
                default:
                    break
                }
            }
        }
    }

    private func playbackStateMayHaveChanged() {
        if player.rate != 0 {
            reportPlaying(true)
        } else if !playWhenReady {
            reportPlaying(false)
        }
        updateNowPlaying()
    }

    /// Emit play/pause only on real transitions; rate changes for a new speed
    /// shouldn't look like the learner pressed play again.
    private func reportPlaying(_ playing: Bool) {
        guard playing != reportedPlaying else { return }
        reportedPlaying = playing
        emit(playing ? "play" : "pause")
    }

    private func activateSession() {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.playback, mode: .spokenAudio, options: [])
            try session.setActive(true)
        } catch {
            CAPLog.print("ZeeguuAudio: could not activate audio session: \(error)")
        }
    }

    @objc private func handleInterruption(_ notification: Notification) {
        guard let info = notification.userInfo,
              let typeValue = info[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: typeValue) else { return }
        DispatchQueue.main.async {
            switch type {
            case .began:
                self.resumeAfterInterruption = self.wantsToPlay
                // Don't let an item that becomes ready mid-call start playing.
                self.playWhenReady = false
                self.reportPlaying(false)
                self.updateNowPlaying()
            case .ended:
                let optionsValue = info[AVAudioSessionInterruptionOptionKey] as? UInt ?? 0
                let options = AVAudioSession.InterruptionOptions(rawValue: optionsValue)
                if self.resumeAfterInterruption && options.contains(.shouldResume) {
                    self.startPlayback()
                }
                self.resumeAfterInterruption = false
            @unknown default:
                break
            }
        }
    }

    // MARK: - Lock screen & headset

    private func setUpRemoteCommands() {
        let center = MPRemoteCommandCenter.shared()

        center.playCommand.addTarget { [weak self] _ in
            guard let self = self, self.player.currentItem != nil else { return .noActionableNowPlayingItem }
            self.startPlayback()
            return .success
        }
        center.pauseCommand.addTarget { [weak self] _ in
            guard let self = self, self.player.currentItem != nil else { return .noActionableNowPlayingItem }
            self.pausePlayback()
            return .success
        }
        center.togglePlayPauseCommand.addTarget { [weak self] _ in
            guard let self = self, self.player.currentItem != nil else { return .noActionableNowPlayingItem }
            if self.player.rate != 0 || self.playWhenReady {
                self.pausePlayback()
            } else {
                self.startPlayback()
            }
            return .success
        }

        center.skipBackwardCommand.preferredIntervals = [NSNumber(value: Self.skipSeconds)]
        center.skipBackwardCommand.addTarget { [weak self] event in
            guard let self = self, self.player.currentItem != nil else { return .noActionableNowPlayingItem }
            let interval = (event as? MPSkipIntervalCommandEvent)?.interval ?? Self.skipSeconds
            self.seek(to: Self.seconds(self.player.currentTime()) - interval)
            return .success
        }
        center.skipForwardCommand.preferredIntervals = [NSNumber(value: Self.skipSeconds)]
        center.skipForwardCommand.addTarget { [weak self] event in
            guard let self = self, let item = self.player.currentItem else { return .noActionableNowPlayingItem }
            let interval = (event as? MPSkipIntervalCommandEvent)?.interval ?? Self.skipSeconds
            let duration = Self.seconds(item.duration)
            var target = Self.seconds(self.player.currentTime()) + interval
            if duration > 0 { target = min(target, duration) }
            self.seek(to: target)
            return .success
        }
        center.changePlaybackPositionCommand.addTarget { [weak self] event in
            guard let self = self, self.player.currentItem != nil,
                  let event = event as? MPChangePlaybackPositionCommandEvent else { return .noActionableNowPlayingItem }
            self.seek(to: event.positionTime)
            return .success
        }

        // Track buttons would replace the 10-second skip buttons on the lock screen.
        center.nextTrackCommand.isEnabled = false
        center.previousTrackCommand.isEnabled = false
    }

    private func updateNowPlaying() {
        guard let item = player.currentItem else { return }
        var info: [String: Any] = [
            MPMediaItemPropertyTitle: title,
            MPMediaItemPropertyArtist: artist,
            MPNowPlayingInfoPropertyElapsedPlaybackTime: Self.seconds(player.currentTime()),
            MPNowPlayingInfoPropertyPlaybackRate: player.rate,
            MPNowPlayingInfoPropertyDefaultPlaybackRate: rate,
            MPNowPlayingInfoPropertyMediaType: MPNowPlayingInfoMediaType.audio.rawValue
        ]
        if !album.isEmpty { info[MPMediaItemPropertyAlbumTitle] = album }
        let duration = Self.seconds(item.duration)
        if duration > 0 { info[MPMediaItemPropertyPlaybackDuration] = duration }
        if let artwork = Self.artwork {
            info[MPMediaItemPropertyArtwork] = artwork
        }
        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
    }

    // MARK: - Events

    private func stateData() -> [String: Any] {
        var data: [String: Any] = [
            "url": url ?? "",
            "position": Self.seconds(player.currentTime()),
            "rate": rate
        ]
        if let item = player.currentItem {
            data["duration"] = Self.seconds(item.duration)
        }
        return data
    }

    private func emit(_ event: String, url eventURL: String? = nil, extra: [String: Any] = [:]) {
        var data = stateData()
        if let eventURL = eventURL { data["url"] = eventURL }
        for (key, value) in extra { data[key] = value }
        notifyListeners(event, data: data)
    }

    // The same logo the web player showed; Capacitor bundles the web build under public/.
    private static let artwork: MPMediaItemArtwork? = {
        guard let path = Bundle.main.path(forResource: "public/logo512", ofType: "png"),
              let image = UIImage(contentsOfFile: path) else { return nil }
        return MPMediaItemArtwork(boundsSize: image.size) { _ in image }
    }()

    private static func seconds(_ time: CMTime) -> Double {
        let value = CMTimeGetSeconds(time)
        return value.isFinite ? value : 0
    }
}
