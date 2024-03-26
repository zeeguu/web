import styled, { css } from "styled-components";

const BaseSectionStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  gap: 1.5rem;
`;

const Header = styled.header`
  ${BaseSectionStyle}
`;

export { Header };
