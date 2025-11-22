import React from "react";
import { Bar, DismissButton, OpenButton, SaveButton, ButtonInner } from "./ArticleSwipeControl.sc.js";
import { white } from "../colors";
import SwipeIcon from "./SwipeIcon.js";

export default function ArticleSwipeControl({ onDismiss = () => {}, onOpen = () => {}, onSave = () => {}, children, isSaved = false }) {
    return (
        <Bar>
            <DismissButton onClick={onDismiss} aria-label="Dismiss">
                <ButtonInner>
                    <SwipeIcon name="dismiss" color={white} size={30} />
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
                        <SwipeIcon className="heart-outline" name="save" color={white} size={26} />
                        <SwipeIcon className="heart-filled" name="saveFilled" color={white} size={26} />
                    </ButtonInner>
                </SaveButton>
            )}
        </Bar>        
    )
}
