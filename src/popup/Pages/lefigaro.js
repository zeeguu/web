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

//TODO: Fix. stopped working
export function liveArticleLefiagro(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    const isLive = div.getElementsByClassName(".live-list")
    if (isLive.length > 0) {
        return false
    } else {
        return true
    }
}
