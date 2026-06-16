import BackArrow from "./BackArrow";
import Header from "../../_pages_shared/Header";
import Heading from "../../_pages_shared/Heading.sc";
import { HeaderWrapper, BackArrowWrapper } from "../Settings.sc";

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
