import DeviceActivity
import Foundation

/// iOS wakes this when an Aiki interval starts or ends, even while Zeeguu is
/// not running: at the end of an earned break, and at midnight, when
/// yesterday's breaks and freedom expire. Either way the shield is brought
/// back in line with the ledger (Aiki.swift, shared with the plugin).
class AikiMonitorExtension: DeviceActivityMonitor {
    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        // Only midnight matters. A break's interval starts in the past, so iOS
        // reports its start as soon as sync() schedules it; syncing again here
        // would schedule it again, and wake us again.
        guard activity == Aiki.dailyActivity else { return }
        Aiki.sync()
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        // The end can be reported a moment before breakUntil; a few seconds'
        // slack keeps the shield from staying off until the next wake-up.
        Aiki.sync(now: Date().addingTimeInterval(5))
    }
}
