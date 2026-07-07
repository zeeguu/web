import BackArrow from "./BackArrow.js";
import Header from "../../_pages_shared/Header.js";
import PageTitle from "../../_pages_shared/PageTitle.sc.js";
import { HeaderWrapper, BackArrowWrapper } from "../Pages/Settings.sc.js";

export default function SettingsPageHeader({ title, redirectLink, func, children }) {
  return (
    <HeaderWrapper>
      <BackArrowWrapper>
        <BackArrow redirectLink={redirectLink} func={func} />
      </BackArrowWrapper>
      <Header withoutLogo>
        <PageTitle>{title}</PageTitle>
        {children}
      </Header>
    </HeaderWrapper>
  );
}
