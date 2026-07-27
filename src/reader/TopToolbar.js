import { StyledButton } from "../teacher/styledComponents/TeacherButtons.sc";
import { Link, useHistory } from "react-router-dom";
import strings from "../i18n/definitions";
import { useContext } from "react";
import { RoutingContext } from "../contexts/RoutingContext";
import * as s from "./ArticleReader.sc";

import ToolbarButtons from "./ToolbarButtons";
import ShareArticle from "./ShareArticle";

import BackArrow from "../pages/Settings/SharedComponents/BackArrow";
import useScreenWidth from "../hooks/useScreenWidth";
import { APIContext } from "../contexts/APIContext";
import { MOBILE_WIDTH } from "../components/MainNav/screenSize";
import { LeftGroup, MiddleGroup, RightGroup, ProgressBar } from "./TopToolbar.sc";
import SaveAndEditButton from "../components/Buttons/SaveAndEditButton";

export default function TopToolbar({
  user,
  teacherArticleID,
  articleID,
  translating,
  pronouncing,
  setTranslating,
  setPronouncing,
  showMweHints,
  setShowMweHints,
  showReadingTimer,
  setShowReadingTimer,
  readerFontSize,
  setReaderFontSize,
  articleProgress,
  timer,
  reportBroken,
  swipeBackTargetPath,
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
          <LeftGroup>
            {isMobile && <BackArrow swipeTargetPath={swipeBackTargetPath} />}
            {timer}
          </LeftGroup>
          <MiddleGroup>
            {user.is_teacher && (
              <>
                {teacherArticleID && !isMobile && (
                  <Link to={`/teacher/texts/editText/${articleID}`}>
                    <StyledButton className="toolbar-btn" $secondary studentView>
                      {strings.backToEditing}
                    </StyledButton>
                  </Link>
                )}

                {!teacherArticleID && screenWidth >= MOBILE_WIDTH && (
                  <SaveAndEditButton onClick={saveArticleAndEdit} label={strings.saveAndEdit} />
                )}
              </>
            )}
          </MiddleGroup>
          <RightGroup>
            {reportBroken}
            <ShareArticle articleID={articleID} />
            <ToolbarButtons
              translating={translating}
              pronouncing={pronouncing}
              setTranslating={setTranslating}
              setPronouncing={setPronouncing}
              showMweHints={showMweHints}
              setShowMweHints={setShowMweHints}
              showReadingTimer={showReadingTimer}
              setShowReadingTimer={setShowReadingTimer}
              readerFontSize={readerFontSize}
              setReaderFontSize={setReaderFontSize}
            />
          </RightGroup>
        </s.TopbarButtonsContainer>

        <ProgressBar value={articleProgress} />
      </s.Toolbar>
    </s.ToolbarWrapper>
  );
}
