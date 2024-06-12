import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Footer from "./info_page_shared/Footer";
import LoadingAnimation from "../components/LoadingAnimation";
import redirect from "../utils/routing/routing";
import SessionStorage from "../assorted/SessionStorage";
import { APP_DOMAIN } from "../appConstants";

const TIME_BEFORE_REDIRECT = 5000;

export default function AccountDeletion({ api }) {
  const user = useContext(UserContext);
  const [headingMsg, setHeadingMsg] = useState("We are deleting your account");
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isAccountDeleted, setIsAccountDeleted] = useState(false);
  useEffect(() => {
    if (SessionStorage.hasUserConfirmationForAccountDeletion()) {
      setErrorOccurred(false);
      setIsAccountDeleted(false);
      SessionStorage.setUserConfirmationForAccountDeletion(false);
      api.deleteUser(
        () => {
          setIsAccountDeleted(true);
          setHeadingMsg("✅ Your account has been successfully deleted!");
          setTimeout(() => {
            user.logoutMethod();
          }, TIME_BEFORE_REDIRECT);
        },
        () => {
          setIsAccountDeleted(false);
          setErrorOccurred(true);
          setHeadingMsg("❌ An error has occurred when deleting your account.");
        },
      );
    } else {
      // In case the user went to the path by mistake
      redirect(APP_DOMAIN);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InfoPage>
      <Header>
        <Heading>{headingMsg}</Heading>
      </Header>
      <Main>
        {!errorOccurred && !isAccountDeleted && (
          <>
            <p>
              You may leave this page. In case something goes wrong, the Zeeguu
              team will be notified.
            </p>
            <p>This process can take a while, please be patient.</p>
            <Footer>
              <LoadingAnimation></LoadingAnimation>
            </Footer>
          </>
        )}
        {isAccountDeleted && !errorOccurred && (
          <>
            <p>Thank you for taking the time to try out Zeeguu!</p>
            <p>You can close this tab.</p>
          </>
        )}
        {!isAccountDeleted && errorOccurred && (
          <>
            <p>
              The Zeeguu team has been notified. We will investigate it as soon
              as possible and contact you.
            </p>
          </>
        )}
      </Main>
    </InfoPage>
  );
}
