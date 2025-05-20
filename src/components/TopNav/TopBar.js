import NavIcon from "../MainNav/NavIcon";
import * as s from "./TopBar.sc";
import {zeeguuOrange} from "../colors";

export default function TopBar() {
  return (
    <s.StatContainer>
      <NavIcon name="words" color={zeeguuOrange} />
      <s.StatNumber>12</s.StatNumber>
      <NavIcon name="headerArticles" color= {zeeguuOrange}/>
      <s.StatNumber>5</s.StatNumber>
      <NavIcon name="headerStreak" color={zeeguuOrange} />
      <s.StatNumber>10</s.StatNumber>
    </s.StatContainer>
  );
}
