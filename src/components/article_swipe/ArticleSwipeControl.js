import React from "react";
import { Bar, DismissButton, OpenButton, SaveButton, ButtonInner } from "./ArticleSwipeControl.sc.js";
import { white, darkGrey, orange600 } from "../colors";
import SwipeIcon from "./SwipeIcon.js";

export default function ArticleSwipeControl({ onDismiss = () => {}, onOpen = () => {}, onSave = () => {}, children, isSaved = false }) {
    return (
        <Bar>
            <DismissButton onClick={onDismiss} aria-label="Dismiss">
                <ButtonInner>
                    <SwipeIcon name="dismiss" color={darkGrey} size={22} />
                </ButtonInner>
            </DismissButton>

            <OpenButton onClick={onOpen} aria-label="Open Article">
                <ButtonInner>
                    <SwipeIcon name="open" color={white} size={26} />
                </ButtonInner>
            </OpenButton>

            {children ? (
                <SaveButton as="div" aria-label="Save Article">
                    <ButtonInner>{children}</ButtonInner>
                </SaveButton>
            ) : (
                <SaveButton onClick={onSave} aria-label="Save Article" className={isSaved ? "saved" : ""}>
                    <ButtonInner>
                        {/* <SwipeIcon name="save" color={orange600} size={22} /> */}
                        <SwipeIcon className="heart-outline" name="save" color={orange600} size={22} />
                        <SwipeIcon className="heart-filled" name="saveFilled" color={orange600} size={22} />
                    </ButtonInner>
                </SaveButton>
            )}
        </Bar>        
    )
}
