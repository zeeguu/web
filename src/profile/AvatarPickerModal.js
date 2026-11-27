import { useContext, useEffect, useRef, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { UserContext } from "../contexts/UserContext";
import { APIContext } from "../contexts/APIContext";
import LocalStorage from "../assorted/LocalStorage";
import { saveSharedUserInfo } from "../utils/cookies/userInfo";
import Modal from "../components/modal_shared/Modal";
import Header from "../pages/_pages_shared/Header";
import PageTitle from "../pages/_pages_shared/PageTitle.sc";
import Main from "../pages/_pages_shared/Main.sc";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import {
  AVATAR_PALETTES,
  AVATAR_TABS,
  findMatchingPalette,
  getAvatarTabForId,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "./avatarOptions";
import AvatarArtwork from "./AvatarArtwork";
import * as s from "./AvatarPickerModal.sc";

// Opened by tapping your own avatar on the profile page. Every pick is saved
// straight away, so there is no confirm button.
export default function AvatarPickerModal({ open, onClose }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const initialId = validatedAvatarCharacterId(userDetails?.user_avatar?.image_name);
  const initialCharacterColor = validatedAvatarCharacterColor(userDetails?.user_avatar?.character_color);
  const initialBackgroundColor = validatedAvatarBackgroundColor(userDetails?.user_avatar?.background_color);

  const [activeTabId, setActiveTabId] = useState(() => getAvatarTabForId(initialId));
  const [characterId, setCharacterId] = useState(initialId);
  const [characterColor, setCharacterColor] = useState(initialCharacterColor);
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor);
  const [errorMessage, setErrorMessage] = useState("");
  // Latest local selection (so rapid taps merge cleanly) and latest confirmed
  // server save (so failed requests are never written to UserContext on close).
  const currentPick = useRef({
    image_name: initialId,
    character_color: initialCharacterColor,
    background_color: initialBackgroundColor,
  });
  const lastConfirmedPick = useRef(null);
  const latestRequestId = useRef(0);

  // Start from the user's current avatar each time the modal opens -- only
  // then, so a UserContext update while it is open cannot undo the picks.
  useEffect(() => {
    if (!open) return;
    const currentId = validatedAvatarCharacterId(userDetails?.user_avatar?.image_name);
    const currentFg = validatedAvatarCharacterColor(userDetails?.user_avatar?.character_color);
    const currentBg = validatedAvatarBackgroundColor(userDetails?.user_avatar?.background_color);
    setCharacterId(currentId);
    setActiveTabId(getAvatarTabForId(currentId));
    setCharacterColor(currentFg);
    setBackgroundColor(currentBg);
    setErrorMessage("");
    currentPick.current = {
      image_name: currentId,
      character_color: currentFg,
      background_color: currentBg,
    };
    lastConfirmedPick.current = null;
    latestRequestId.current += 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function pick(change) {
    const userAvatar = {
      image_name: change.image_name ?? currentPick.current.image_name,
      character_color: change.character_color ?? currentPick.current.character_color,
      background_color: change.background_color ?? currentPick.current.background_color,
    };
    currentPick.current = userAvatar;
    setCharacterId(userAvatar.image_name);
    setCharacterColor(userAvatar.character_color);
    setBackgroundColor(userAvatar.background_color);
    setErrorMessage("");
    const requestId = ++latestRequestId.current;
    // Only the avatar: /user_settings writes every field it is sent, so the
    // whole userDetails would also re-save languages and levels on each tap,
    // reverting any changed elsewhere since this page loaded.
    api.saveUserDetails(
      {
        avatar_image_name: userAvatar.image_name,
        avatar_character_color: userAvatar.character_color,
        avatar_background_color: userAvatar.background_color,
      },
      (error) => {
        if (requestId !== latestRequestId.current) return;
        const message = typeof error === "string" && error.trim() ? error : "Unable to save your avatar. Please try again.";
        setErrorMessage(message);
      },
      () => {
        if (requestId === latestRequestId.current) {
          lastConfirmedPick.current = userAvatar;
        }
      },
    );
  }

  function handleClose() {
    if (lastConfirmedPick.current) {
      const savedAvatar = lastConfirmedPick.current;
      setUserDetails((prev) => {
        const newUserDetails = { ...prev, user_avatar: savedAvatar };
        LocalStorage.setUserInfo(newUserDetails);
        saveSharedUserInfo(newUserDetails);
        return newUserDetails;
      });
    }
    onClose();
  }

  const activeTab = AVATAR_TABS.find((t) => t.id === activeTabId) ?? AVATAR_TABS[0];
  const matchedPalette = findMatchingPalette(characterColor, backgroundColor);

  return (
    <Modal open={open} onClose={handleClose}>
      <Header withoutLogo>
        <PageTitle>Choose Your Avatar</PageTitle>
      </Header>
      <Main>
        {errorMessage && <FullWidthErrorMsg role="alert">{errorMessage}</FullWidthErrorMsg>}

        <s.TabBar role="tablist" aria-label="Avatar styles">
          {AVATAR_TABS.map((tab) => (
            <s.TabButton
              key={tab.id}
              id={`avatar-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={tab.id === activeTab.id}
              aria-controls="avatar-picker-panel"
              $active={tab.id === activeTab.id}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </s.TabButton>
          ))}
        </s.TabBar>

        <s.PickerSection id="avatar-picker-panel" role="tabpanel" aria-labelledby={`avatar-tab-${activeTab.id}`}>
          <s.PickerGrid>
            {activeTab.items.map((item) => (
              <s.AvatarOption
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-pressed={characterId === item.id}
                title={item.label}
                $selected={characterId === item.id}
                $backgroundColor={backgroundColor}
                onClick={() => pick({ image_name: item.id })}
              >
                <AvatarArtwork imageName={item.id} color={characterColor} decorative />
                {characterId === item.id && (
                  <s.SelectionCheckmark $mini={false}>
                    <CheckIcon sx={{ fontSize: "inherit" }} />
                  </s.SelectionCheckmark>
                )}
              </s.AvatarOption>
            ))}
          </s.PickerGrid>
        </s.PickerSection>

        <s.PaletteSection>
          <span className="picker-label">
            {activeTab.usesDualToneSwatch ? "Color Theme" : "Background"}
          </span>
          <s.PickerGrid>
            {AVATAR_PALETTES.map((palette) => {
              const isSelected = matchedPalette?.id === palette.id;
              return (
                <s.PaletteOption
                  key={palette.id}
                  type="button"
                  aria-label={palette.label}
                  aria-pressed={isSelected}
                  title={palette.label}
                  $dualTone={activeTab.usesDualToneSwatch}
                  $backgroundColor={palette.backgroundColor}
                  $characterColor={palette.characterColor}
                  $selected={isSelected}
                  onClick={() =>
                    pick({
                      character_color: palette.characterColor,
                      background_color: palette.backgroundColor,
                    })
                  }
                >
                  {isSelected && (
                    <s.SelectionCheckmark $mini={true}>
                      <CheckIcon sx={{ fontSize: "inherit" }} />
                    </s.SelectionCheckmark>
                  )}
                </s.PaletteOption>
              );
            })}
          </s.PickerGrid>
        </s.PaletteSection>
      </Main>
    </Modal>
  );
}
