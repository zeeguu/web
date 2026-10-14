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
  AVATAR_BACKGROUND_COLORS,
  AVATAR_CHARACTER_COLORS,
  AVATAR_CHARACTER_IDS,
  AVATAR_IMAGE_MAP,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "./avatarOptions";
import { AvatarImage } from "./UserProfile.sc";
import * as s from "./AvatarPickerModal.sc";

// Opened by tapping your own avatar on the profile page. Every pick is saved
// straight away, so there is no confirm button.
export default function AvatarPickerModal({ open, onClose }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [characterId, setCharacterId] = useState();
  const [characterColor, setCharacterColor] = useState();
  const [backgroundColor, setBackgroundColor] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  // The last avatar the server accepted. It reaches UserContext only when the
  // modal closes: updating it on every pick makes the profile page reload
  // underneath, which would close the modal.
  const savedAvatar = useRef(null);

  // Start from the user's current avatar each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setCharacterId(validatedAvatarCharacterId(userDetails.user_avatar?.image_name));
    setCharacterColor(validatedAvatarCharacterColor(userDetails.user_avatar?.character_color));
    setBackgroundColor(validatedAvatarBackgroundColor(userDetails.user_avatar?.background_color));
    setErrorMessage("");
    savedAvatar.current = null;
  }, [open, userDetails]);

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
    api.saveUserDetails(
      {
        ...userDetails,
        avatar_image_name: userAvatar.image_name,
        avatar_character_color: userAvatar.character_color,
        avatar_background_color: userAvatar.background_color,
      },
      (error) => setErrorMessage(error ?? "Unable to save your avatar. Please try again."),
      () => {
        savedAvatar.current = userAvatar;
      },
    );
  }

  function handleClose() {
    if (savedAvatar.current) {
      const newUserDetails = { ...userDetails, user_avatar: savedAvatar.current };
      setUserDetails(newUserDetails);
      LocalStorage.setUserInfo(newUserDetails);
      saveSharedUserInfo(newUserDetails);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Header withoutLogo>
        <PageTitle>Choose Your Avatar</PageTitle>
      </Header>
      <Main>
        {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}
        <s.PickerSection>
          <span className="picker-label">Character</span>
          <s.PickerGrid>
            {AVATAR_CHARACTER_IDS.map((id) => (
              <s.AvatarOption
                key={id}
                $selected={characterId === id}
                $backgroundColor={backgroundColor}
                onClick={() => pick({ image_name: id })}
              >
                <AvatarImage $imageSource={AVATAR_IMAGE_MAP[id]} $color={characterColor} />
                {characterId === id && (
                  <s.SelectionCheckmark $mini={false}>
                    <CheckIcon sx={{ fontSize: "inherit" }} />
                  </s.SelectionCheckmark>
                )}
              </s.AvatarOption>
            ))}
          </s.PickerGrid>
        </s.PickerSection>

        <s.PickerSection>
          <span className="picker-label">Character Color</span>
          <s.PickerGrid>
            {AVATAR_CHARACTER_COLORS.map((color) => (
              <s.ColorOption
                key={color}
                $backgroundColor={color}
                $selected={characterColor === color}
                onClick={() => pick({ character_color: color })}
              >
                {characterColor === color && (
                  <s.SelectionCheckmark $mini={true}>
                    <CheckIcon sx={{ fontSize: "inherit" }} />
                  </s.SelectionCheckmark>
                )}
              </s.ColorOption>
            ))}
          </s.PickerGrid>
        </s.PickerSection>

        <s.PickerSection>
          <span className="picker-label">Background Color</span>
          <s.PickerGrid>
            {AVATAR_BACKGROUND_COLORS.map((color) => (
              <s.ColorOption
                key={color}
                $backgroundColor={color}
                $selected={backgroundColor === color}
                onClick={() => pick({ background_color: color })}
              >
                {backgroundColor === color && (
                  <s.SelectionCheckmark $mini={true}>
                    <CheckIcon sx={{ fontSize: "inherit" }} />
                  </s.SelectionCheckmark>
                )}
              </s.ColorOption>
            ))}
          </s.PickerGrid>
        </s.PickerSection>
      </Main>
    </Modal>
  );
}
