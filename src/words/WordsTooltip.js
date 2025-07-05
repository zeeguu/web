import { Tooltip } from "@mui/material";

export default function WordsToolTip({open, setOpen, value, isOnCongratulationsPage}) {
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
                   isOnCongratulationsPage ? (
                     value.level === 4 && value.is_about_to_be_learned === true
                      ? "Congratulations! You have learned this word. You won't practice this word anymore"
                      : 
            <>
              You need to get this word correct{" "}
              {value.cooling_interval === 0
                ? "today "
                : value.cooling_interval === 1
                ? "tomorrow "
                : `in ${value.cooling_interval} days `}
              {value.level === 4
                ? "to get closer to learning this word"
                : `to get closer to level ${value.level + 1}`}
            </>) : (() => {
                          const nextPractice = new Date(value.next_practice_time);
                          const today = new Date();
                          // Set both to midnight for date-only comparison
                          nextPractice.setHours(0, 0, 0, 0);
                          today.setHours(0, 0, 0, 0);
                          const diffDays = Math.round((nextPractice - today) / (1000 * 60 * 60 * 24));
                          if (diffDays === 1) {
                            return <>You need to get this word correct tomorrow {value.level === 4 ? "to get closer to learning this word" : `to get closer to level ${value.level + 1}`}</>;
                          } else if (diffDays > 1) {
                            return <>You need to get this word correct in {diffDays} days {value.level === 4 ? "to get closer to learning this word" : `to get closer to level ${value.level + 1}`}</>;
                          } else {
                            return <>You need to get this word correct today {value.level === 4 ? "to get closer to learning this word" : `to get closer to level ${value.level + 1}`}</>;
                          }
                        })()
                  }
                </span>
              }
              >
            <div></div>
        </Tooltip>
    );
}