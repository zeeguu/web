import BackArrow from "./BackArrow.js";
import Header from "../../_pages_shared/Header.js";
import Heading from "../../_pages_shared/Heading.sc.js";
import { HeaderWrapper, BackArrowWrapper } from "../Pages/Settings.sc.js";

export default function SettingsPageHeader({ title, redirectLink, func, children }) {
  return (
    <HeaderWrapper>
      <BackArrowWrapper>
        <BackArrow redirectLink={redirectLink} func={func} />
      </BackArrowWrapper>
      <Header withoutLogo>
        <Heading>{title}</Heading>
        {children}
      </Header>
    </HeaderWrapper>
  );
}
