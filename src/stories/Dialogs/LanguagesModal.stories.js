import { LanguagesModal } from "../../profile/LanguagesModal";
import "../../index.css";

const activeLanguages = [
  {
    code: "en",
    language: "English",
    daily_streak: 4,
    max_streak: 12,
  },
  {
    code: "da",
    language: "Danish",
    daily_streak: 2,
    max_streak: 8,
  },
];

export default {
  title: "Dialogs/LanguagesModal",
  component: LanguagesModal,
};

export const Default = {
  render: () => <LanguagesModal open={true} onClose={() => {}} isOwnProfile={true} activeLanguages={activeLanguages} />,
};
