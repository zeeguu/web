import { Link, useHistory } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
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
import * as s from "./ProfileDetails.sc";

export default function ProfileDetails() {
  const api = useContext(APIContext);
  const state = useLocation().state || {};
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

    const newUserDetails = {
      ...userDetails,
      name: displayName,
      username: username,
      email: email,
      avatar_image_name: selectedAvatarCharacterId,
      avatar_character_color: selectedAvatarCharacterColor,
      avatar_background_color: selectedAvatarBackgroundColor,
    };
    api.saveUserDetails(newUserDetails, setErrorMessage, () => {
      setUserDetails(newUserDetails);
      LocalStorage.setUserInfo(newUserDetails);
      saveSharedUserInfo(newUserDetails);
      history.push("/profile");
    });
  }

  if (!userDetails) {
    return <LoadingAnimation />;
  }
  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow redirectLink={"/profile"} />
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
              </AvatarBackground>
            </s.AvatarWrapper>
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
                />
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
                />
              ))}
            </s.PickerGrid>
          </s.PickerSection>
        </Main>
      </Modal>
    </PreferencesPage>
  );
}
