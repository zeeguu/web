export default function TruncatedSummary({ text, maxLength = 297 }) {
  if (!text) return null;
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}...`;
}