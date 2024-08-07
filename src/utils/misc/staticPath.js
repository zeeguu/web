import { APP_URL } from "../../appConstants";

function getStaticPath(folder, file) {
  return APP_URL + `/static/${folder}/${file}`;
}

function getNewsIconPath(iconName) {
  return APP_URL + `/news-icons/${iconName}`;
}

export { getStaticPath, getNewsIconPath };
