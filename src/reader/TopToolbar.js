import { StyledButton } from "../teacher/styledComponents/TeacherButtons.sc";
import { Link, useHistory } from "react-router-dom";
import strings from "../i18n/definitions";
import { useContext } from "react";
import { RoutingContext } from "../contexts/RoutingContext";
import * as s from "./ArticleReader.sc";

import ToolbarButtons from "./ToolbarButtons";

import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import useScreenWidth from "../hooks/useScreenWidth";
import { APIContext } from "../contexts/APIContext";
import { MOBILE_WIDTH } from "../components/MainNav/screenSize";

export default function TopToolbar({
  user,
  teacherArticleID,
  articleID,
  translating,
  pronouncing,
  setTranslating,
  setPronouncing,
  articleProgress,
  timer,
}) {
  const api = useContext(APIContext);
  const { screenWidth, isMobile } = useScreenWidth();
  const history = useHistory();
  const { setReturnPath } = useContext(RoutingContext); //This to be able to use Cancel correctly in EditText.
  const saveArticleAndEdit = () => {
    api.getArticleInfo(articleID, (article) => {
      const originalCefrLevel = article.metrics?.cefr_level || null;
      const imgUrl = article.img_url || null;
      const htmlContent = article.htmlContent || article.content;
      api.uploadOwnText(
        article.title,
        article.content,
        article.language,
        (newID) => {
          // Navigate to edit page
          setReturnPath(window.location.pathname);
          history.push(`/teacher/texts/editText/${newID}`);
        },
        null, // onError
        originalCefrLevel,
        imgUrl,
        htmlContent,
      );
    });
  };

  return (
    <s.ToolbarWrapper>
      <s.Toolbar>
        <s.TopbarButtonsContainer $screenWidth={screenWidth}>
          <div style={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}>
            {isMobile && <BackArrow />}
            {!isMobile && timer}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {user.is_teacher && (
              <>
                {teacherArticleID && !isMobile && (
                  <Link to={`/teacher/texts/editText/${articleID}`}>
                    <StyledButton className="toolbar-btn" secondary studentView>
                      {strings.backToEditing}
                    </StyledButton>
                  </Link>
                )}

                {!teacherArticleID && screenWidth >= MOBILE_WIDTH && (
                  <button
                    onClick={saveArticleAndEdit}
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "1rem",
                      fontFamily: "Montserrat",
                      fontWeight: "500",
                      backgroundColor: "#1565C0",
                      color: "white",
                      border: "none",
                      borderRadius: "1.0625rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    {strings.saveAndEdit}
                  </button>
                )}
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginRight: "1rem" }}>
            {isMobile && timer}
            <ToolbarButtons
              translating={translating}
              pronouncing={pronouncing}
              setTranslating={setTranslating}
              setPronouncing={setPronouncing}
            />
          </div>
        </s.TopbarButtonsContainer>

        <progress
          style={{ margin: "0px", marginBottom: "0.5rem", marginTop: isMobile ? "0" : "1rem" }}
          value={articleProgress}
        />
      </s.Toolbar>
    </s.ToolbarWrapper>
  );
}
