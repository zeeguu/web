import { Redirect, Route, Switch } from "react-router-dom";
import VerbalFlashcardsPage from "./VerbalFlashcardsPage";
import { PrivateRoute } from "@/PrivateRoute";
import Congratulations from "../exercises/Congratulations";
import { useContext } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import Feature from "../features/Feature";

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

    if (!Feature.verbal_flashcards()) {
        return <Redirect to="/articles" />;
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
