import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
`;

const CustomizeFeedButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #fff;
  transition: all 0.2s ease;
  font-size: 0.9em;

  @media (max-width: 768px) {
    padding: 0.2rem 0.2rem;
    gap: 0.1rem;
  }

  &:hover {
    background-color: #f5f5f5;
  }

  &.active {
    background-color: #f5f5f5;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.25rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
  font-size: 0.9em;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 0.85em;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Separator = styled.div`
  height: 2px;
  background-color: #ddd;
  margin: 0;
`;

export { DropdownContainer, CustomizeFeedButton, DropdownMenu, DropdownItem, Separator };
