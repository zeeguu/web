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
<<<<<<< HEAD
import {IconRow, AdjustedIcon, Description} from "./TopBarIconPreferences.sc";
import { useEffect, useState, React } from "react";

export default function TopbarIconPreferences(){
    useEffect(() => {
        const savedPrefs = JSON.parse(localStorage.getItem("topBarPrefs")) || [];
        setWhichItems(savedPrefs);
      }, []);

    const [whichItems, setWhichItems] = useState([]);

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
    
=======
import {IconRow, AdjustedIcon, Description} from "./TopbarIconPreferences.sc";

export default function TopbarIconPreferences(){
    function handleSave(e){
        e.preventDefault();
    }

    function handleIconPreferences(){   
    }

>>>>>>> 74f25417 (Added UI for settings page)
    return(
        <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
        <BackArrow />
        <Header withoutLogo>
            <Heading>{strings.progressIconPreferences}</Heading>
        </Header>
        <Main>
            <FormSection>
                <IconRow>
<<<<<<< HEAD
                <Checkbox checked={whichItems.includes("wordsPracticedTopBar")} onChange={(e) => handleIconPreferences(e, "wordsPracticedTopBar")}/>
=======
                <Checkbox onChange={handleIconPreferences}/>
>>>>>>> 74f25417 (Added UI for settings page)
                <AdjustedIcon>
                <NavIcon name="words"/>
                <Description>{strings.wordsPracticedThisWeek}</Description>
                </AdjustedIcon>
               </IconRow>
               <IconRow>
<<<<<<< HEAD
                <Checkbox checked={whichItems.includes("articleMinutesTopBar")} onChange={(e) => handleIconPreferences(e, "articleMinutesTopBar")}/>
                <AdjustedIcon>
                <NavIcon name="headerArticles"/>
=======
                <Checkbox onChange={handleIconPreferences}/>
                <AdjustedIcon>
                <NavIcon name="words"/>
>>>>>>> 74f25417 (Added UI for settings page)
                <Description>{strings.articlesReadThisWeek}</Description>
                </AdjustedIcon>
               </IconRow>
               <IconRow>
<<<<<<< HEAD
                <Checkbox checked={whichItems.includes("streakTopBar")} onChange={(e) => handleIconPreferences(e, "streakTopBar")}/>
                <AdjustedIcon>
                <NavIcon name="headerStreak"/>
=======
                <Checkbox onChange={handleIconPreferences}/>
                <AdjustedIcon>
                <NavIcon name="words"/>
>>>>>>> 74f25417 (Added UI for settings page)
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