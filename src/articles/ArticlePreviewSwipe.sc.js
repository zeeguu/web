import styled from "styled-components";
import { white, almostBlack, zeeguuDarkOrange } from "../components/colors";
import { motion } from "framer-motion";
import { PublishingTime, SourceContainer } from "../components/ArticleSourceInfo.sc";

let labelFontSize = 'small';

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
      
    position: relative;
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
      .link{
          cursor: pointer;
      }
`;

export const InfoWrapper = styled.div`
    position: relative;
    justify-content: center;
    display: flex;
    grid-auto-flow: column;
    gap: 8px;
    
    @media (max-width: 768px) {
        flex-wrap: wrap;       
        justify-content: flex-start; 
        gap: 4px;                  
    }
`;

export const InfoItem = styled.div`
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 6px;
    
    background: white;
    padding: 6px 10px;
    border-radius: 10px;
    font-size: ${labelFontSize};
    color: ${almostBlack};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);

    img {
      width: 14px;
      height: 14px;
      object-fit: contain;
    }
    span {
      white-space: nowrap; 
    }
`;

export const SourceContainerSwipe = styled(SourceContainer)`
    margin: 0 0 0 0;
`;

export const PublishingTimeSwipe = styled(PublishingTime)`
    font-size: ${labelFontSize};
`;

export const Content = styled.div`
    padding: 16px 16px 24px;
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

export const SummaryButtonContainer = styled.div`
    display: flex;           
    justify-content: center; 
    width: 100%;
    margin-top: auto;
`;