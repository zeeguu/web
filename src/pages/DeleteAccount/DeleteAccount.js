import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Footer from "../_pages_shared/Footer.sc";
import LoadingAnimation from "../../components/LoadingAnimation";
import redirect from "../../utils/routing/routing";
import SessionStorage from "../../assorted/SessionStorage";
import { APP_DOMAIN } from "../../appConstants";
import { APIContext } from "../../contexts/APIContext";

const TIME_BEFORE_REDIRECT = 5000;

const DeletionStatus = Object.freeze({
  UNDEFINED: 0,
  WAITING_API_RESPONSE: 1,
  ERRORED: 2,
  OK: 3,
});

export default function DeleteAccount() {
  const api = useContext(APIContext);
  const user = useContext(UserContext);
  const [headingMsg, setHeadingMsg] = useState("We are deleting your account");
  const [currentStatus, setCurrentStatus] = useState(DeletionStatus.UNDEFINED);

  useEffect(() => {
    if (SessionStorage.hasUserConfirmationForAccountDeletion()) {
      SessionStorage.setUserConfirmationForAccountDeletion(false);
      setCurrentStatus(DeletionStatus.WAITING_API_RESPONSE);
      api.deleteUser(
        () => {
          setHeadingMsg("✅ Your account has been successfully deleted!");
          setCurrentStatus(DeletionStatus.OK);
          setTimeout(() => {
            user.logoutMethod();
          }, TIME_BEFORE_REDIRECT);
        },
        () => {
          setCurrentStatus(DeletionStatus.ERRORED);
          setHeadingMsg("❌ An error has occurred when deleting your account.");
        },
      );
    } else {
      // In case the user went to the path by mistake
      redirect(APP_DOMAIN);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (currentStatus === DeletionStatus.UNDEFINED) return <LoadingAnimation />;

  return (
    <PreferencesPage>
      <Header>
        <Heading>{headingMsg}</Heading>
      </Header>
      <Main>
        {currentStatus === DeletionStatus.WAITING_API_RESPONSE && (
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
        {currentStatus === DeletionStatus.OK && (
          <>
            <p>Thank you for taking the time to try out Zeeguu!</p>
            <p>You can close this tab.</p>
          </>
        )}
        {currentStatus === DeletionStatus.ERRORED && (
          <>
            <p>
              The Zeeguu team has been notified. We will investigate it as soon
              as possible and contact you.
            </p>
          </>
        )}
      </Main>
    </PreferencesPage>
  );
}
