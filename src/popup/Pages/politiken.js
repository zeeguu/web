export function paywallPolitiken(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    const paywall = div.querySelector(".stopsign__content")
    if (paywall !== null) {
        return false
    } else {
        return true
    }
}