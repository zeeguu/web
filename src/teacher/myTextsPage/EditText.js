import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import strings from "../../i18n/definitions";
import { RoutingContext } from "../../contexts/RoutingContext";
import EditTextInputFields from "./EditTextInputFields";
import AddToCohortDialog from "./AddToCohortDialog";
import DeleteTextWarning from "./DeleteTextWarning";
import { StyledButton, TopButtonWrapper } from "../styledComponents/TeacherButtons.sc";
import * as s from "../../components/ColumnWidth.sc";
import { ShareWithClassesButton, ViewAsStudentButton } from "./TooltippedButtons";
import { Error } from "../sharedComponents/Error";
import ShareWithCollegueDialog from "./ShareWithColleagueDialog";
import { APIContext } from "../../contexts/APIContext";
import CefrAssessmentDisplay from "./CefrAssessmentDisplay";
import LoadingAnimation from "../../components/LoadingAnimation";
import { detectLanguageFromText } from "../../utils/languageDetection";

export default function EditText() {
  const api = useContext(APIContext);
  const [articleState, setArticleState] = useState({
    article_title: "",
    article_content: "",
    language_code: "default",
    cefr_level: "",
    assessment_method: "",
  });
  const [originalCEFRLevel, setOriginalCEFRLevel] = useState(""); // Track original to detect manual changes
  const [cefrAssessments, setCefrAssessments] = useState(null); // Store CEFR assessment data
  const [cohortList, setCohortList] = useState([]);
  const [showAddToCohortDialog, setShowAddToCohortDialog] = useState(false);
  const [showDeleteTextWarning, setShowDeleteTextWarning] = useState(false);
  const [showShareWithColleagueDialog, setShowShareWithColleagueDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [stateChanged, setStateChanged] = useState(false);
  const articleID = useParams().articleID;
  const isNew = articleID === "new";
  const inputInvalid =
    articleState.article_title === "" ||
    articleState.article_content === "" ||
    articleState.language_code === "default";

  const viewAsStudentAndShareDisabled = inputInvalid || stateChanged;

  //The user is editing an already existing text...
  useEffect(() => {
    if (!isNew) {
      setIsLoading(true);
      let articleLoaded = false;
      let cohortsLoaded = false;

      const checkIfDone = () => {
        if (articleLoaded && cohortsLoaded) {
          setIsLoading(false);
        }
      };

      api.getArticleInfo(articleID, (article) => {
        const cefrLevel = article.metrics?.cefr_level || "";

        // Convert plain text to HTML if no htmlContent available
        // TODO: Investigate, why do we end up in this situation with not having HTML content!
        let contentForEditor = article.htmlContent;
        if (!contentForEditor || contentForEditor.trim() === "") {
          // Convert plain text paragraphs to HTML
          const plainText = article.content || "";
          contentForEditor = plainText
            .split(/\n\n+/) // Split on double newlines (paragraphs)
            .filter((para) => para.trim()) // Remove empty paragraphs
            .map((para) => `<p>${para.trim()}</p>`) // Wrap each paragraph in <p> tags
            .join("");
        }

        setArticleState({
          article_title: article.title || "",
          article_content: contentForEditor,
          language_code: article.language || "default",
          cefr_level: cefrLevel,
          assessment_method: article.cefr_source || "",
        });
        setOriginalCEFRLevel(cefrLevel); // Track original for change detection
        setStateChanged(false);

        // Save CEFR assessments if available
        if (article.cefr_assessments) {
          setCefrAssessments(article.cefr_assessments);
        }

        articleLoaded = true;
        checkIfDone();
      });

      api.getCohortFromArticle(articleID, (cohorts) => {
        setCohortList(cohorts || []);
        cohortsLoaded = true;
        checkIfDone();
      });
    }
    //eslint-disable-next-line
  }, [articleID]);

  //As there are three paths to EditText, we are using RoutingContext to go back correctly on Cancel
  const { returnPath } = useContext(RoutingContext);
  const history = useHistory();

  const handleCancel = () => {
    if (!isNew) {
      api.getArticleInfo(articleID, (article) => {
        const cefrLevel = article.metrics?.cefr_level || "";

        // Convert plain text to HTML if no htmlContent available
        let contentForEditor = article.htmlContent;
        if (!contentForEditor || contentForEditor.trim() === "") {
          // Convert plain text paragraphs to HTML
          const plainText = article.content || "";
          contentForEditor = plainText
            .split(/\n\n+/) // Split on double newlines (paragraphs)
            .filter((para) => para.trim()) // Remove empty paragraphs
            .map((para) => `<p>${para.trim()}</p>`) // Wrap each paragraph in <p> tags
            .join("");
        }

        setArticleState({
          article_title: article.title || "",
          article_content: contentForEditor,
          language_code: article.language || "default",
          cefr_level: cefrLevel,
          assessment_method: article.cefr_source || "",
        });
        setOriginalCEFRLevel(cefrLevel);
        setStateChanged(false);

        // Reload CEFR assessments
        if (article.cefr_assessments) {
          setCefrAssessments(article.cefr_assessments);
        }
      });
      api.getCohortFromArticle(articleID, (cohorts) => {
        setCohortList(cohorts || []);
      });
    } else {
      history.push(returnPath);
    }
  };

  const handleChange = (event) => {
    setStateChanged(true);
    const newState = {
      ...articleState,
      [event.target.name]: event.target.value, //ie: article_title : "Harry Potter tickets sold out", article_content : "bla bla bla"
    };

    // Auto-detect language when article content changes and language is not yet set
    if (event.target.name === "article_content" && articleState.language_code === "default") {
      const detectedLanguage = detectLanguageFromText(event.target.value);
      if (detectedLanguage) {
        newState.language_code = detectedLanguage;
        toast.info(`Language detected: ${detectedLanguage}`);
      }
    }

    setArticleState(newState);
  };

  //The LanguageSelector component returns the language selected by the user as a string (not an event like the other input fields)
  function handleLanguageChange(selectedLanguage) {
    setStateChanged(true);
    setArticleState({
      ...articleState,
      language_code: selectedLanguage,
    });
  }

  // Handle teacher override from CefrAssessmentDisplay component
  function handleTeacherOverride(overrideLevel) {
    setStateChanged(true);
    setArticleState({
      ...articleState,
      cefr_level: overrideLevel,
      assessment_method: overrideLevel ? "teacher_manual" : articleState.assessment_method,
    });
  }

  const uploadArticle = () => {
    // Strip HTML tags to get plain text for content field
    const stripHtml = (html) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    console.log("Saving HTML content:", articleState.article_content);

    const plainContent = stripHtml(articleState.article_content);

    // Upload article with CEFR level if available (from teacher override)
    // CEFR assessment is already happening live in CefrAssessmentDisplay component
    api.uploadOwnText(
      articleState.article_title,
      plainContent,
      articleState.language_code,
      (newID) => {
        console.log(`article created with id: ${newID}`);
        setStateChanged(false);
        history.push(`/teacher/texts/editText/${newID}`);
      },
      (error) => {
        toast.error("Failed to upload article: " + error);
      },
      articleState.cefr_level || null,
      articleState.assessment_method || null,
      null, // img_url
      articleState.article_content, // HTML content
    );
  };

  const updateArticle = () => {
    // Strip HTML tags to get plain text for content field
    const stripHtml = (html) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    console.log("Updating HTML content:", articleState.article_content);

    api.updateOwnText(
      articleID,
      articleState.article_title,
      stripHtml(articleState.article_content), // Plain text
      articleState.language_code,
      (result) => {
        if ((result = "OK")) {
          setStateChanged(false);
        } else {
          console.log(result);
        }
      },
      articleState.article_content, // HTML content
      articleState.cefr_level || null, // cefr_level
      articleState.assessment_method || null, // assessment_method
    );
  };

  const handleBack = () => {
    history.push("/teacher/texts");
  };

  const deleteText = () => {
    api.deleteOwnText(articleID, (res) => {
      if (res.success) {
        toast(res.message);
        setStateChanged(false);
        history.push("/teacher/texts");
      } else {
        toast.error(res.message || "Failed to delete article");
      }
    });
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <Fragment>
      <s.NarrowColumn>
        <TopButtonWrapper style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {!isNew && (
              <StyledButton secondary onClick={() => setShowDeleteTextWarning(true)}>
                {strings.delete}
              </StyledButton>
            )}
            <ViewAsStudentButton articleID={articleID} disabled={viewAsStudentAndShareDisabled} isNew={isNew} />
            <StyledButton
              secondary
              onClick={() => setShowShareWithColleagueDialog(true)}
              disabled={viewAsStudentAndShareDisabled}
            >
              {strings.shareWithColleague}
            </StyledButton>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {stateChanged && (
              <>
                <StyledButton secondary onClick={handleCancel}>
                  {strings.cancel}
                </StyledButton>
                <StyledButton primary onClick={isNew ? uploadArticle : updateArticle} disabled={inputInvalid}>
                  {strings.save}
                </StyledButton>
              </>
            )}
            {!stateChanged && (
              <StyledButton primary onClick={handleBack}>
                Close
              </StyledButton>
            )}
          </div>
        </TopButtonWrapper>
        <div
          style={{
            marginTop: "1.5rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            backgroundColor: "#f8f9fa",
            padding: "0.75rem",
            borderRadius: "5px",
          }}
        >
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Share With Class:</span>
          {cohortList.map((cohort, index) => (
            <span
              key={cohort}
              style={{ whiteSpace: "nowrap", fontFamily: "monospace", fontSize: "1.05em", letterSpacing: "-0.5px" }}
            >
              {cohort}
              {index < cohortList.length - 1 ? "," : ""}
            </span>
          ))}
          <div style={{ flexShrink: 0 }}>
            <ShareWithClassesButton
              onclick={() => setShowAddToCohortDialog(true)}
              disabled={viewAsStudentAndShareDisabled}
              isNew={isNew}
            />
          </div>
        </div>

        {/* CEFR Assessment Display - shows ML assessment (and LLM for existing articles) */}
        <CefrAssessmentDisplay
          articleID={articleID}
          articleContent={articleState.article_content}
          articleTitle={articleState.article_title}
          languageCode={articleState.language_code}
          onOverrideChange={handleTeacherOverride}
          initialAssessments={cefrAssessments}
        />

        <EditTextInputFields
          language_code={articleState.language_code}
          article_title={articleState.article_title}
          article_content={articleState.article_content}
          handleLanguageChange={handleLanguageChange}
          handleChange={handleChange}
        />
        {inputInvalid && <Error message={strings.errorEmptyInputField} />}
        <div style={{ height: "8em" }} />
      </s.NarrowColumn>
      {showAddToCohortDialog && (
        <AddToCohortDialog
          setIsOpen={setShowAddToCohortDialog}
          onCohortsUpdated={(cohorts) => setCohortList(cohorts)}
        />
      )}
      {showDeleteTextWarning && (
        <DeleteTextWarning
          deleteText={deleteText}
          setShowDeleteTextWarning={setShowDeleteTextWarning}
          articleTitle={articleState.article_title}
        />
      )}
      {showShareWithColleagueDialog && (
        <ShareWithCollegueDialog articleID={articleID} setShowDialog={setShowShareWithColleagueDialog} />
      )}
    </Fragment>
  );
}
