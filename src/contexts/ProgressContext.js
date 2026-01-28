import { createContext, useState, useEffect, useContext } from "react";
import { APIContext } from "./APIContext";
import { UserContext } from "./UserContext";

const ProgressContext = createContext()

function ProgressProvider({ children }) {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);

  const [weeklyTranslated, setWeeklyTranslated] = useState(null);
  const [weeklyReadingMinutes, setWeeklyReadingMinutes] = useState(null);
  const [daysPracticed, setDaysPracticed] = useState(null);
  const [weeklyPracticed, setWeeklyPracticed] = useState(null); //not implemented yet
  const [totalInLearning, setTotalInLearning] = useState(null);
  const [totalTranslated, setTotalTranslated] = useState(null);
  const [totalReadingMinutes, setTotalReadingMinutes] = useState(null);
  const [totalLearned, setTotalLearned] = useState(null);

  useEffect(() => {
    api.getDailyStreak((data) => {
      setDaysPracticed(data.daily_streak);
    });
  }, [userDetails.learned_language]);

  return (
    <ProgressContext.Provider
      value={{
        weeklyTranslated,
        setWeeklyTranslated,
        weeklyReadingMinutes,
        setWeeklyReadingMinutes,
        daysPracticed,
        setDaysPracticed,
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