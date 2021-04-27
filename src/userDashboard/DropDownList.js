import * as s from "./UserDashboard.sc";

function DropDownList({ children, handleChange, stateValue, isCustom }) {
  return (
    <s.UserDashBoardDropdown
      value={stateValue}
      onChange={(e) => handleChange(e.target.value)}
      isCustom={isCustom}
    >
      {children}
    </s.UserDashBoardDropdown>
  );
}

const DropDownOption = ({ title }) => {
  return <option value={title}>{title}</option>;
};

export { DropDownList, DropDownOption };
