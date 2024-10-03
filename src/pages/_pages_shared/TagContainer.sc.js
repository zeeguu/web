import styled from "styled-components";

const TagContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

export default TagContainer;
