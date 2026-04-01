import styled from "styled-components";

const DynamicFlagImage = styled.img`
  width: ${({ $size }) => $size ?? "1.75rem"};
  height: ${({ $size }) => $size ?? "1.75rem"};
  vertical-align: middle;
  border-radius: 50%;
  object-fit: cover;
  border: 0.08rem solid #ccc;
`;

export { DynamicFlagImage };
