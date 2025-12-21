import { NavLink } from "react-router-dom";
import NotificationIcon from "./NotificationIcon";

function TopTab({ id, text, link, isActive, addSeparator, hasNotification, notificationText, counter, action }) {
  return (
    <>
      <div className="row__tab">
        <NavLink id={id} className={"headmenuTab"} to={link} exact activeStyle={{ fontWeight: 600 }}>
          {text}
          {counter !== undefined && counter > 0 && (
            <span style={{ color: "#999", fontWeight: 400, fontSize: "small" }}> ({counter})</span>
          )}
          {hasNotification && <NotificationIcon text={notificationText} />}
        </NavLink>
        {action}
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
