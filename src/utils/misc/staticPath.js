import { APP_DOMAIN } from "../../appConstants";

function getStaticPath(folder, file) {
  return APP_DOMAIN + `/static/${folder}/${file}`;
}

function getNewsIconPath(iconName) {
  return APP_DOMAIN + `/news-icons/${iconName}`;
}

export { getStaticPath, getNewsIconPath };
