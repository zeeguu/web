import ManagedSettings
import UserNotifications

/// Runs when the learner presses "Learn in Zeeguu" on the shield
/// (ShieldConfiguration). A shield cannot open another app, so this leaves a
/// note for Zeeguu to open on /aiki and posts a notification that opens it.
class ShieldActionExtension: ShieldActionDelegate {
    override func handle(action: ShieldAction, for application: ApplicationToken,
                         completionHandler: @escaping (ShieldActionResponse) -> Void) {
        respond(to: action, completionHandler)
    }

    override func handle(action: ShieldAction, for webDomain: WebDomainToken,
                         completionHandler: @escaping (ShieldActionResponse) -> Void) {
        respond(to: action, completionHandler)
    }

    override func handle(action: ShieldAction, for category: ActivityCategoryToken,
                         completionHandler: @escaping (ShieldActionResponse) -> Void) {
        respond(to: action, completionHandler)
    }

    private func respond(to action: ShieldAction, _ completionHandler: @escaping (ShieldActionResponse) -> Void) {
        guard action == .primaryButtonPressed else { return completionHandler(.close) }
        Aiki.requestOpenAiki()

        let content = UNMutableNotificationContent()
        content.title = "Earn your minutes"
        content.body = "Tap to learn in Zeeguu."
        // No trigger: delivered right away. Close the shield once it is queued,
        // since the extension may stop as soon as it answers.
        let request = UNNotificationRequest(identifier: "aiki.learn", content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request) { _ in completionHandler(.close) }
    }
}
