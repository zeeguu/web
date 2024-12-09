import {
  PopupButtonWrapper,
  StyledButton,
} from "../teacher/styledComponents/TeacherButtons.sc";
import { Link } from "react-router-dom";
import strings from "../i18n/definitions";

import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { RoutingContext } from "../contexts/RoutingContext";
import * as s from "./ArticleReader.sc";

import SoundPlayer from "./SoundPlayer";
import ToolbarButtons from "./ToolbarButtons";

import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import useScreenWidth from "../hooks/useScreenWidth";

function userIsTesterForAudio(user) {
  let testers = [
    "Michalis",
    "Mir",
    "Wim",
    "Pauline",
    "Arno",
    "Geertje",
    "Pieter",
  ];
  return testers.some((tester) => user.name.startsWith(tester));
}

export function toggle(state, togglerFunction) {
  togglerFunction(!state);
}

export default function TopToolbar({
  user,
  teacherArticleID,
  articleID,
  api,
  interactiveText,
  translating,
  pronouncing,
  setTranslating,
  setPronouncing,
  articleProgress,
  timer,
}) {
  const { screenWidth } = useScreenWidth();
  const history = useHistory();
  const { setReturnPath } = useContext(RoutingContext); //This to be able to use Cancel correctly in EditText.
  const saveArticleToOwnTexts = () => {
    api.getArticleInfo(articleID, (article) => {
      api.uploadOwnText(
        article.title,
        article.content,
        article.language,
        (newID) => {
          history.push(`/teacher/texts/editText/${newID}`);
        },
      );
    });
  };

  const handleSaveCopyToShare = () => {
    setReturnPath("/teacher/texts/AddTextOptions");
    saveArticleToOwnTexts();
  };

  return (
    <PopupButtonWrapper>
      <s.Toolbar>
        <s.TopbarButtonsContainer screenWidth={screenWidth}>
          {screenWidth < 700 && <BackArrow noMargin={false} />}
          <div>
            {user.is_teacher && (
              <>
                {teacherArticleID && screenWidth >= 700 && (
                  <Link to={`/teacher/texts/editText/${articleID}`}>
                    <StyledButton className="toolbar-btn" secondary studentView>
                      {strings.backToEditing}
                    </StyledButton>
                  </Link>
                )}

                {!teacherArticleID && screenWidth >= 700 && (
                  <StyledButton
                    className="toolbar-btn"
                    primary
                    studentView
                    onClick={handleSaveCopyToShare}
                  >
                    <img
                      width="40px"
                      src="/static/images/share-button.svg"
                      alt="share"
                    />
                  </StyledButton>
                )}
              </>
            )}
            {userIsTesterForAudio(user) && (
              <s.PlayerControl>
                <SoundPlayer api={api} interactiveText={interactiveText} />
              </s.PlayerControl>
            )}
          </div>
          <ToolbarButtons
            translating={translating}
            pronouncing={pronouncing}
            setTranslating={setTranslating}
            setPronouncing={setPronouncing}
          />
        </s.TopbarButtonsContainer>

        <div>
          {timer}
          <progress style={{ margin: "0px" }} value={articleProgress} />
        </div>
      </s.Toolbar>
    </PopupButtonWrapper>
  );
}
