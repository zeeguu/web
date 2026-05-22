import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";

import { APIContext } from "../contexts/APIContext";
import LoadingAnimation from "../components/LoadingAnimation";
import LessonPlayerCard from "./LessonPlayerCard";
import { languageNames } from "../utils/languageDetection";
import Button from "../pages/_pages_shared/Button.sc";
import { zeeguuOrange } from "../components/colors";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 48px;
  background-color: var(--page-bg, #fafafa);
`;

const Brand = styled.a`
  font-weight: 700;
  font-size: 1.4rem;
  color: ${zeeguuOrange};
  text-decoration: none;
  margin-bottom: 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 640px;
  background: var(--card-bg, #fff);
  border-radius: 16px;
  box-shadow: 0 2px 12px var(--shadow-color, rgba(0, 0, 0, 0.08));
  padding: 24px;
  margin-bottom: 24px;
`;

const CTA = styled.div`
  width: 100%;
  max-width: 640px;
  text-align: center;

  h2 {
    font-size: 1.2rem;
    margin: 0 0 8px;
  }

  p {
    color: var(--text-secondary);
    margin: 0 0 16px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ErrorBox = styled.div`
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
`;

export default function PublicSharedLessonPage() {
  const api = useContext(APIContext);
  const { id: shareUuid } = useParams();

  const [lessonData, setLessonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getSharedAudioLesson(
      shareUuid,
      (data) => setLessonData(data),
      (err) => setError(err?.message || "Could not load shared lesson."),
    );
  }, [api, shareUuid]);

  if (error) {
    return (
      <PageWrapper>
        <Brand href="/">Zeeguu</Brand>
        <Card>
          <ErrorBox>
            <h2>Could not open this lesson</h2>
            <p>{error}</p>
          </ErrorBox>
        </Card>
      </PageWrapper>
    );
  }

  if (!lessonData) {
    return (
      <PageWrapper>
        <Brand href="/">Zeeguu</Brand>
        <LoadingAnimation />
      </PageWrapper>
    );
  }

  const lessonLang = lessonData.language_code;
  const lessonLangName = languageNames[lessonLang] || lessonLang;
  const titleText = lessonData.title || "Shared Audio Lesson";

  const metadata = (
    <>
      Language: <b>{lessonLangName}</b>
      {lessonData.canonical_suggestion && (
        <>
          {" · "}
          {lessonData.lesson_type === "situation" ? "Situation" : "Topic"}:{" "}
          <b>{lessonData.canonical_suggestion}</b>
        </>
      )}
    </>
  );

  return (
    <PageWrapper>
      <Brand href="/">Zeeguu</Brand>
      <Card>
        <LessonPlayerCard
          title={titleText}
          metadata={metadata}
          audioProps={{
            src: lessonData.audio_url,
            language: lessonLang,
            title: titleText,
            artist: `${lessonLangName} Audio Lesson`,
          }}
        />
      </Card>
      <CTA>
        <h2>Want your own personalized {lessonLangName} lessons?</h2>
        <p>
          Install Zeeguu to generate audio lessons tailored to your level and the
          words you're learning.
        </p>
        <ButtonRow>
          <Button
            as="a"
            href="https://apps.apple.com/dk/app/zeeguu-news-for-learners/id6756917355"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppleIcon />
            iOS
          </Button>
          <Button
            as="a"
            href="https://play.google.com/store/apps/details?id=org.zeeguu.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AndroidIcon />
            Android
          </Button>
        </ButtonRow>
      </CTA>
    </PageWrapper>
  );
}
