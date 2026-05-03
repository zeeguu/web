import { Redirect, Route, Switch } from "react-router-dom";
import VerbalFlashcardsPage from "./VerbalFlashcardsPage";
import { PrivateRoute } from "@/PrivateRoute";
import Congratulations from "../exercises/Congratulations";
import { useContext } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import Feature from "../features/Feature";
import strings from "../i18n/definitions";
import {
    hasSupportedVerbalFlashcardsLearnedLanguage,
    hasSupportedVerbalFlashcardsTranslationLanguage,
} from "./verbalFlashcardsAvailability";
import * as s from "./verbalFlashcards_Styled/VerbalFlashcards.sc.js";

function UnsupportedTranslationLanguageMessage() {
    return (
        <s.FlashcardsContainer>
            <s.Flashcard>
                <s.CardContent>
                    <s.NoCardsMessage>
                        <p>{strings.verbalFlashcardsUnsupportedTranslationLanguage}</p>
                    </s.NoCardsMessage>
                </s.CardContent>
            </s.Flashcard>
        </s.FlashcardsContainer>
    );
}

export default function VerbalFlashcardsRouter() {
    const api = useContext(APIContext);
    const { userDetails } = useContext(UserContext);
    const features = userDetails?.features;

    const backToVerbalFlashcards = ({ history }) => {
        history.push('/verbalFlashcards');
        api.logUserActivity(api.KEEP_EXERCISING, "", "", "verbal_flashcards");
    };

    if (features === undefined) {
        return null;
    }

    if (!Feature.verbal_flashcards() || !hasSupportedVerbalFlashcardsLearnedLanguage(userDetails)) {
        return <Redirect to="/articles" />;
    }

    if (!hasSupportedVerbalFlashcardsTranslationLanguage(userDetails)) {
        return <UnsupportedTranslationLanguageMessage />;
    }

    return (
        <Switch>
            <Route
                path="/verbalFlashcards/summary"
                render={(props) => (
                    <Congratulations
                        {...props}
                        backButtonAction={() => backToVerbalFlashcards(props)}
                        keepExercisingAction={() => backToVerbalFlashcards(props)}
                        toScheduledExercises={() => backToVerbalFlashcards(props)}
                    />
                )}
            />
            <PrivateRoute
                path="/verbalFlashcards"
                exact
                component={VerbalFlashcardsPage}
            />
        </Switch>
    );
}
