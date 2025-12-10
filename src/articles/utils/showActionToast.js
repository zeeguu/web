import { toast, Slide } from "react-toastify";

let activeToastId = null;

export function showSingleActionToast(message, onClickUndo, duration = 3000, className) {
    const content = (
        <span>
            {message}
            {onClickUndo && (
                <button
                    onClick={() => {
                        onClickUndo?.();
                        if (activeToastId) toast.dismiss(activeToastId);
                        activeToastId = null;
                    }}
                    style={{
                        cursor: "pointer",
                        marginLeft: "6px",
                        fontStyle: "italic",
                        color: "inherit",
                        textDecoration: "underline",
                        background: "inherit",
                        border: "1px solid transparent",
                        padding: 0,
                    }}
                >
                    Undo?
                </button>
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
