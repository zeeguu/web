export function liveArticleLefiagro(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    const isLive = div.querySelector(".live-list")
    if (isLive !== null) {
        return false
    } else {
        return true
    }
}