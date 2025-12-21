import styled from "styled-components";
import { zeeguuWarmYellow, blue600 } from "../components/colors";

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

// Used by VideoSourceInfo for channel thumbnails
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

let SimplifiedLabel = styled.span`
  font-size: 0.75em;
  color: ${blue600};
  background-color: #e3f2fd;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 0.3em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export { SourceContainer, SourceImage, PublishingTime, FeedName, SimplifiedLabel };
