import ManagedSettings
import ManagedSettingsUI
import UIKit

/// The screen iOS shows instead of an app the learner paused with Aiki mode.
///
/// Apple only lets us set its text, colours, icon and button labels. The
/// button cannot open Zeeguu (there is no supported API for that), so the
/// text has to say what to do; without a Shield Action extension the button
/// just closes the shield.
class ShieldConfigurationExtension: ShieldConfigurationDataSource {
    override func configuration(shielding application: Application) -> ShieldConfiguration {
        return shield(for: application.localizedDisplayName)
    }

    override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration {
        return shield(for: application.localizedDisplayName)
    }

    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        return shield(for: webDomain.domain)
    }

    override func configuration(shielding webDomain: WebDomain, in category: ActivityCategory) -> ShieldConfiguration {
        return shield(for: webDomain.domain)
    }

    // The rules and today's progress, from the ledger the app keeps (Aiki.swift).
    private static func deal() -> String {
        let learned = Aiki.loadLedger().learnedToday(Date()) / 60
        let goal = Aiki.dailyGoalSeconds / 60
        return "Each minute you learn in Zeeguu unlocks \(Aiki.minutesEarnedPerMinute) minutes here. "
            + "Learn \(goal) minutes today and it's free for the rest of the day.\n\n"
            + progressBar(learned, of: goal) + "\nToday: \(learned) of \(goal) minutes."
    }

    // The shield only takes text, so the bar is drawn with characters: one
    // block per minute.
    private static func progressBar(_ done: Int, of total: Int) -> String {
        let filled = min(max(done, 0), total)
        return String(repeating: "▰", count: filled) + String(repeating: "▱", count: total - filled)
    }

    private func shield(for name: String?) -> ShieldConfiguration {
        let zeeguuOrange = UIColor(red: 1.0, green: 0xbb / 255.0, blue: 0x54 / 255.0, alpha: 1)
        return ShieldConfiguration(
            backgroundBlurStyle: .systemMaterial,
            icon: UIImage(named: "ZeeguuShieldIcon"),
            title: ShieldConfiguration.Label(text: "\(name ?? "This app") is paused", color: .label),
            subtitle: ShieldConfiguration.Label(text: Self.deal(), color: .secondaryLabel),
            primaryButtonLabel: ShieldConfiguration.Label(text: "OK", color: .black),
            primaryButtonBackgroundColor: zeeguuOrange
        )
    }
}
