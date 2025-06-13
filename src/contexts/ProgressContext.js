import { createContext, useState } from "react";

const ProgressContext = createContext()

function ProgressProvider({ children }) {
  const [weeklyTranslated, setWeeklyTranslated] = useState(null);
  const [weeklyReadingMinutes, setWeeklyReadingMinutes] = useState(null);
  const [weeksPracticed, setWeeksPracticed] = useState(0);  
  const [weeklyPracticed, setWeeklyPracticed] = useState(null); //not implemented yet
  const [totalInLearning, setTotalInLearning] = useState(null);
  const [totalTranslated, setTotalTranslated] = useState(null);
  const [totalReadingMinutes, setTotalReadingMinutes] = useState(null);
  const [totalLearned, setTotalLearned] = useState(null);

  return (
    <ProgressContext.Provider
      value={{
        weeklyTranslated,
        setWeeklyTranslated,
        weeklyReadingMinutes,
        setWeeklyReadingMinutes,
        weeksPracticed,
        setWeeksPracticed,
        totalInLearning,
        setTotalInLearning,
        totalTranslated,
        setTotalTranslated,
        totalReadingMinutes,
        setTotalReadingMinutes,
        totalLearned,
        setTotalLearned,
        weeklyPracticed,
        setWeeklyPracticed,
      }}
  >
    {children}
  </ProgressContext.Provider>
  );
}
export { ProgressContext, ProgressProvider };