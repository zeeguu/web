import styled from "styled-components";

const ListItem = styled.div`
  padding: 3px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background-color: rgba(255, 145, 44, 0.2);;
  }
`;

const DropdownContainer = styled.div`
  margin-top: 17px;
`

const DropdownLabel = styled.label`
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.02em;
  color: #414141;
`

const Dropdown = styled.div`
  margin-top: 12px;
  position: relative;
`

const DropdownField = styled.div`
  height: 40px;
  position: relative;
  border: 1px solid #DDDDDD;
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  user-select: none;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  color: #616161;
`

const DropdownIcon = styled.img`
  transition: 300ms;
  position: absolute;
  right: 16px;
`

const DropdownList = styled.div`
  width: 100%;
  position: absolute;
  z-index: 2;
  top: 45px;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  filter: drop-shadow(1px 2px 5px rgba(0, 0, 0, 0.25));
  padding: 5px 0;
`

const ListText = styled.span`
  margin-left: 8px
`

export {
  ListItem,
  DropdownContainer,
  DropdownLabel,
  Dropdown,
  DropdownField,
  DropdownIcon,
  DropdownList,
  ListText,
}