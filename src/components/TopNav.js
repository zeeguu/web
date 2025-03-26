import * as s from "./TopNav.sc";

export default function TopNav({ children }) {
  return (
    <s.TopNavWrapper>
      <s.TopNav>
        <s.NavList>{children}</s.NavList>
      </s.TopNav>
    </s.TopNavWrapper>
  );
}
