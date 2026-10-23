import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { setTitle } from "../../../assorted/setTitle";
import strings from "../../../i18n/definitions";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import CardPage from "../../_pages_shared/CardPage";
import SettingsItem from "../SharedComponents/SettingsItem";
import SettingsItemButton from "../SharedComponents/SettingsItemButton";
import ListOfSettingsItems from "../SharedComponents/ListOfSettingsItems";
import LogOutButton from "../LogOut/LogOutButton";
import ButtonContainer from "../../_pages_shared/ButtonContainer.sc";
import UpgradeAccountModal from "../../../components/UpgradeAccountModal";
import LocalStorage from "../../../assorted/LocalStorage";
import { APP_VERSION } from "../../../appVersion";
import DarkModeToggle from "../ThemeToggle/DarkModeToggle";
import PersonIcon from "@mui/icons-material/PersonOutline";
import CreateAccountIcon from "@mui/icons-material/PersonAddAltOutlined";
import TranslateIcon from "@mui/icons-material/Translate";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import MailIcon from "@mui/icons-material/MailOutline";
import InterestsIcon from "@mui/icons-material/TuneOutlined";
import FeedViewIcon from "@mui/icons-material/ViewAgendaOutlined";
import TextIcon from "@mui/icons-material/TextFieldsOutlined";
import AudioIcon from "@mui/icons-material/HeadphonesOutlined";
import SchedulingIcon from "@mui/icons-material/CalendarMonthOutlined";
import ShieldIcon from "@mui/icons-material/ShieldOutlined";
import TimerIcon from "@mui/icons-material/TimerOutlined";
import ScienceIcon from "@mui/icons-material/ScienceOutlined";
import CodeIcon from "@mui/icons-material/CodeOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { nativeShieldAvailable } from "../../../components/nativeShield";

import * as s from "./Settings.sc";

export default function Settings() {
  const { userDetails } = useContext(UserContext);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    setTitle(strings.settings);
  }, []);

  const isAnonymous = userDetails?.is_anonymous;

  function handleUpgradeSuccess() {}

  return (
    // The same page frame as every Settings subpage, so the header and its
    // back arrow sit in the same place when you move between them.
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <s.StyledWrapper>
        {/* Settings opens from the profile, the top bar or the sidebar, so
            back returns to wherever the learner came from. */}
        <SettingsPageHeader title={strings.settings} />

        {isAnonymous && (
          <ListOfSettingsItems header="Guest Account">
            <SettingsItemButton onClick={() => setShowUpgradeModal(true)} icon={<CreateAccountIcon />}>
              Create Account to Save Progress
            </SettingsItemButton>
          </ListOfSettingsItems>
        )}

        <UpgradeAccountModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onSuccess={handleUpgradeSuccess}
          triggerReason="settings"
          bookmarkCount={userDetails?.bookmark_count || 0}
        />

        <ListOfSettingsItems header={isAnonymous ? "Language" : strings.myAccount}>
          {!isAnonymous && (
            <SettingsItem
              path={"/account_settings/profile_details"}
              state={{ from: "/account_settings" }}
              icon={<PersonIcon />}
            >
              {strings.profileDetails}
            </SettingsItem>
          )}
          <SettingsItem path={"/account_settings/language_settings"} icon={<TranslateIcon />}>
            {strings.languageSettings}
          </SettingsItem>
          {!isAnonymous && (
            <SettingsItem path={"/account_settings/my_classrooms"} icon={<SchoolIcon />}>
              {strings.myClassrooms}
            </SettingsItem>
          )}
          {!isAnonymous && (
            <SettingsItem path={"/account_settings/notifications"} icon={<MailIcon />}>
              Email notifications
            </SettingsItem>
          )}
        </ListOfSettingsItems>

        {/* The feed's own settings and how tappable text behaves everywhere
          (Text & highlighting) live together: both are about reading. */}
        <ListOfSettingsItems header={"Reading"}>
          <SettingsItem path={"/account_settings/interests"} icon={<InterestsIcon />}>
            Interests
          </SettingsItem>
          <SettingsItem path={"/account_settings/feed_view"} icon={<FeedViewIcon />}>
            Feed view
          </SettingsItem>
          <SettingsItem path={"/account_settings/reading"} icon={<TextIcon />}>
            Text & highlighting
          </SettingsItem>
        </ListOfSettingsItems>

        <ListOfSettingsItems header={strings.exercises}>
          <SettingsItem path={"/account_settings/exercise_types"} icon={<AudioIcon />}>
            Audio & Pronunciation
          </SettingsItem>
          <SettingsItem path={"/account_settings/exercise_scheduling"} icon={<SchedulingIcon />}>
            Scheduling
          </SettingsItem>
        </ListOfSettingsItems>

        <ListOfSettingsItems header={"App"}>
          {/* iOS only: pausing other apps needs Apple's Screen Time API. */}
          {nativeShieldAvailable() && (
            <SettingsItem path={"/account_settings/aiki"} icon={<ShieldIcon />}>
              Aiki mode
            </SettingsItem>
          )}
          <SettingsItem path={"/account_settings/display"} icon={<TimerIcon />}>
            Activity Timer
          </SettingsItem>
          <DarkModeToggle />
        </ListOfSettingsItems>

        {/* Labs is opt-in on purpose, not behind a feature flag: Labs is
          itself the gate, and a hidden experiment gathers no feedback. */}
        <ListOfSettingsItems header={"More"}>
          <SettingsItem path={"/account_settings/labs"} icon={<ScienceIcon />}>
            Labs
          </SettingsItem>
          <SettingsItem path={"/account_settings/developer"} icon={<CodeIcon />}>
            Developer tools
          </SettingsItem>
          <SettingsItem path={"/about"} icon={<InfoIcon />}>
            About Zeeguu
          </SettingsItem>
        </ListOfSettingsItems>

        <ButtonContainer className={"adaptive-alignment-horizontal"} style={{ marginTop: "1em", marginBottom: "1em" }}>
          <LogOutButton />
        </ButtonContainer>

        {/* Apart from everything else, and from Log out, so it is never
          tapped on the way to something else. */}
        {!isAnonymous && (
          <ListOfSettingsItems>
            <SettingsItem path={"/account_settings/delete_account"} icon={<DeleteIcon />}>
              {strings.deleteAccount}
            </SettingsItem>
          </ListOfSettingsItems>
        )}

        <s.Version>v{APP_VERSION}</s.Version>
      </s.StyledWrapper>
    </CardPage>
  );
}
