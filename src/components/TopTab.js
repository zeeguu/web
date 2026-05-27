import { NavLink } from "react-router-dom";
import NotificationIcon from "./NotificationIcon";

function TopTab({
  id,
  text,
  link,
  isActive,
  hasNotification,
  notificationText,
  action,
  onClick,
  isDropdown,
}) {
  if (isDropdown) {
    return (
      <>
        <button
          id={id}
          className={isActive ? "headmenuTab icon-active" : "headmenuTab icon-inactive"}
          onClick={onClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            font: "inherit",
            color: "inherit",
          }}
        >
          {text}
          {hasNotification && <NotificationIcon text={notificationText} />}
        </button>
        {action}
      </>
    );
  }

  return (
    <>
      <NavLink
        id={id}
        className={(isActive) => (isActive ? "headmenuTab icon-active" : "headmenuTab icon-inactive")}
        to={link}
        exact
        isActive={isActive}
      >
        {text}
        {hasNotification && <NotificationIcon text={notificationText} />}
      </NavLink>
      {action}
    </>
  );
}

export { TopTab };
