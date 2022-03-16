export function liveArticleLemonde(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    const isLive = div.querySelector(".live__hero")
    if (isLive !== null) {
        return false
    } else {
        return true
    }
}