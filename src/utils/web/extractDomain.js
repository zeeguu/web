export default function extractDomain(url) {
  if (!url) return "";
  let parsedDomain = url.replace("http://", "https://");
  parsedDomain = url.replace("https://", "");
  parsedDomain = parsedDomain.split("/")[0];
  parsedDomain = parsedDomain.replace("www.", "");
  return parsedDomain;
}
