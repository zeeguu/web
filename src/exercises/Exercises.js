import {useEffect, useState} from "react";

import Congratulations from "./Congratulations";
import ProgressBar from "./ProgressBar";
import * as s from "./Exercises.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import {setTitle} from "../assorted/setTitle";
import strings from "../i18n/definitions";
import FeedbackDisplay from "./bottomActions/FeedbackDisplay";
import OutOfWordsMessage from "./OutOfWordsMessage";
import Feature from "../features/Feature";
import {SpeechContext} from "./SpeechContext";

import {useIdleTimer} from 'react-idle-timer'
import ZeeguuSpeech from "../speech/ZeeguuSpeech";

import {calculateExerciseSequence, assignBookmarksToExercises} from "./assignBookmarksToExercises";

import {DEFAULT_SEQUENCE, DEFAULT_SEQUENCE_NO_AUDIO, EXERCISE_TYPES_TIAGO,
    NUMBER_OF_BOOKMARKS_TO_PRACTICE} from "./exerciseSequenceTypes";

let audioEnabled;

export default function Exercises({
                                      api,
                                      articleID,
                                      backButtonAction,
                                      keepExercisingAction,
                                      source,
                                  }) {
    const [countBookmarksToPractice, setCountBookmarksToPractice] = useState(
        NUMBER_OF_BOOKMARKS_TO_PRACTICE
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentBookmarksToStudy, setCurrentBookmarksToStudy] = useState(null);
    const [finished, setFinished] = useState(false);
    const [correctBookmarks, setCorrectBookmarks] = useState([]);
    const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
    const [articleInfo, setArticleInfo] = useState(null);
    const [fullExerciseProgression, setFullExerciseProgression] = useState([]);
    const [currentExerciseType, setCurrentExerciseType] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
    const [reload, setReload] = useState(false);

    const [currentSessionDurationInSec, setCurrentSessionDurationInSec] = useState(1);
    const [clockActive, setClockActive] = useState(true);
    const [dbExerciseSessionId, setDbExerciseSessionId] = useState();
    const [speechEngine, setSpeechEngine] = useState();


    const {getRemainingTime} = useIdleTimer({
        onIdle,
        onActive,
        timeout: 30_000,
        throttle: 500
    })

    function onIdle() {
        setClockActive(false);
    }

    function onActive() {
        setClockActive(true)
    }


    function getExerciseSequenceType() {

        let exerciseTypesList = DEFAULT_SEQUENCE;
        if (Feature.tiago_exercises()) {
            exerciseTypesList = EXERCISE_TYPES_TIAGO;
        }
        if (!audioEnabled) {
            exerciseTypesList = DEFAULT_SEQUENCE_NO_AUDIO;
        }
        return exerciseTypesList;
    }


    useEffect(() => {

        if (!finished) {
            const interval = setInterval(() => {
                let newvalue = clockActive ? currentSessionDurationInSec + 1 : currentSessionDurationInSec;
                setCurrentSessionDurationInSec(newvalue);
            }, 1000);


            return () => {

                clearInterval(interval);
            };
        }
    }, [currentSessionDurationInSec, clockActive]);

    window.addEventListener("focus", function () {
        if (!finished) {
            setClockActive(true);
        }

    });

    window.addEventListener("blur", function () {
        if (!finished) {
            setClockActive(false);
        }
    });



    function initializeExercises(bookmarks, title) {
        setCountBookmarksToPractice(bookmarks.length);

        if (bookmarks.length > 0) {

            // This can only be initialized here after we can get at least one bookmakr
            // and thus, know the language to pronounce in
            setSpeechEngine(new ZeeguuSpeech(api, bookmarks[0].from_lang));

            let exerciseSequenceType = getExerciseSequenceType();

            let exerciseSequence = calculateExerciseSequence(exerciseSequenceType, bookmarks);

            let exerciseSession = assignBookmarksToExercises(bookmarks, exerciseSequence);

            // ML: Attempt to figure out why does the MultipleChoice exercise sometimes end up
            // with no bookmarks... In case one exercise would have no bookmarks we would filter it
            // ML: I still don't see how could we end up in this situation...
            exerciseSession = exerciseSession.filter(x=>x.bookmarks.length === x.requiredBookmarks && x.bookmarks.length > 0);

            setFullExerciseProgression(exerciseSession);

            if (currentBookmarksToStudy === null) {
                setCurrentBookmarksToStudy(exerciseSession[0].bookmarks);
            }

            setTitle(title);
        }
    }


    useEffect(() => {

        if (fullExerciseProgression.length === 0) {
                api.getUserPreferences((preferences) => {

                    audioEnabled = preferences["audio_exercises"] === undefined || preferences["audio_exercises"] === "true";

                    if (articleID) {
                        api.bookmarksToStudyForArticle(articleID, (bookmarks) => {
                            api.getArticleInfo(articleID, (data) => {
                                setArticleInfo(data);
                                initializeExercises(
                                    bookmarks,
                                    'Exercises for "' + data.title + '"'
                                );
                            });
                        });
                    } else {
                        api.getUserBookmarksToStudy(
                            NUMBER_OF_BOOKMARKS_TO_PRACTICE,
                            (bookmarks) => {
                                initializeExercises(bookmarks, strings.exercises);
                            }
                        );
                    }

                })
        }

        api.startLoggingExerciseSessionToDB((newlyCreatedDBSessionID) => {
            let id = JSON.parse(newlyCreatedDBSessionID).id;
            setDbExerciseSessionId(id);
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    let wordSourceText = articleInfo ? (
        <>
            <a href="#" className="wordSourceText" onClick={backButtonAction}>
                {truncate(articleInfo.title, 40)}
            </a>
        </>
    ) : (
        <>{strings.wordSourceDefaultText}</>
    );

    let wordSourcePrefix = articleInfo ? (
        <>{strings.goBackArticlePrefix}</>
    ) : (
        <>{strings.wordSourcePrefix}</>
    );



    // Standard flow when user completes exercise session
    if (finished) {
        api.logReaderActivity(api.COMPLETED_EXERCISES, articleID, "", source);
        return (
            <>
                <SpeechContext.Provider value={speechEngine}>
                    <Congratulations
                        articleID={articleID}
                        correctBookmarks={correctBookmarks}
                        incorrectBookmarks={incorrectBookmarks}
                        api={api}
                        backButtonAction={backButtonAction}
                        keepExercisingAction={keepExercisingAction}
                        source={source}
                        totalTime={currentSessionDurationInSec}
                        setClockActive={setClockActive}
                        exerciseSessionId={dbExerciseSessionId}
                    />
                </SpeechContext.Provider>

            </>
        );
    }

    if (!currentBookmarksToStudy && countBookmarksToPractice !== 0) {
        return <LoadingAnimation/>;
    }

    if (countBookmarksToPractice === 0) {
        return (
            <OutOfWordsMessage
                message={strings.goToTextsToTranslateWords}
                buttonText="Go to reading"
                buttonAction={backButtonAction}
            />
        );
    }

    function moveToNextExercise() {
        setIsCorrect(false);
        setShowFeedbackButtons(false);
        const newIndex = currentIndex + 1;

        if (newIndex === fullExerciseProgression.length) {
            setFinished(true);
            setClockActive(false);
            return;
        }
        setCurrentBookmarksToStudy(fullExerciseProgression[newIndex].bookmarks);
        setCurrentIndex(newIndex);
        api.updateExerciseSession(dbExerciseSessionId, currentSessionDurationInSec);
    }

    let correctBookmarksCopy = [...correctBookmarks];

    function correctAnswerNotification(currentBookmark) {
        if (
            !incorrectBookmarks.includes(currentBookmark) ||
            !incorrectBookmarksCopy.includes(currentBookmark)
        ) {
            correctBookmarksCopy.push(currentBookmark);
            setCorrectBookmarks(correctBookmarksCopy);
        }
        api.updateExerciseSession(dbExerciseSessionId, currentSessionDurationInSec);
    }

    let incorrectBookmarksCopy = [...incorrectBookmarks];

    function incorrectAnswerNotification(currentBookmark) {
        incorrectBookmarksCopy.push(currentBookmark);
        setIncorrectBookmarks(incorrectBookmarksCopy);
        api.updateExerciseSession(dbExerciseSessionId, currentSessionDurationInSec);
    }

    function uploadUserFeedback(userWrittenFeedback, id) {
        console.log(
            "Sending to the API. Feedback: ",
            userWrittenFeedback,
            " Exercise type: ",
            currentExerciseType,
            " and word: ",
            id
        );
        setIsCorrect(true);
        api.uploadExerciseFeedback(userWrittenFeedback, currentExerciseType, 0, id);
    }

    function toggleShow() {
        setShowFeedbackButtons(!showFeedbackButtons);
    }

    const CurrentExercise = fullExerciseProgression[currentIndex].type;
    return (
        <>
            <SpeechContext.Provider value={speechEngine}>

                <s.ExercisesColumn className="exercisesColumn">

                    {/*<s.LittleMessageAbove>*/}
                    {/*  {wordSourcePrefix} {wordSourceText}*/}
                    {/*</s.LittleMessageAbove>*/}
                    <ProgressBar index={currentIndex} total={fullExerciseProgression.length}/>
                    <s.ExForm>
                        <CurrentExercise
                            key={currentIndex}
                            bookmarksToStudy={currentBookmarksToStudy}
                            correctAnswer={correctAnswerNotification}
                            notifyIncorrectAnswer={incorrectAnswerNotification}
                            api={api}
                            setExerciseType={setCurrentExerciseType}
                            isCorrect={isCorrect}
                            setIsCorrect={setIsCorrect}
                            moveToNextExercise={moveToNextExercise}
                            toggleShow={toggleShow}
                            reload={reload}
                            setReload={setReload}
                            exerciseSessionId={dbExerciseSessionId}
                        />
                    </s.ExForm>
                    <FeedbackDisplay
                        showFeedbackButtons={showFeedbackButtons}
                        setShowFeedbackButtons={setShowFeedbackButtons}
                        currentExerciseType={currentExerciseType}
                        currentBookmarksToStudy={currentBookmarksToStudy}
                        feedbackFunction={uploadUserFeedback}
                    />
                </s.ExercisesColumn>

                <div style={{position: "fixed", bottom: "5px"}}>
                    <small style={{color: "gray"}}>
                        Seconds in this exercise session: {currentSessionDurationInSec} {clockActive ? "" : "(paused)"}
                    </small>
                </div>

            </SpeechContext.Provider>
        </>

    );
}


function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
}
