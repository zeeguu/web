export const rzeczRegex = /(http|https):\/\/(www.rp.pl).*/;
//removes all images
function removeImages(readabilityContent) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = readabilityContent;

  const images = newDiv.querySelectorAll("img")
  for (let i = 0; i < images.length; i++) {
      console.log(images[i])
      images[i].remove()
  }

  return newDiv.innerHTML;
}

function removePromo(readabilityContent) {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = readabilityContent;
    const promotion = newDiv.querySelectorAll(".content");
    for (let i = 0; i < promotion.length; i++) {
        promotion[i].remove()
        
    }
    return newDiv.innerHTML
}

export function cleanRzecz(readabilityContent) {
    let cleaned = removeImages(readabilityContent);
    return removePromo(cleaned)
}