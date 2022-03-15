export function liveArticleLefiagro(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    if (div.classList.contains("live-list") === true) {
        return false
    } else {
        return true
    }
}