import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

export default function SwipeIcon({ name, color, size }) {
    const iconProps = {
        sx: {
            ...(color && { color }),
            ...(size && { fontSize: size }),
        },
    };

    const swipeIcons = {
        dismiss: <CloseRoundedIcon {...iconProps} />,
        open: <MenuBookRoundedIcon {...iconProps} />,
        save: <FavoriteBorderRoundedIcon {...iconProps} />,
    };

    return swipeIcons[name] || null;
}