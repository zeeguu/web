import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

export default function SwipeIcon({ name, color, size, className }) {
    const iconProps = {
        className,
        sx: {
            ...(color && { color }),
            ...(size && { fontSize: size }),
        },
    };

    const swipeIcons = {
        dismiss: <CloseRoundedIcon {...iconProps} />,
        open: <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MenuBookRoundedIcon {...iconProps} />
            <span style={{ fontWeight: '600', fontSize: '12px',  color: color}}>Read</span>
        </div>,
        save: <FavoriteBorderRoundedIcon {...iconProps} />,
        saveFilled: <FavoriteRoundedIcon {...iconProps} />,
    };

    return swipeIcons[name] || null;
}
