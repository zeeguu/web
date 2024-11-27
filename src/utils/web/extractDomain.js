export default function extractDomain(url) {
  let parsedDomain = url.replace("http://", "https://");
  parsedDomain = url.replace("https://", "");
  parsedDomain = parsedDomain.split("/")[0];
  parsedDomain = parsedDomain.replace("www.", "");
  return parsedDomain;
}
