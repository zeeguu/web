// from https://stackoverflow.com/questions/6072590/how-to-match-an-empty-dictionary-in-javascript
export default function isEmptyDictionary(obj) {
  return Object.keys(obj).length === 0;
}
