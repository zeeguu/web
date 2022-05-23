export const corriereRegex = /(http|https):\/\/(www.corriere.it).*/;


export function removeScripts(){
        const iframe = document.querySelectorAll("iframe");
        if (iframe) {
          for (let i = 0; i < iframe.length; i++) {
            iframe[i].remove();
          }
        }
        const script = document.querySelectorAll("script");
        if (script) {
          for (let i = 0; i < script.length; i++) {
            script[i].remove();
          }
        }
        const banner = document.getElementsByClassName("tp-modal")[0];
        if (banner) {
          banner.remove();
        }
}
