import BackArrow from "./settings_pages_shared/BackArrow";
import { setTitle } from "../../assorted/setTitle";
import { useEffect } from "react";
import strings from "../../i18n/definitions";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import Selector from "../../components/Selector";









export default function MyWeeklyGoal({}){

    useEffect(() => {
        setTitle(strings.MyWeeklyGoal);
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
                label={strings.myGoalSetting}
                />
                </FormSection>
            </Form>
        </Main>
        </PreferencesPage>
    )

    

}