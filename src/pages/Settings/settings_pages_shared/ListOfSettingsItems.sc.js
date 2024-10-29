import styled from "styled-components";

const SettingsSection = styled.section`
  max-width: 37rem;
  width: 100%;

  h2 {
    color: grey;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
  }
`;

const ListOfSettingsItems = styled.ul`
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  & li:first-child {
    border-radius: 6px 6px 0 0;
  }

  & li:last-child {
    border-radius: 0 0 6px 6px;
    margin-bottom: 2rem;
  }

  & li:not(:first-child) {
    margin-top: -2px;
  }

  & li:only-child {
    border-radius: 6px;
  }
`;

export { ListOfSettingsItems, SettingsSection };
