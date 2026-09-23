import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Capacitor } from "@capacitor/core";

import { APIContext } from "../../contexts/APIContext";
import LoadingAnimation from "../../components/LoadingAnimation";
import KioskLayout from "../../kiosk/KioskLayout";
import ArticleStatInfo from "../../components/ArticleStatInfo";
import ChoiceModal from "../../components/modal_shared/ChoiceModal";
import Button from "../../pages/_pages_shared/Button.sc";
import { zeeguuOrange } from "../../components/colors";
import LocalStorage from "../../assorted/LocalStorage";
import { languageNames } from "../../utils/languageDetection";
import { languageName } from "../../utils/misc/languageCodeToName";
import { setTitle } from "../../assorted/setTitle";
import useQuery from "../../hooks/useQuery";
import { TranslatableText } from "../TranslatableText";
import PublicInteractiveText from "../PublicInteractiveText";
import * as s from "../ArticleReader.sc";
import {
  FREE_WORDS,
  createWordMeter,
  pickTranslationTarget,
  rememberPendingSharedArticle,
} from "./publicReaderLogic";

const IOS_APP_URL = "https://apps.apple.com/dk/app/zeeguu-news-for-learners/id6756917355";
const ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=org.zeeguu.app";
const TARGET_KEY = "public_reader_translate_to";

const TopBar = styled.header`
  max-width: 768px;
  margin: 0 auto;
  padding: 16px 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.a`
  font-weight: 700;
  font-size: 1.4rem;
  color: ${zeeguuOrange};
  text-decoration: none;
`;

const LogInLink = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

const JoinBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -2px 12px var(--shadow-color);
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
`;

const JoinBarRow = styled.div`
  max-width: 768px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const TapHint = styled.div`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.4;

  select {
    font: inherit;
    color: var(--text-primary);
    background: transparent;
    border: none;
    border-bottom: 1px dashed var(--text-secondary);
    padding: 0 2px;
    cursor: pointer;
  }
`;

const StoreLinks = styled.div`
  margin-top: 1em;
  font-size: 0.95rem;
  color: var(--text-secondary);

  a {
    color: ${zeeguuOrange};
    font-weight: 600;
  }
`;

const TargetQuestion = styled.div`
  margin-bottom: 1em;
  font-weight: 600;

  select {
    font: inherit;
    color: var(--text-primary);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 0.2em 0.4em;
  }
`;

const ErrorCard = styled.div`
  max-width: 640px;
  margin: 48px auto;
  padding: 0 16px;
  text-align: center;
  color: var(--text-secondary);
`;

// Room for the fixed JoinBar so it never covers the last paragraph.
const JoinBarSpacer = styled.div`
  height: 140px;
`;

const SUPPORTED_TARGETS = Object.keys(languageNames);

// Account-less reading of a shared article: the whole text, a handful of free
// word translations, then an invitation to sign up or get the app. The article
// analogue of PublicSharedLessonPage; see the API's endpoints/public_article.py.
export default function PublicSharedArticlePage() {
  const api = useContext(APIContext);
  const history = useHistory();
  const query = useQuery();
  const articleId = query.get("id");
  const shareCode = query.get("s");
  const isNativeApp = Capacitor.isNativePlatform();

  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [wall, setWall] = useState(null); // null | "limit" | "rate"
  const [remaining, setRemaining] = useState(FREE_WORDS);
  // Translation language: null until the visitor picks one. The first tap asks
  // (askingTarget holds that tap's continuation); the choice is remembered.
  const [target, setTarget] = useState(null);
  const targetRef = useRef(null);
  const [askingTarget, setAskingTarget] = useState(null); // { onChosen, onCancelled } | null
  const [draftTarget, setDraftTarget] = useState("");

  const meterRef = useRef(null);
  if (!meterRef.current) meterRef.current = createWordMeter(window.localStorage);

  useEffect(() => {
    setArticle(null);
    setError(null);
    api.getPublicArticle(
      articleId,
      shareCode,
      (data) => {
        setArticle(data);
        setTitle(data.title);
        let stored = null;
        try {
          stored = window.localStorage.getItem(TARGET_KEY);
        } catch {
          // storage blocked
        }
        const remembered = stored && stored !== data.language ? stored : null;
        targetRef.current = remembered;
        setTarget(remembered);
      },
      () => setError("This article isn't available."),
    );
    setRemaining(meterRef.current.remaining());
  }, [api, articleId, shareCode]);

  // The target is read through a ref at tap time, so choosing or changing it
  // doesn't rebuild the text and throw away the translations already shown.
  const { interactiveTitle, interactiveFragments } = useMemo(() => {
    if (!article) return {};
    const meter = {
      allow: (text) => {
        const ok = meterRef.current.allow(text);
        setRemaining(meterRef.current.remaining());
        return ok;
      },
      remaining: () => meterRef.current.remaining(),
      onBlocked: (reason) => setWall(reason),
    };
    const suggestion = pickTranslationTarget(
      navigator.languages || [navigator.language],
      article.language,
      SUPPORTED_TARGETS,
    );
    const common = {
      api,
      language: article.language,
      getTargetLanguage: () => targetRef.current,
      askTarget: (onChosen, onCancelled) => {
        setDraftTarget(suggestion || "");
        setAskingTarget({ onChosen, onCancelled });
      },
      meter,
      sourceId: article.source_id,
      zeeguuSpeech: { language: article.language },
    };
    return {
      interactiveTitle: new PublicInteractiveText({
        ...common,
        tokenizedParagraphs: article.tokenized_title_new.tokens,
        contextIdentifier: article.tokenized_title_new.context_identifier,
      }),
      interactiveFragments: article.tokenized_fragments.map(
        (fragment) =>
          new PublicInteractiveText({
            ...common,
            tokenizedParagraphs: fragment.tokens,
            contextIdentifier: fragment.context_identifier,
            formatting: fragment.formatting,
          }),
      ),
    };
  }, [api, article]);

  function changeTarget(code) {
    try {
      window.localStorage.setItem(TARGET_KEY, code);
    } catch {
      // storage blocked
    }
    targetRef.current = code;
    setTarget(code);
  }

  function startTranslating() {
    if (!draftTarget) return;
    changeTarget(draftTarget);
    const { onChosen } = askingTarget;
    setAskingTarget(null);
    onChosen();
  }

  function notNow() {
    const { onCancelled } = askingTarget;
    setAskingTarget(null);
    onCancelled();
  }

  const here = window.location.pathname + window.location.search;

  function signUp() {
    rememberPendingSharedArticle(window.localStorage, here);
    // A friend's link is the invitation; the invite-code screen is for
    // teachers' and researchers' codes, so skip straight to languages with
    // the article's language preselected.
    LocalStorage.setInviteCode("");
    const params = new URLSearchParams({ selected_language: article?.language || "" });
    if (target) params.set("translation_language", target);
    history.push(`/language_preferences?${params}`);
  }

  function logIn() {
    rememberPendingSharedArticle(window.localStorage, here);
    history.push(`/log_in?redirectLink=${encodeURIComponent(window.location.href)}`);
  }

  const topBar = (
    <TopBar>
      <Brand href="/">Zeeguu</Brand>
      <LogInLink onClick={logIn}>Log in</LogInLink>
    </TopBar>
  );

  if (error) {
    return (
      <KioskLayout>
        {topBar}
        <ErrorCard>
          <h2>Could not open this article</h2>
          <p>{error}</p>
          <Button onClick={() => history.push("/")}>Discover Zeeguu</Button>
        </ErrorCard>
      </KioskLayout>
    );
  }

  if (!article || !interactiveFragments) {
    return (
      <KioskLayout>
        {topBar}
        <LoadingAnimation specificStyle={{ minHeight: "60vh", justifyContent: "center" }} />
      </KioskLayout>
    );
  }

  const shareContext = article.shared_by_name ? { sharedByName: article.shared_by_name } : null;
  const articleLanguageName = languageName(article.language);
  const sharer = article.shared_by_name;

  const targetOptions = SUPPORTED_TARGETS.filter((c) => c !== article.language).map((c) => (
    <option key={c} value={c}>
      {languageNames[c]}
    </option>
  ));

  const wordsLeft = `${remaining} ${remaining === 1 ? "word" : "words"} left`;
  let hint;
  if (remaining === 0) {
    hint = <>Create an account to keep translating words.</>;
  } else if (!target) {
    hint = <>Tap any word to see its translation · {wordsLeft}</>;
  } else {
    hint = (
      <>
        Translating into{" "}
        <select value={target} onChange={(e) => changeTarget(e.target.value)} aria-label="Translate into">
          {targetOptions}
        </select>{" "}
        · {wordsLeft}
      </>
    );
  }

  const targetQuestion = (
    <>
      <TargetQuestion>
        Translate into{" "}
        <select value={draftTarget} onChange={(e) => setDraftTarget(e.target.value)} aria-label="Translate into">
          <option value="" disabled>
            choose a language
          </option>
          {targetOptions}
        </select>
      </TargetQuestion>
      You can translate {FREE_WORDS} words without an account. With one, you can translate every word and practice the
      ones you tap.
    </>
  );

  const storeLinks = !isNativeApp && (
    <StoreLinks>
      Or get the app for{" "}
      <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer">
        iPhone
      </a>{" "}
      ·{" "}
      <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer">
        Android
      </a>
    </StoreLinks>
  );

  const wallMessage = (
    <>
      {wall === "rate"
        ? "Lots of people are translating right now. "
        : `You have translated ${FREE_WORDS} words. `}
      Create a Zeeguu account to translate every word, practice the ones you tapped, and get {articleLanguageName}{" "}
      news at your level.
      {storeLinks}
    </>
  );

  // KioskLayout: the app's scroll container without its navigation — the
  // document itself doesn't scroll (index.css sets #root overflow: hidden).
  return (
    <KioskLayout>
      {topBar}
      {askingTarget && (
        <ChoiceModal
          title="Tap any word to see its translation"
          message={targetQuestion}
          primaryLabel="Start translating"
          secondaryLabel="Not now"
          secondaryAsLink
          onPrimary={startTranslating}
          onSecondary={notNow}
        />
      )}
      {wall && (
        <ChoiceModal
          title={sharer ? `${sharer} is learning ${articleLanguageName} with Zeeguu` : "Keep reading with Zeeguu"}
          message={wallMessage}
          primaryLabel="Create account"
          secondaryLabel="I already have an account"
          secondaryAsLink
          onPrimary={signUp}
          onSecondary={logIn}
          onCancel={() => setWall(null)}
        />
      )}

      <s.ArticleReader>
        <div id="text">
          <h1>
            <TranslatableText interactiveText={interactiveTitle} translating={true} pronouncing={false} />
          </h1>
          <s.ArticleInfoContainer>
            <ArticleStatInfo articleInfo={article} shareContext={shareContext} />
          </s.ArticleInfoContainer>

          {article.img_url && (
            <s.ArticleImgContainer>
              <s.ArticleImg alt="" src={article.img_url} />
            </s.ArticleImgContainer>
          )}

          <s.MainText>
            {interactiveFragments.map((interactiveText, index) => (
              <TranslatableText key={index} interactiveText={interactiveText} translating={true} pronouncing={false} />
            ))}
          </s.MainText>
        </div>
        <JoinBarSpacer />
      </s.ArticleReader>

      <JoinBar>
        <JoinBarRow>
          <TapHint>{hint}</TapHint>
          <Button className="small" onClick={signUp}>
            Create account
          </Button>
        </JoinBarRow>
      </JoinBar>
    </KioskLayout>
  );
}
