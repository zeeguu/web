import BackArrow from "./settings_pages_shared/BackArrow";
import { setTitle } from "../../assorted/setTitle";
import { useEffect, useState } from "react";
import strings from "../../i18n/definitions";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import Selector from "../../components/Selector";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";

export default function MyWeeklyGoal({ api }) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setTitle(strings.MyWeeklyGoal);
  }, []);

  useEffect(() => {
    api.getUserCommitment((commitmentData) => {
      setUserDetails(commitmentData);
    });
  }, []);

  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.myWeeklyGoal}</Heading>
      </Header>
      <Main>
        <Form>
          <FormSection>
            <Selector
              label={strings.myPracticeGoal}
              selected={userDetails.user_days}
            />
          </FormSection>
          <FormSection>
            <Selector
              label={strings.myDurationGoal}
              selected={userDetails ? userDetails.user_minutes : 0}
            />
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"}>{strings.save}</Button>
          </ButtonContainer>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
