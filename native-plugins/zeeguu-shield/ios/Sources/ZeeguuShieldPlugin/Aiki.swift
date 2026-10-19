import Foundation
import Security
import FamilyControls
import ManagedSettings
import DeviceActivity

// Aiki mode's rules and state, shared by the plugin and the two extensions
// (ShieldConfiguration shows the progress, AikiMonitor puts the shield back
// when a break ends). The extensions compile this same file, so it must not
// depend on Capacitor.
//
// Rules: every minute of learning today earns 5 minutes in the paused apps;
// 15 minutes of learning frees them for the rest of the day.

@available(iOS 16.0, *)
public enum Aiki {
    // Shared with the extensions through the keychain rather than an App Group:
    // every team provisioning profile allows the team's keychain groups, so
    // nothing needs registering in the developer portal.
    static let keychainGroup = "E9Y43LYCSK.org.zeeguu.shared"
    public static let minutesEarnedPerMinute = 5
    public static let dailyGoalSeconds = 15 * 60

    static let breakActivity = DeviceActivityName("aiki.break")
    static let dailyActivity = DeviceActivityName("aiki.daily")


    // MARK: - State

    public struct Ledger: Codable {
        public var enabled = false
        public var day = ""
        public var learnedSeconds = 0
        public var minutesConverted = 0
        public var breakUntil: Date?

        public func isToday(_ now: Date) -> Bool { day == Aiki.dayString(now) }
        public func freeToday(_ now: Date) -> Bool { isToday(now) && learnedSeconds >= Aiki.dailyGoalSeconds }
        public func onBreak(_ now: Date) -> Bool { isToday(now) && (breakUntil.map { $0 > now } ?? false) }
        public func learnedToday(_ now: Date) -> Int { isToday(now) ? learnedSeconds : 0 }

        public func shouldShield(_ now: Date) -> Bool {
            enabled && !freeToday(now) && !onBreak(now)
        }

        /// Counts learning time, turning each newly completed minute into a break.
        public mutating func addLearning(seconds: Int, now: Date) {
            if !isToday(now) {
                day = Aiki.dayString(now)
                learnedSeconds = 0
                minutesConverted = 0
                breakUntil = nil
            }
            learnedSeconds += max(0, seconds)
            let newMinutes = learnedSeconds / 60 - minutesConverted
            guard newMinutes > 0 else { return }
            minutesConverted += newMinutes
            let from = max(breakUntil ?? now, now)
            breakUntil = from.addingTimeInterval(TimeInterval(newMinutes * Aiki.minutesEarnedPerMinute * 60))
        }
    }

    public static func loadLedger() -> Ledger {
        guard let data = read("ledger"),
              let ledger = try? JSONDecoder().decode(Ledger.self, from: data) else { return Ledger() }
        return ledger
    }

    public static func saveLedger(_ ledger: Ledger) {
        if let data = try? JSONEncoder().encode(ledger) { write("ledger", data) }
    }

    public static func loadSelection() -> FamilyActivitySelection? {
        guard let data = read("selection") else { return nil }
        return try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)
    }

    public static func saveSelection(_ selection: FamilyActivitySelection) {
        if let data = try? JSONEncoder().encode(selection) { write("selection", data) }
    }

    private static func query(_ key: String) -> [String: Any] {
        [kSecClass as String: kSecClassGenericPassword,
         kSecAttrService as String: "org.zeeguu.aiki",
         kSecAttrAccount as String: key,
         kSecAttrAccessGroup as String: keychainGroup]
    }

    private static func read(_ key: String) -> Data? {
        var q = query(key)
        q[kSecReturnData as String] = true
        var result: AnyObject?
        guard SecItemCopyMatching(q as CFDictionary, &result) == errSecSuccess else { return nil }
        return result as? Data
    }

    // Readable after the first unlock: the monitor runs at midnight, often
    // with the phone locked.
    private static func write(_ key: String, _ data: Data) {
        let attributes: [String: Any] = [kSecValueData as String: data,
                                         kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock]
        if SecItemUpdate(query(key) as CFDictionary, attributes as CFDictionary) == errSecItemNotFound {
            SecItemAdd(query(key).merging(attributes) { $1 } as CFDictionary, nil)
        }
    }

    static func dayString(_ date: Date) -> String {
        let c = Calendar.current.dateComponents([.year, .month, .day], from: date)
        return String(format: "%04d-%02d-%02d", c.year ?? 0, c.month ?? 0, c.day ?? 0)
    }

    // MARK: - Applying it

    /// Makes the shield match the ledger, and schedules the end of a break.
    public static func sync(now: Date = Date()) {
        let ledger = loadLedger()
        let store = ManagedSettingsStore()
        if ledger.shouldShield(now), let selection = loadSelection() {
            store.shield.applications = selection.applicationTokens.isEmpty ? nil : selection.applicationTokens
            store.shield.applicationCategories = selection.categoryTokens.isEmpty
                ? nil : .specific(selection.categoryTokens)
            store.shield.webDomains = selection.webDomainTokens.isEmpty ? nil : selection.webDomainTokens
        } else {
            store.clearAllSettings()
        }

        let center = DeviceActivityCenter()
        center.stopMonitoring([breakActivity])
        if ledger.enabled, ledger.onBreak(now), !ledger.freeToday(now), let end = ledger.breakUntil {
            scheduleBreakEnd(end, center: center)
        }
    }

    /// Wakes AikiMonitor at midnight, when yesterday's breaks and freedom expire.
    public static func setDailyMonitoring(_ on: Bool) {
        let center = DeviceActivityCenter()
        center.stopMonitoring([dailyActivity])
        guard on else {
            center.stopMonitoring([breakActivity])
            return
        }
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: 0, minute: 0, second: 0),
            intervalEnd: DateComponents(hour: 23, minute: 59, second: 59),
            repeats: true)
        try? center.startMonitoring(dailyActivity, during: schedule)
    }

    // DeviceActivity intervals must last at least 15 minutes, so the interval
    // starts in the past: what matters is that it ends when the break does.
    private static func scheduleBreakEnd(_ end: Date, center: DeviceActivityCenter) {
        let start = end.addingTimeInterval(-16 * 60)
        let parts: Set<Calendar.Component> = [.year, .month, .day, .hour, .minute, .second]
        let schedule = DeviceActivitySchedule(
            intervalStart: Calendar.current.dateComponents(parts, from: start),
            intervalEnd: Calendar.current.dateComponents(parts, from: end),
            repeats: false)
        try? center.startMonitoring(breakActivity, during: schedule)
    }
}
