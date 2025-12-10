import styled from "styled-components";
import {
  almostBlack,
  lightGrey,
  veryLightGrey,
  blue600,
  blue700,
  blue800,
  zeeguuDarkOrange,
  zeeguuOrange,
  zeeguuRed,
  orange600,
  orange500,
  orange800,
} from "../../components/colors";

const Button = styled.button`
  cursor: pointer;
  color: white;
  border: none;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.2rem;
  padding: 1rem 2.8rem;
  border-radius: 4em;
  font-weight: 600;
  background-color: ${orange500};
  box-shadow: 0px 0.2rem ${orange800};
  transition: all 300ms ease-in-out;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 0.2em;

  &:hover {
    background-color: ${orange600};
  }

  &.small {
    padding: 0 2rem;
    font-size: 1rem;
    height: 2.75rem;
  }

  &.left-aligned {
    justify-content: flex-start;
    padding: 0 1.5rem 0 0.5rem;
    gap: 0.5rem;
  }

  &.warning {
    background-color: red;
    box-shadow: 0 0.2em ${zeeguuRed};
  }

  &.grey {
    color: ${almostBlack};
    font-weight: 700;
    background-color: transparent;
    border: solid 0.1rem ${lightGrey};
    box-shadow: 0 0.1rem ${lightGrey};

    &:hover {
      background-color: ${veryLightGrey};
    }
  }

  &:active {
    box-shadow: none;
    transform: translateY(0.2em);
    transition: all ease-in 0.08s;
  }

  //span the full width of a parent
  &.full-width-btn {
    padding: 1rem;
    width: 100%;

    @media (max-width: 768px) {
      width: 100%;
      padding: 1rem 0.5rem;
      text-overflow: ellipsis;
      overflow-y: hidden;
    }
  }

  &.small-square-btn {
    border-radius: 0.3rem;
    padding: 1rem;
    border: none;
  }

  &.small-border-btn {
    font-size: 1rem;
    padding: 0.4rem 1.4rem;
  }

  &.blue-btn {
    background-color: ${blue700};
    box-shadow: 0px 0.2rem ${blue800};
  }

  &.blue-outline-btn {
    color: ${blue600};
    background-color: white;
    border: solid ${blue600} 0.2em;
    box-shadow: 0px 0.2em ${blue700};
  }

  &.white-btn {
    color: ${zeeguuOrange};
    background-color: white;
    border: solid ${zeeguuOrange} 0.2em;
    box-shadow: 0px 0.2em ${zeeguuDarkOrange};
  }
    &.show-summary-btn,
    &.hide-summary-btn {
        padding: 0 1rem;
        font-size: 0.8rem;
        height: 2.1rem;
        width: auto;
        color: ${zeeguuOrange};
        background-color: white;
        border: solid ${zeeguuOrange} 0.1em;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
    }
    
    &.hide-summary-btn {
        margin-top: auto; 
    }

`;
export default Button;
