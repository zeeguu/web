import styled from "styled-components";

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  align-items: center;
  margin: 1em 0;
  a {
    font-weight: 600;
  }
  a:hover {
    text-decoration: underline;
  }
  @media (max-width: 576px) {
    margin: 0.8em 0;
  }
`;

export default Footer;
