import { toast, Slide } from "react-toastify";
import strings from "../../i18n/definitions";
import {ArticleActionUndoButton} from "../../extension/src/InjectedReaderApp/Buttons.styles";

let activeToastId = null;

export function showSingleActionToast(message, onClickUndo, duration = 3000, className) {
    const content = (
        <span>
            {message}
            {onClickUndo && (
                <ArticleActionUndoButton
                    onClick={() => {
                        onClickUndo?.();
                        if (activeToastId) toast.dismiss(activeToastId);
                        activeToastId = null;
                    }}
                >
                    {strings.articleActionUndo}
                </ArticleActionUndoButton>
            )}
        </span>
    );

    // Dismiss old toast first
    if (activeToastId && toast.isActive(activeToastId)) {
        toast.dismiss(activeToastId);
    }

    // Show new toast with a tiny delay so it can properly mount
    setTimeout(() => {
        activeToastId = toast(content, {
            autoClose: duration,
            className,
            transition: Slide,
        });
    }, 20);

    return activeToastId;
}
