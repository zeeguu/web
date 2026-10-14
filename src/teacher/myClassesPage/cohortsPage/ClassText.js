import { useContext, useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { APIContext } from "../../../contexts/APIContext";
import LoadingAnimation from "../../../components/LoadingAnimation";
import EmptyState from "../../../components/EmptyState";
import BackArrow from "../../../pages/Settings/SharedComponents/BackArrow";
import { TeacherPageHeading, TeacherPageSubtitle } from "../../styledComponents/TeacherPageHeading.sc";
import { DetailHeader } from "../../styledComponents/DetailHeader.sc";
import { setTitle } from "../../../assorted/setTitle";
import * as c from "../../../components/ColumnWidth.sc";
import { classTextSubtitle, readerDetails, readingTimes, studentsLabel } from "./classTextLines";
import { durationLabel } from "../../../words/sessionHistory/sessionCard";
import { SectionLabel } from "./ClassTexts.sc";
import ClassTextHeatmap from "./ClassTextHeatmap";
import * as s from "./ClassText.sc";

/**
 * One text, as the whole class read it: the text coloured by how many
 * students looked each word up, the same words as a list, the ones most
 * students needed first, then who read it.
 *
 * For the teachers who give a class one text at a time: a word half the class
 * translated is one to go over in the lesson. Each reader opens onto their own
 * copy of the text, with their translations in place.
 */
export default function ClassText() {
  const api = useContext(APIContext);
  const { cohortID, articleID } = useParams();
  const [info, setInfo] = useState(null);
  const [failed, setFailed] = useState(false);
  // "looked up by at least N students": filters the heatmap and the word list alike
  const [threshold, setThreshold] = useState(1);

  setTitle("Class Text");

  useEffect(() => {
    api.getClassText(cohortID, articleID, setInfo, () => setFailed(true));
  }, [api, cohortID, articleID]);

  if (failed) return <EmptyState message="This text could not be opened." fillHeight={false} />;
  if (info === null) return <LoadingAnimation />;

  const nobodyRead = info.readers.length === 0;

  return (
    <c.NarrowColumn>
      <DetailHeader>
        <div className="back">
          <BackArrow redirectLink={`/teacher/classes/viewClass/${cohortID}/texts`} label="Texts" />
        </div>
        <TeacherPageHeading>{info.article.title}</TeacherPageHeading>
        <Subtitle info={info} />
      </DetailHeader>

      {nobodyRead && <EmptyState message="No student in this class has opened this text yet." fillHeight={false} />}

      {info.words.length > 0 && (
        <s.Section>
          <SectionLabel>The text, coloured by how many looked each word up</SectionLabel>
          <ClassTextHeatmap info={info} threshold={threshold} setThreshold={setThreshold} />

          <SectionLabel>Words they looked up</SectionLabel>
          <s.WordList>
            {info.words.filter((word) => word.students.length >= threshold).map((word) => (
              <WordRow key={word.word} word={word} />
            ))}
          </s.WordList>
        </s.Section>
      )}

      {!nobodyRead && (
        <s.Section>
          <SectionLabel>Who read it</SectionLabel>
          <s.ReaderList>
            {info.readers.map((reader) => (
              <li key={reader.id}>
                <Link to={`/teacher/classes/viewStudent/${reader.id}/class/${cohortID}/read/${articleID}`}>
                  <span className="name">{reader.name}</span>
                  <span className="details">{readerDetails(reader)}</span>
                </Link>
              </li>
            ))}
          </s.ReaderList>
        </s.Section>
      )}
    </c.NarrowColumn>
  );
}

// A word, how many students needed it; open it for the sentence and their names.
function WordRow({ word }) {
  return (
    <li>
      <details>
        <summary>
          <span className="word">{word.word}</span>
          <span className="translation">{word.translations.join(", ")}</span>
          <span className="count">{studentsLabel(word.students.length)}</span>
        </summary>
        <div className="more">
          <div className="context">{word.context}</div>
          <div className="who">{word.students.map((student) => student.name).join(", ")}</div>
        </div>
      </details>
    </li>
  );
}

// "Read by 7 of 12 students · median 6 min (…) · 23 words looked up", the
// median opening a chart of every student's time on hover (tap, on a phone).
function Subtitle({ info }) {
  const { readers, time, words } = classTextSubtitle(info);
  return (
    <TeacherPageSubtitle>
      {readers}
      {time && (
        <>
          {" · "}
          <Tooltip arrow enterTouchDelay={0} leaveTouchDelay={6000} title={<ReadingTimesChart readers={info.readers} />}>
            <s.TimeSummary>{time}</s.TimeSummary>
          </Tooltip>
        </>
      )}
      {words && ` · ${words}`}
    </TeacherPageSubtitle>
  );
}

// One bar per student, longest first, scaled to the longest.
function ReadingTimesChart({ readers }) {
  const times = readingTimes(readers);
  const longest = times[0]?.ms || 1;
  return (
    <s.ReadingTimesChart>
      {times.map((each) => (
        <li key={each.id}>
          <span className="name">{each.name}</span>
          <span className="bar" style={{ width: `${(each.ms / longest) * 100}%` }} />
          <span className="time">{durationLabel(each.ms)}</span>
        </li>
      ))}
    </s.ReadingTimesChart>
  );
}
