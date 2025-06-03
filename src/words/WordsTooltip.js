import { Tooltip } from "@mui/material";

export default function WordsToolTip({open, setOpen, value}){
    if (value.cooling_interval == null) return null;
    
    return (
        <Tooltip
            open={open}
            value={value}
            onClose={()=>{
                console.log("Closing modal");
                setOpen(false);
            }}
            title={<span>
                You need to get this word correct {
                    value.cooling_interval === 0 
                    ? "today " : value.cooling_interval === 1 ? "tomorrow "
                    : `in ${value.cooling_interval} days `}
                 to get closer to level {value.level + 1}
            </span>}
        >
            <div></div>
        </Tooltip>
    );
}