import styled from "styled-components";

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 2rem;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  /* Full width, as on the subpages: centring would shrink the header to its
     title and put the back arrow on top of it. */
  > ${HeaderWrapper} {
    align-self: stretch;
  }
`;

const Version = styled.div`
  font-size: 0.75rem;
  color: var(--text-faint);
  text-align: center;
  margin-bottom: 2rem;
`;

export const BackArrowWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export { StyledWrapper, Version };
