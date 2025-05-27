import { Tooltip } from "@mui/material";

export default function WordsToolTip({open, setOpen, value}){
    
    console.log("it's open")
    return (
        <Tooltip
            open={open}
            value={value}
            onClose={()=>{
                console.log("Closing modal");
                setOpen(false);
            }}
            title={<span>
                You'll need to practice this word {
                    value.cooling_interval === 0 
                    ? "today" 
                    : `in ${value.cooling_interval} day${value.cooling_interval === 1 ? '' : 's'}`
                } to get closer to level {value.level}
            </span>}
        >
            <div></div>
        </Tooltip>
    );
}