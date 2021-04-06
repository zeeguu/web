import strings from "../i18n/definitions";

export default function News() {
  function item(month, text, link, suffix) {
    return (
      <>
        <div
          style={{ textAlign: "left", marginLeft: "8px", marginRight: "8px" }}
        >
          <p>
            <small>[{month}]</small> {text}
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <h1>{strings.news}</h1>

      <h2>2021</h2>

      {item(
        strings.feb,
        <>
          {strings.pernilleObtainsFundingPrefix}
          <a
            href="https://cip.ku.dk/english/projects-and-collaborations/towards-a-personalised-textbook---new-tools-and-new-methods/"
            target="blank"
          >
            {strings.pernilleObtainsFundingLinkTitle}
          </a>
          {strings.pernilleObtainsFundingSuffix}
        </>
      )}

      <h2>2020</h2>

      {item(
        strings.jan,
        <>
          📄 {strings.procrastinationPaper}(
          <a
            href="https://github.com/Aiki-Extension/Aiki/blob/master/Aiki-Turning_Procrastination_into_Microlearning.pdf"
            target="blank"
          >
            Aiki - Turning Online Procrastination into Microlearning
          </a>
          )
        </>
      )}

      {item(strings.sep, <>👨‍🎓 {strings.rotterdamStarts}</>)}

      {item(strings.aug, <> {strings.euroCall2020}</>)}

      {item(strings.jul, <>{strings.betaTesters40K}</>)}

      <h2>2019</h2>

      {item(strings.oct, <>{strings.betaTesters100K}</>)}

      {item(strings.sep, <>👩‍🎓 {strings.amsterdamStarts}</>)}

      {item(strings.aug, <>{strings.euroCall2019}</>)}

      <h2>2018</h2>
      {item(
        strings.jan,
        <>
          📄 {strings.asWeMayStudyPaper} (
          <a
            href="https://www.researchgate.net/publication/322489283_As_We_May_Study_Towards_the_Web_as_a_Personalized_Language_Textbook"
            target="blank"
          >
            As We May Study: Towards the Web as a Personalized Language Textbook
          </a>
          )
          <br />
          <br />
        </>
      )}

      {item(strings.sep, <>👩‍🎓 {strings.groningenStarts}</>)}

      <h2>2017</h2>

      {item(strings.may, <> 👩‍🎓 {strings.gomarusStarts}</>)}

      <h2>2016</h2>
      {item(strings.dec, <> {strings.zeeguuIsReady}</>)}
    </>
  );
}
