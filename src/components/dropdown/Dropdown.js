import { useEffect, useRef, useState } from "react";

import * as s from "./Dropdown.sc";
import * as sc from "../Theme.sc";

export const Dropdown = ({
  title,
  placeholder,
  value,
  items,
  onChange,
  errorText,
  isDisabled = false,
}) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const refDropdown = useRef(null);
  const refDropdownInput = useRef(null);

  const handleItemClick = (item) => {
    setIsListOpen(!isListOpen);
    onChange(item);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        refDropdownInput?.current &&
        refDropdownInput?.current.contains(event.target)
      ) {
        return;
      }

      if (
        refDropdown?.current &&
        !refDropdown?.current.contains(event.target)
      ) {
        setIsListOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refDropdown]);
  return (
    <s.DropdownContainer>
      <sc.LabelWithError>
        <s.DropdownLabel>{title}</s.DropdownLabel>
        {errorText && <h5>{errorText}</h5>}
      </sc.LabelWithError>

      <s.Dropdown>
        <s.DropdownField
          ref={refDropdownInput}
          disabled={isDisabled}
          onClick={!isDisabled && (() => setIsListOpen(!isListOpen))}
        >
          {!value && placeholder && <span>{placeholder}</span>}
          {value && <span>{value}</span>}
          <s.DropdownIcon
            style={{ rotate: isListOpen ? "180deg" : "0deg" }}
            src="/static/icons/dropdown-arrow.svg"
            alt="dropdown-arrow"
          />
        </s.DropdownField>

        {!isDisabled && isListOpen && (
          <s.DropdownList ref={refDropdown}>
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
