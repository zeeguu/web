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
}) {
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
        }
      );
    });
  };

  const handleSaveCopyToShare = () => {
    setReturnPath("/teacher/texts/AddTextOptions");
    saveArticleToOwnTexts();
  };

  return (
    <PopupButtonWrapper>
      {/* <s.BookmarkButton>
        <BookmarkButton
          bookmarked={articleInfo.starred}
          toggleBookmarkedState={toggleBookmarkedState}
        />
      </s.BookmarkButton> */}

      
      <s.Toolbar>
        
        {user.is_teacher && (
          <>
            {teacherArticleID && (
              <Link to={`/teacher/texts/editText/${articleID}`}>
                <StyledButton secondary studentView>
                  {strings.backToEditing}
                </StyledButton>
              </Link>
            )}

            {!teacherArticleID && (
              <StyledButton primary studentView onClick={handleSaveCopyToShare}>
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

        <s.RightHandSide>
          <button
            className={translating ? "selected" : ""}
            onClick={(e) => toggle(translating, setTranslating)}
          >
            <img
              src="https://zeeguu.org/static/images/translate.svg"
              alt={strings.translateOnClick}
            />
            <div className="tooltiptext">{strings.translateOnClick}</div>
          </button>
          <button
            className={pronouncing ? "selected" : ""}
            onClick={(e) => toggle(pronouncing, setPronouncing)}
          >
            <img
              src="https://zeeguu.org/static/images/sound.svg"
              alt={strings.listenOnClick}
            />
            <div className="tooltiptext">{strings.listenOnClick}</div>
          </button>
        </s.RightHandSide>
        <progress value={articleProgress} style={{width: '100%'}}/>
      </s.Toolbar>
    </PopupButtonWrapper>
  );
}
