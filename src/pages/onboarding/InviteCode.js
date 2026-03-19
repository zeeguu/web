import { useEffect, useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setTitle } from "../../assorted/setTitle";
import LocalStorage from "../../assorted/LocalStorage";
import strings from "../../i18n/definitions";
import { APIContext } from "../../contexts/APIContext";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import InputField from "../../components/InputField";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";

export default function InviteCode() {
  const history = useHistory();
  const location = useLocation();
  const api = useContext(APIContext);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle("Invite Code");
  }, []);

  function goToNext() {
    const params = new URLSearchParams(location.search);
    const next = params.get("selected_language")
      ? `/language_preferences?selected_language=${params.get("selected_language")}`
      : "/language_preferences";
    history.push(next);
  }

  function handleNext(e) {
    e.preventDefault();
    setError("");

    // Empty = skip, no validation needed
    if (!inviteCode.trim()) {
      LocalStorage.setInviteCode("");
      goToNext();
      return;
    }

    api.validateInviteCode(
      inviteCode.trim(),
      (cohortName) => {
        if (cohortName) {
          toast.success(`Welcome to "${cohortName}"!`);
        }
        LocalStorage.setInviteCode(inviteCode.trim());
        goToNext();
      },
      () => {
        setError("This invite code is not recognized. Please check and try again.");
      },
    );
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>Invite Code</Heading>
      </Header>
      <Main>
        <Form action={""}>
          <FormSection>
            <InputField
              type={"text"}
              label={"If you received a code from a teacher or researcher, enter it here"}
              id={"invite-code"}
              name={"invite-code"}
              placeholder={strings.inviteCodePlaceholder}
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value.toLowerCase());
                setError("");
              }}
              isError={!!error}
              errorMessage={error}
            />
          </FormSection>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={handleNext}
            >
              {inviteCode ? strings.next : "Skip"} <RoundedForwardArrow />
            </Button>
          </ButtonContainer>
          <p className="centered">
            {strings.alreadyHaveAccount + " "}
            <Link className="bold underlined-link" to="/log_in">
              {strings.login}
            </Link>
          </p>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
