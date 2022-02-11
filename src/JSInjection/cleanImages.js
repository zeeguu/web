export function cleanImages(content) {
    const div = document.createElement("div");
    div.innerHTML = content;
    const firstImage = div.getElementsByTagName("img")[0];
    if (firstImage !== undefined) {
      firstImage.setAttribute("id", "zeeguuImage");
      let images = div.getElementsByTagName("img"),
        index;
      for (index = images.length - 1; index >= 0; index--) {
        if (index !== 0) {
          images[index].parentNode.removeChild(images[index]);
        }
      }
      content = div.innerHTML;
    }
    return content;
  }