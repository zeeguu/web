import React from "react";
import styled from "styled-components";
import { veryLightGrey, whiteSemiTransparent } from "../components/colors";
import {SummaryButtonContainer} from "./ArticlePreviewSwipe.sc";
import Button from "../pages/_pages_shared/Button.sc";
import strings from "../i18n/definitions";

const Overlay = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: 16px;
    height: 100%;
    min-height: 0;
    overflow-y: auto; /* vertical scroll if content overflows */
    font-size: 18px;
    font-weight: 450;
    background-color: ${whiteSemiTransparent};
    z-index: 10;
    border: 2px solid ${veryLightGrey}; 
    border-radius: inherit;
    box-sizing: border-box;            
`;

export default function SwipeSummaryOverlay({ titleComponent, summary, onClose }) {
    return (
        <Overlay>
            {titleComponent}
            <div>{summary}</div>
            <SummaryButtonContainer>
                <Button
                    className={"hide-summary-btn"}
                    onClick={onClose}
                >
                    {strings.hideSummary}
                </Button>
            </SummaryButtonContainer>
        </Overlay>
    );
}
