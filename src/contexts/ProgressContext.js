import { createContext } from "react";

const ProgressContext = createContext({
    weeklyTranslated: null,
    weeklyReadingMinutes: null,
    weeksPracticed: 0,
});

export { ProgressContext };