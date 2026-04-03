import { Link, useHistory } from "react-router-dom";
import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { saveSharedUserInfo } from "../../utils/cookies/userInfo";
import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";
import LocalStorage from "../../assorted/LocalStorage";
import strings from "../../i18n/definitions";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import InputField from "../../components/InputField";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg.sc";
import LoadingAnimation from "../../components/LoadingAnimation";
import useFormField from "../../hooks/useFormField";
import { EmailValidator, NonEmptyValidator } from "../../utils/ValidatorRule/Validator";
import validateRules from "../../assorted/validateRules";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import FullWidthConfirmMsg from "../../components/FullWidthConfirmMsg.sc";
import Modal from "../../components/modal_shared/Modal";
import {
  AVATAR_BACKGROUND_COLORS,
  AVATAR_CHARACTER_COLORS,
  AVATAR_CHARACTER_IDS,
  AVATAR_IMAGE_MAP,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "../../profile/avatarOptions";
import { AvatarBackground, AvatarImage } from "../../profile/UserProfile.sc";
import Feature from "../../features/Feature";
import * as s from "./ProfileDetails.sc";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

function normalizeProfileSaveError(error) {
  const fallback = "Unable to save profile details. Please try again.";

  const toFriendlyMessage = (value) => {
    if (value === undefined || value === null) return "";
    const message = String(value).trim();
    if (!message) return "";

    const lower = message.toLowerCase();
    if (lower === "failed to fetch") {
      return "Could not reach the server. Please check your connection and try again.";
    }
    if (message.startsWith("HTTP 409")) {
      return "That username is already taken. Please choose another one.";
    }
    if (message.startsWith("HTTP 5")) {
      return "The server had a problem while saving your profile. Please try again.";
    }
    if (message.startsWith("HTTP 4")) {
      return "Could not save profile details. Please review the form and try again.";
    }

    return message;
  };

  if (!error) return fallback;

  if (typeof error === "string") {
    return toFriendlyMessage(error) || fallback;
  }

  if (error instanceof Error) {
    return toFriendlyMessage(error.message) || fallback;
  }

  if (Array.isArray(error)) {
    const message = error.map((item) => normalizeProfileSaveError(item)).filter(Boolean).join(" ").trim();
    return message || fallback;
  }

  if (typeof error === "object") {
    const usernameErrors = error.username || error.user_name;
    if (Array.isArray(usernameErrors) && usernameErrors.length) {
      return toFriendlyMessage(usernameErrors.join(" ")) || fallback;
    }
    if (typeof usernameErrors === "string") {
      return toFriendlyMessage(usernameErrors) || fallback;
    }

    if (typeof error.message === "string") {
      return toFriendlyMessage(error.message) || fallback;
    }
    if (typeof error.error === "string") {
      return toFriendlyMessage(error.error) || fallback;
    }

    const combined = Object.values(error)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === "string")
      .join(" ")
      .trim();
    return toFriendlyMessage(combined) || fallback;
  }

  return toFriendlyMessage(error) || fallback;
}

export default function ProfileDetails() {
  const api = useContext(APIContext);
  const isGamificationEnabled = Feature.has_gamification();
  const state = useLocation().state || {};
  const fallbackRedirectPath = isGamificationEnabled ? "/profile" : "/account_settings";
  const redirectPath = ["/profile", "/account_settings"].includes(state.from) ? state.from : fallbackRedirectPath;
  const successfullyChangedPassword = "passwordChanged" in state ? state.passwordChanged : false;
  const [errorMessage, setErrorMessage] = useState("");
  const { userDetails, setUserDetails } = useContext(UserContext);
  const history = useHistory();
  const isPageMounted = useRef(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatarCharacterId, setSelectedAvatarCharacterId] = useState();
  const [selectedAvatarCharacterColor, setSelectedAvatarCharacterColor] = useState();
  const [selectedAvatarBackgroundColor, setSelectedAvatarBackgroundColor] = useState();

  const [displayName, setDisplayName, validateDisplayName, isDisplayNameValid, displayNameErrorMessage] = useFormField(
    "",
    NonEmptyValidator("Please provide a display name."),
  );
  const [username, setUsername, validateUsername, isUsernameValid, usernameErrorMessage] = useFormField(
    "",
    NonEmptyValidator("Please provide a username."),
  );
  const [email, setEmail, validateEmail, isEmailValid, emailErrorMessage] = useFormField("", [
    NonEmptyValidator("Please provide an email."),
    EmailValidator,
  ]);

  useEffect(() => {
    setTitle(strings.profileDetails);
  }, []);

  useEffect(() => {
    isPageMounted.current = true;
    if (isPageMounted.current) {
      setDisplayName(userDetails.name);
      setUsername(userDetails.username);
      setEmail(userDetails.email);

      setSelectedAvatarCharacterId(validatedAvatarCharacterId(userDetails.user_avatar?.image_name));
      setSelectedAvatarCharacterColor(validatedAvatarCharacterColor(userDetails.user_avatar?.character_color));
      setSelectedAvatarBackgroundColor(validatedAvatarBackgroundColor(userDetails.user_avatar?.background_color));
    }

    return () => {
      isPageMounted.current = false;
    };
    // eslint-disable-next-line
  }, [userDetails, api]);

  function handleSave(e) {
    e.preventDefault();
    setErrorMessage("");
    if (!validateRules([validateDisplayName, validateUsername, validateEmail])) return;

    const updatedFormValues = {
      name: displayName,
      username: username,
      email: email,
    };
    const updatedAvatarValues = {
      image_name: selectedAvatarCharacterId,
      character_color: selectedAvatarCharacterColor,
      background_color: selectedAvatarBackgroundColor,
    };
    const payload = {
      ...userDetails,
      ...updatedFormValues,
      ...(isGamificationEnabled
        ? Object.fromEntries(Object.entries(updatedAvatarValues).map(([key, value]) => [`avatar_${key}`, value]))
        : {}),
    };
    api.saveUserDetails(payload, (error) => setErrorMessage(normalizeProfileSaveError(error)), () => {
      const newUserDetails = {
        ...userDetails,
        ...updatedFormValues,
        ...(isGamificationEnabled ? { user_avatar: updatedAvatarValues } : {}),
      };
      setUserDetails(newUserDetails);
      LocalStorage.setUserInfo(newUserDetails);
      saveSharedUserInfo(newUserDetails);
      history.push(redirectPath);
    });
  }

  if (!userDetails) {
    return <LoadingAnimation />;
  }
  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow redirectLink={redirectPath} />
      <Header withoutLogo>
        <Heading>{strings.profileDetails}</Heading>
        {successfullyChangedPassword && (
          <>
            <FullWidthConfirmMsg>Password changed successfully!</FullWidthConfirmMsg>
          </>
        )}
      </Header>
      <Main>
        <Form>
          {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}
          <FormSection>
            {isGamificationEnabled && (
              <s.AvatarWrapper>
              <AvatarBackground
                className="clickable"
                onClick={() => setShowAvatarModal(true)}
                $backgroundColor={selectedAvatarBackgroundColor}
              >
                <AvatarImage
                  $imageSource={AVATAR_IMAGE_MAP[selectedAvatarCharacterId]}
                  $color={selectedAvatarCharacterColor}
                />
                <s.EditAvatarButton type="button" onClick={() => setShowAvatarModal(true)}>
                  <EditIcon sx={{ fontSize: "1rem" }} />
                </s.EditAvatarButton>
              </AvatarBackground>
            </s.AvatarWrapper>
            )}
            <InputField
              type={"text"}
              label={strings.displayName}
              id={"name"}
              name={"name"}
              placeholder={strings.displayNamePlaceholder}
              value={displayName}
              isError={!isDisplayNameValid}
              errorMessage={displayNameErrorMessage}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
            <InputField
              type={"text"}
              label={strings.username}
              id={"username"}
              name={"username"}
              placeholder={strings.usernamePlaceholder}
              value={username}
              isError={!isUsernameValid}
              errorMessage={usernameErrorMessage}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <InputField
              type={"email"}
              label={strings.email}
              id={"email"}
              name={"email"}
              placeholder={strings.emailPlaceholder}
              value={email}
              isError={!isEmailValid}
              errorMessage={emailErrorMessage}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <Link
              to={{
                pathname: "/reset_pass",
                state: { profileEmail: email },
              }}
            >
              Change password
            </Link>
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"} onClick={handleSave}>
              {strings.save}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>

      {isGamificationEnabled && (
        <Modal open={showAvatarModal} onClose={() => setShowAvatarModal(false)}>
        <Header withoutLogo>
          <Heading>Choose Your Avatar</Heading>
        </Header>
        <Main>
          <s.PickerSection>
            <span className="picker-label">Character</span>
            <s.PickerGrid>
              {AVATAR_CHARACTER_IDS.map((id) => (
                <s.AvatarOption
                  key={id}
                  $selected={selectedAvatarCharacterId === id}
                  $backgroundColor={selectedAvatarBackgroundColor}
                  onClick={() => {
                    setSelectedAvatarCharacterId(id);
                  }}
                >
                  <AvatarImage $imageSource={AVATAR_IMAGE_MAP[id]} $color={selectedAvatarCharacterColor} />
                  {selectedAvatarCharacterId === id && (
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
                  $selected={selectedAvatarCharacterColor === color}
                  onClick={() => {
                    setSelectedAvatarCharacterColor(color);
                  }}
                >
                  {selectedAvatarCharacterColor === color && (
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
                  $selected={selectedAvatarBackgroundColor === color}
                  onClick={() => {
                    setSelectedAvatarBackgroundColor(color);
                  }}
                >
                  {selectedAvatarBackgroundColor === color && (
                    <s.SelectionCheckmark $mini={true}>
                      <CheckIcon sx={{ fontSize: "inherit" }} />
                    </s.SelectionCheckmark>
                  )}
                </s.ColorOption>
              ))}
            </s.PickerGrid>
          </s.PickerSection>

          <s.ConfirmButtonWrapper>
            <Button type={"button"} className={"small"} onClick={() => setShowAvatarModal(false)}>
              Set
            </Button>
          </s.ConfirmButtonWrapper>
        </Main>
      </Modal>
      )}
    </PreferencesPage>
  );
}
