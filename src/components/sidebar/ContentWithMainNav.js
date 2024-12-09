import * as s from "./ContentWithMainNav.sc";
import MainNav from "./MainNav/MainNav";
import useScreenWidth from "../../hooks/useScreenWidth";

export default function ContentWithMainNav(props) {
  const { children: appContent } = props;
  const { screenWidth } = useScreenWidth();

  return (
    <s.Content className="content">
      <MainNav screenWidth={screenWidth} />
      <s.ContentContainer screenWidth={screenWidth} id="scrollHolder">
        {appContent}
      </s.ContentContainer>
    </s.Content>
  );
}
