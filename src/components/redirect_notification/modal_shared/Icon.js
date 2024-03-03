import * as s from "../RedirectionNotificationModal.sc";

export default function IconHeader({ src }) {
  return (
    <s.IconHeader className="fullDivWidthImage" src={src} alt=""></s.IconHeader>
  );
}

export function IconBody({ src }) {
  return (
    <s.Icon>
      <img className="fullDivWidthImage" alt="" src={src}></img>
    </s.Icon>
  );
}
