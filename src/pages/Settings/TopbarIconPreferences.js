import BackArrow from "./settings_pages_shared/BackArrow"
import strings from "../../i18n/definitions";
import Checkbox from "../../components/modal_shared/Checkbox";
import FormSection from "../_pages_shared/FormSection.sc";
import Main from "../_pages_shared/Main.sc";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button  from "../_pages_shared/Button.sc";
import NavIcon from "../../components/MainNav/NavIcon";
import {IconRow, AdjustedIcon, Description} from "./TopbarIconPreferences.sc";

export default function TopbarIconPreferences(){
    function handleSave(e){
        e.preventDefault();
    }

    function handleIconPreferences(){   
    }

    return(
        <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
        <BackArrow />
        <Header withoutLogo>
            <Heading>{strings.progressIconPreferences}</Heading>
        </Header>
        <Main>
            <FormSection>
                <IconRow>
                <Checkbox onChange={handleIconPreferences}/>
                <AdjustedIcon>
                <NavIcon name="words"/>
                <Description>{strings.wordsPracticedThisWeek}</Description>
                </AdjustedIcon>
               </IconRow>
               <IconRow>
                <Checkbox onChange={handleIconPreferences}/>
                <AdjustedIcon>
                <NavIcon name="words"/>
                <Description>{strings.articlesReadThisWeek}</Description>
                </AdjustedIcon>
               </IconRow>
               <IconRow>
                <Checkbox onChange={handleIconPreferences}/>
                <AdjustedIcon>
                <NavIcon name="words"/>
                <Description>{strings.weeklyStreak}</Description>
                </AdjustedIcon>
               </IconRow>
            </FormSection>
        </Main>
        <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"} onClick={handleSave}>
                {strings.save}
            </Button>
        </ButtonContainer>
        </PreferencesPage>
    );
}