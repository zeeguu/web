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

export default function AcountDeletion({ api }) {
  const user = useContext(UserContext);
  const [headingMsg, setHeadingMsg] = useState("We are deleting your account");
  const [errorOcurred, setErrorOcurred] = useState();
  const [isAccountDeleted, setIsAccountDeleted] = useState();
  useEffect(() => {
    console.log(user);
    if (SessionStorage.hasUserConfirmationForAccountDeletion()) {
      setErrorOcurred(false);
      setIsAccountDeleted(false);
      SessionStorage.setUserConfirmationForAccountDeletion(false);
      api.deleteUser(
        user.session,
        () => {
          setIsAccountDeleted(true);
          setHeadingMsg("✅ Your account has been successfully deleted!");
          setTimeout(() => {
            user.logoutMethod();
          }, [5000]);
        },
        (error) => {
          setIsAccountDeleted(false);
          setErrorOcurred(true);
          setHeadingMsg("❌ An error has occurred when deleting your account.");
        },
      );
    } else {
      redirect(APP_DOMAIN);
    }
  }, []);
  // In case the user went to the path by mistake
  if (errorOcurred === undefined && isAccountDeleted === undefined)
    return <LoadingAnimation></LoadingAnimation>;
  return (
    <InfoPage>
      <Header>
        <Heading>{headingMsg}</Heading>
      </Header>
      <Main>
        {!errorOcurred && !isAccountDeleted && (
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
        {isAccountDeleted && !errorOcurred && (
          <>
            <p>Thank you for taking the time to try out Zeeguu!</p>
            <p>You can close this tab.</p>
          </>
        )}
        {!isAccountDeleted && errorOcurred && (
          <>
            <p>
              The Zeeguu team has been notificed. We will investigate it as soon
              as possible and contact you.
            </p>
          </>
        )}
      </Main>
    </InfoPage>
  );
}
