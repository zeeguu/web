export default function News() {
  function item(month, text) {
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
      <h1>News</h1>

      <h2>2021</h2>

      {item(
        "Feb",
        <>
          Pernille Hvalsoe obtains funding from The Danish Agency for
          International Recruitment and Integration for a{" "}
          <a href="https://cip.ku.dk/english/projects-and-collaborations/towards-a-personalised-textbook---new-tools-and-new-methods/">
            project which uses Zeeguu to increase personalization
          </a>{" "}
          in the Danish classroom.
        </>
      )}

      <h2>2020</h2>

      {item(
        "Jan",
        <>
          📄 Paper using Zeeguu to teach vocabulary in moments of online
          procrastination accepted at CHI'2021 (
          <a href="https://github.com/Aiki-Extension/Aiki/blob/master/Aiki%20-%20Procrastination%20into%20Microlearning.pdf">
            Aiki - Turning Online Procrastination into Microlearning
          </a>
          )
        </>
      )}

      {item(
        "Sep",
        <>
          👨‍🎓 A highschool in Rotterdam starts using Zeeguu in their language
          classes
        </>
      )}

      {item("Aug", <> Workshop about Zeeguu at EuroCALL 2020</>)}

      {item(
        "Jul",
        <>
          The beta-testers of Zeeguu reach 40'000 distinct words practiced
          within the exercises
        </>
      )}

      <h2>2019</h2>

      {item(
        "Oct",
        <>
          The beta-testers of Zeeguu have reached 100'000 translations in their
          foreign language readings
        </>
      )}

      {item(
        "Sep",
        <>
          👩‍🎓 A highschool in Amsterdam starts using Zeeguu in the French courses
        </>
      )}

      {item("Aug", <>Mircea talks about Zeeguu at EuroCALL 2019</>)}

      <h2>2018</h2>
      {item(
        "Jan",
        <>
          📄 Paper about Zeeguu accepted at CHI 2018 -- the top international
          conference on HCI (
          <a href="https://www.researchgate.net/publication/322489283_As_We_May_Study_Towards_the_Web_as_a_Personalized_Language_Textbook">
            As We May Study: Towards the Web as a Personalized Language Textbook
          </a>
          )
          <br />
          <br />
        </>
      )}

      {item(
        "Sep",
        <>
          👩‍🎓 Students at the Language Center from the University of Groningen
          use Zeeguu in their Dutch classes
        </>
      )}

      <h2>2017</h2>

      {item(
        "May",
        <>
          {" "}
          👩‍🎓 Students at the Gomarus College in Netherlands start using Zeeguu
          in their French classes
        </>
      )}

      <h2>2016</h2>
      {item("Dec", <> Zeeguu is online and ready to welcome beta-testers</>)}
    </>
  );
}
