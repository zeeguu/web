import styled from "styled-components";
import { white, almostBlack } from "../components/colors";
import { motion } from "framer-motion";
import { MOBILE_WIDTH } from "../components/MainNav/screenSize";

let labelFontSize = "small";

export const CardContainer = styled(motion.div)`
    width: 500px;
    max-width: 95vw;
    height: 75vh;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: ${white};
    border-radius: 24px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    cursor: grab;
    touch-action: pan-y;
    user-select: none;

    &:active {
        cursor: grabbing;
    }
    
    & {
        position: relative;
    }

    @media (max-width: ${MOBILE_WIDTH}px) {
        height: 62vh;
    }
`;

export const ImageWrapper = styled.div`
    width: 100%;
    flex: 1 1 auto; /* grow or shrink to fill remaining space */
    min-height: 0;
    max-height: 60%;
    height: auto;
    aspect-ratio: 12 / 9;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .link {
        cursor: pointer;
    }
`;

export const Content = styled(motion.div)`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    padding: 16px 20px 16px;
    position: relative;

    @media (max-width: ${MOBILE_WIDTH}px) {
        padding: 10px 16px 16px;
    }
`;

export const Title = styled.h2`
    font-size: 20px;
    font-weight: bold;
    color: ${almostBlack};
    margin: 0 0 10px 0;
    line-height: 1.2;
    word-wrap: break-word;
`;


export const Summary = styled.div`
    font-size: 16px;
    line-height: 1.5;
    color: ${almostBlack};
    margin-bottom: 16px;
`;

export const SummaryButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    padding-top: 12px;
    margin-top: auto;
`;

export const InfoWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: auto;
    margin-bottom: 8px;
        
    @media (max-width: ${MOBILE_WIDTH}px) {
        justify-content: flex-start;
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
