import { APP_DOMAIN } from "../../appConstants";

function getStaticPath(folder, file) {
  return APP_DOMAIN + `/static/${folder}/${file}`;
}

export { getStaticPath };
