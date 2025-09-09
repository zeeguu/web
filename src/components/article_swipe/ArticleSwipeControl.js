import React from "react";
import { Bar, DismissButton, OpenButton, SaveButton, ButtonInner } from "./ArticleSwipeControl.sc.js";
import { white, darkGrey, orange600 } from "../colors";
import SwipeIcon from "./SwipeIcon.js";

export default function ArticleSwipeControl({
    onDismiss = () => {}, 
    onOpen = () => {}, 
    onSave = () => {}
}) {
    return (
        <Bar>
            <DismissButton onClick={onDismiss} aria-label="Dimiss">
                <ButtonInner>
                    <SwipeIcon name="dismiss" color={darkGrey} size={22} />
                </ButtonInner>
            </DismissButton>

            <OpenButton onClick={onOpen} aria-label="Open Article">
                <ButtonInner>
                    <SwipeIcon name="open" color={white} size={32} />
                </ButtonInner>
            </OpenButton>

            <SaveButton onClick={onSave} aria-label="Save Article">
                <ButtonInner>
                    <SwipeIcon name="save" color={orange600} size={22} />
                </ButtonInner>
            </SaveButton>
        </Bar>        
    )
}