import { StyledButton } from "../teacher/styledComponents/TeacherButtons.sc";
import { Link } from "react-router-dom";
import strings from "../i18n/definitions";

import { useHistory } from "react-router-dom";
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
  const saveArticleToOwnTexts = () => {
    api.getArticleInfo(articleID, (article) => {
      api.uploadOwnText(article.title, article.content, article.language, (newID) => {
        history.push(`/teacher/texts/editText/${newID}`);
      });
    });
  };

  const handleSaveCopyToShare = () => {
    setReturnPath("/teacher/texts/AddTextOptions");
    saveArticleToOwnTexts();
  };

  return (
    <s.ToolbarWrapper>
      <s.Toolbar>
        <s.TopbarButtonsContainer $screenWidth={screenWidth}>
          <div style={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}>
            {isMobile && <BackArrow />}
            {!isMobile && timer}
          </div>
          <div>
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
                  <StyledButton className="toolbar-btn" primary studentView onClick={handleSaveCopyToShare}>
                    <img width="40px" src="/static/images/share-button.svg" alt="share" />
                  </StyledButton>
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

        <progress style={{ margin: "0px", marginBottom: "0.5rem", marginTop: isMobile ? "0" : "1rem" }} value={articleProgress} />
      </s.Toolbar>
    </s.ToolbarWrapper>
  );
}
