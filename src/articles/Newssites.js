
export default function Newssites({ learnedLanguage }) {
  if (learnedLanguage === "pl")
    return (
      <>
        <a href="https://www.asahi.com/" rel="noopener">
          <p>asahi.com</p>
        </a>
        <a href="https://www.nikkansports.com/" rel="noopener">
          <p>nikkansports.com</p>
        </a>
        <a href="https://www.nikkei.com/" rel="noopener">
          <p>nikkei.com</p>
        </a>
        <a href="https://www.yomiuri.co.jp/" rel="noopener">
          <p>yomiuri.co.jp/</p>
        </a>
      </>
    );
    if (learnedLanguage === "ja")
  return (
    <>
      <a href="https://www.asahi.com/" rel="noopener">
        <p>asahi.com</p>
      </a>
      <a href="https://www.nikkansports.com/" rel="noopener">
        <p>nikkansports.com</p>
      </a>
      <a href="https://www.nikkei.com/" rel="noopener">
        <p>nikkei.com</p>
      </a>
      <a href="https://www.yomiuri.co.jp/" rel="noopener">
        <p>yomiuri.co.jp/</p>
      </a>
    </>
  );
}