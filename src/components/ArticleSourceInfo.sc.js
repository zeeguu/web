import styled from "styled-components";
import { zeeguuWarmYellow } from "../components/colors";

const SourceContainer = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  margin: 0.3em 0px;
  @media (max-width: 990px) {
    width: 100%;
  }
`;

let FeedName = styled.span`
  font-size: small;
  font-style: oblique;
  margin-right: 0.5em;
`;

let SourceImage = styled.span`
  img {
    background-color: ${zeeguuWarmYellow};
    height: 1.5em;
    width: 1.5em;
    border-radius: 0.25em;
  }
  margin-right: 0.2em;
`;

let PublishingTime = styled.span`
  font-size: small;
`;

export { SourceContainer, SourceImage, PublishingTime, FeedName };
