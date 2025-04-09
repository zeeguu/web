import * as s from "./TopNav.sc";
// More info on why we use <ul> and <li> inside <nav> is available here:
// https://www.w3.org/WAI/tutorials/menus/structure/#identify-menus
// https://www.w3.org/WAI/tutorials/menus/structure/#menu-representation

export default function TopNav({ children }) {
  return (
    <s.TopNavWrapper>
      <s.TopNav>
        <s.NavList>{children}</s.NavList>
      </s.TopNav>
    </s.TopNavWrapper>
  );
}
