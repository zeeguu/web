export const wyborczaRegex = /(http|https):\/\/(wyborcza.pl).*/;

export function cleanWyborcza(readabilityContent) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = readabilityContent;

  const signUpBanner = newDiv.querySelectorAll("[id^=mcBan]")
  for (let index = 0; index < signUpBanner.length; index++) {
      signUpBanner[index].remove()
  }

  return newDiv.innerHTML;
}
