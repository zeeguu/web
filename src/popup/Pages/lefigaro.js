export function readableLefigaro(HTMLContent) {
    const div = document.createElement("div");
    div.innerHTML = HTMLContent;
    //Check if it is behind paywall
    const paywall = div.getElementsByClassName("fig-premium-paywall__wrapper");
    if (paywall.length > 0) {
      return false;
    }
    else{
        return true;
    }
  }
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
