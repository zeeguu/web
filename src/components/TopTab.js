import { NavLink } from "react-router-dom";
import { zeeguuSecondOrange } from "./colors";

function TopTab({ id, text, link, addSeparator }) {
  return (
    <div className="row__tab">
      <NavLink
        id={id}
        className="headmenuTab"
        to={link}
        exact
        activeStyle={{
          fontWeight: 500,
          color: zeeguuSecondOrange,
          borderBottom: `1px solid ${zeeguuSecondOrange}`,
          paddingBottom: "5px",
        }}
      >
        {text}
      </NavLink>
    </div>
  );
}

export { TopTab };
