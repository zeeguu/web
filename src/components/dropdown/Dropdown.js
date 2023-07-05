import { useState } from "react";

import * as s from "./Dropdown.sc";
import * as sc from "../Theme.sc";

export const Dropdown = ({
  title,
  placeholder,
  value,
  items,
  onChange,
  errorText,
}) => {
  const [isListOpen, setIsListOpen] = useState(false);

  const handleItemClick = (item) => {
    setIsListOpen(!isListOpen);
    onChange(item);
  };

  return (
    <s.DropdownContainer>
      <sc.LabelWithError>
        <s.DropdownLabel>{title}</s.DropdownLabel>
        {errorText && <h5>{errorText}</h5>}
      </sc.LabelWithError>

      <s.Dropdown>
        <s.DropdownField onClick={() => setIsListOpen(!isListOpen)}>
          {!value && placeholder && <span>{placeholder}</span>}
          {value && <span>{value}</span>}
          <s.DropdownIcon
            style={{ rotate: isListOpen ? "180deg" : "0deg" }}
            src="/static/icons/dropdown-arrow.svg"
            alt="dropdown-arrow"
          />
        </s.DropdownField>

        {isListOpen && (
          <s.DropdownList>
            {items?.map((item, id) => (
              <s.ListItem key={id} onClick={() => handleItemClick(item)}>
                {item.icon && item.icon}
                <s.ListText>{item.name}</s.ListText>
              </s.ListItem>
            ))}
          </s.DropdownList>
        )}
      </s.Dropdown>
    </s.DropdownContainer>
  );
};
