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
            title={
                <span>
                    {
                value.level === 4 && value.is_about_to_be_learned === true
                ? "Congratulations! You have learned this word. You won't practice this word anymore"
                : <>
                   You need to get this word correct {
                    value.cooling_interval === 0 
                    ? "today " : value.cooling_interval === 1 ? "tomorrow "
                    : `in ${value.cooling_interval} days `
                    }
                    {
                    value.level === 4 
                        ? "to get closer to learning this word"
                        : `to get closer to level ${value.level + 1}`
                    }
                </>
             
                    }
            </span>}
        >
            <div></div>
        </Tooltip>
    );
}