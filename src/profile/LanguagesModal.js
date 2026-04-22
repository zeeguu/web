import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import Heading from "../components/modal_shared/Heading.sc";
import Main from "../components/modal_shared/Main.sc";
import DynamicFlagImage from "../components/DynamicFlagImage";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { streakFireOrange } from "../components/colors";
import * as s from "./LanguagesModal.sc";

export function LanguagesModal({ open, onClose, isOwnProfile, profileData, activeLanguages }) {
  const isFriendAccepted = profileData?.friendship?.is_accepted === true;
  const canSeeStreaks = isOwnProfile || isFriendAccepted;

  return (
    <Modal open={open} onClose={onClose}>
      <Header>
        <Heading>{isOwnProfile ? "Your" : `${profileData?.username}'s`} Languages</Heading>
      </Header>
      <Main>
        <s.LanguagesGrid>
          {activeLanguages.map((languageInfo) => (
            <s.LanguageCard key={languageInfo.code}>
              <DynamicFlagImage languageCode={languageInfo.code} />
              <span className="language-name">{languageInfo.language}</span>
              {canSeeStreaks && (
                <div className="streaks-info">
                  <div className="streak-item">
                    <LocalFireDepartmentIcon sx={{ color: streakFireOrange, fontSize: "1rem" }} />
                    <span>{languageInfo.daily_streak}</span>
                  </div>
                  <div className="streak-item max-streak">
                    <LocalFireDepartmentIcon sx={{ color: "#e65100", fontSize: "1rem" }} />
                    <span>{languageInfo.max_streak}</span>
                  </div>
                </div>
              )}
            </s.LanguageCard>
          ))}
        </s.LanguagesGrid>
      </Main>
    </Modal>
  );
}
