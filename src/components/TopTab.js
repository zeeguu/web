import { NavLink } from "react-router-dom";
import NotificationIcon from "./NotificationIcon";

function TopTab({
  id,
  text,
  link,
  isActive,
  addSeparator,
  hasNotification,
  notificationText,
}) {
  return (
    <>
      <div className="row__tab">
        <NavLink
          id={id}
          className={"headmenuTab"}
          to={link}
          exact
          activeStyle={{ fontWeight: 600 }}
        >
          {text}
          {hasNotification && <NotificationIcon text={notificationText} />}
        </NavLink>
      </div>
      {addSeparator && SeparatorBar()}
    </>
  );
}

function SeparatorBar() {
  return (
    <div className="row__bar">
      <div className="bar"></div>
    </div>
  );
}

export { TopTab, SeparatorBar };