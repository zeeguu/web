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
  const [activeTabId, setActiveTabId] = useState(AVATAR_TABS[0].id);
  const [characterId, setCharacterId] = useState();
  const [characterColor, setCharacterColor] = useState();
  const [backgroundColor, setBackgroundColor] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  // The latest pick. It reaches UserContext only when the modal closes:
  // updating it on every pick makes the profile page reload underneath, which
  // would close the modal. Taken from the pick, not from a save's response, so
  // a save still in flight at close, or responses arriving out of order, do
  // not leave the old avatar showing.
  const lastPick = useRef(null);

  // Start from the user's current avatar each time the modal opens -- only
  // then, so a UserContext update while it is open cannot undo the picks.
  useEffect(() => {
    if (!open) return;
    const currentId = validatedAvatarCharacterId(userDetails.user_avatar?.image_name);
    setCharacterId(currentId);
    setActiveTabId(getAvatarTabForId(currentId));
    setCharacterColor(validatedAvatarCharacterColor(userDetails.user_avatar?.character_color));
    setBackgroundColor(validatedAvatarBackgroundColor(userDetails.user_avatar?.background_color));
    setErrorMessage("");
    lastPick.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function pick(change) {
    const userAvatar = {
      image_name: change.image_name ?? characterId,
      character_color: change.character_color ?? characterColor,
      background_color: change.background_color ?? backgroundColor,
    };
    setCharacterId(userAvatar.image_name);
    setCharacterColor(userAvatar.character_color);
    setBackgroundColor(userAvatar.background_color);
    setErrorMessage("");
    lastPick.current = userAvatar;
    // Only the avatar: /user_settings writes every field it is sent, so the
    // whole userDetails would also re-save languages and levels on each tap,
    // reverting any changed elsewhere since this page loaded.
    api.saveUserDetails(
      {
        avatar_image_name: userAvatar.image_name,
        avatar_character_color: userAvatar.character_color,
        avatar_background_color: userAvatar.background_color,
      },
      (error) => setErrorMessage(error ?? "Unable to save your avatar. Please try again."),
      () => {},
    );
  }

  function handleClose() {
    if (lastPick.current) {
      const newUserDetails = { ...userDetails, user_avatar: lastPick.current };
      setUserDetails(newUserDetails);
      LocalStorage.setUserInfo(newUserDetails);
      saveSharedUserInfo(newUserDetails);
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
        {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}

        <s.TabBar role="tablist" aria-label="Avatar styles">
          {AVATAR_TABS.map((tab) => (
            <s.TabButton
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === activeTab.id}
              $active={tab.id === activeTab.id}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </s.TabButton>
          ))}
        </s.TabBar>

        <s.PickerSection>
          <s.PickerGrid>
            {activeTab.items.map((item) => (
              <s.AvatarOption
                key={item.id}
                type="button"
                aria-label={item.label}
                title={item.label}
                $selected={characterId === item.id}
                $backgroundColor={backgroundColor}
                onClick={() => pick({ image_name: item.id })}
              >
                <AvatarArtwork imageName={item.id} color={characterColor} />
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
