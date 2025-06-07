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
import { useEffect, useState, React } from "react";

export default function TopbarIconPreferences(){
    useEffect(() => {
        const savedPrefs = JSON.parse(localStorage.getItem("topBarPrefs")) || [];
        console.log('savedPrefs', savedPrefs );
        setWhichItems(savedPrefs);
      }, []);

    const DEFAULT_TOPBAR_PREFS = [
        "wordsPracticedTopBar",
        "articleMinutesTopBar",
        "streakTopBar"
    ];

    const [whichItems, setWhichItems] = useState(() => {
        return JSON.parse(localStorage.getItem("topBarPrefs") || "null") || DEFAULT_TOPBAR_PREFS;
    });

    function handleIconPreferences(e, key) {
        const isChecked = e.target.checked;
      
        setWhichItems((prev) => {
          if (isChecked) {
            return [...prev, key]; 
          } else {
            return prev.filter(item => item !== key); 
          }
        });
      }
    
      function handleSave(e){
        e.preventDefault();
        localStorage.setItem("topBarPrefs", JSON.stringify(whichItems));
        console.log("Saved topBarPrefs:", whichItems);
        window.location.reload();
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
                <Checkbox checked={whichItems.includes("wordsPracticedTopBar")} onChange={(e) => handleIconPreferences(e, "wordsPracticedTopBar")}/>
                <AdjustedIcon>
                <NavIcon name="words"/>
                <Description>{strings.wordsPracticedThisWeek}</Description>
                </AdjustedIcon>
               </IconRow>
               <IconRow>
                <Checkbox checked={whichItems.includes("articleMinutesTopBar")} onChange={(e) => handleIconPreferences(e, "articleMinutesTopBar")}/>
                <AdjustedIcon>
                <NavIcon name="headerArticles"/>
                <Description>{strings.articlesReadThisWeek}</Description>
                </AdjustedIcon>
               </IconRow>
               <IconRow>
                <Checkbox checked={whichItems.includes("streakTopBar")} onChange={(e) => handleIconPreferences(e, "streakTopBar")}/>
                <AdjustedIcon>
                <NavIcon name="headerStreak"/>
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