import styled from "styled-components";
import { white, almostBlack, zeeguuDarkOrange } from "../components/colors";
import {motion} from "framer-motion";

export const CardContainer = styled(motion.div)`
  width: 500px;
  max-width: 95vw;
  height: 600px;
  max-height: 100%;
  min-height: 0;
  background: ${white};
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
    
  position: static;
  top: auto;
  left: auto;
  transform: none;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  flex: 0 0 250px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ReadTimeWrapper = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  color: ${almostBlack};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
`;

export const Content = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: ${almostBlack};
  // color: ${zeeguuDarkOrange};
  margin: 0 0 16px 0;
`;

export const Summary = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: ${almostBlack};
  flex-grow: 1;
  min-height: 0;
  overflow: auto;
`;
