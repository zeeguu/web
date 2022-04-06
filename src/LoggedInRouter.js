import SideBar from "./components/SideBar";
import { PrivateRoute } from "./PrivateRoute";
import ArticlesRouter from "./articles/_ArticlesRouter";
import WordsRouter from "./words/_WordsRouter";
import ExercisesRouter from "./exercises/ExercisesRouter";
import TeacherRouter from "./teacher/_routing/_TeacherRouter";
import Settings from "./pages/Settings";
import ArticleReader from "./reader/ArticleReader";
import UserDashboard from "./userDashboard/UserDashboard";
import React, { useState, useEffect } from "react";
import ExtensionMessage from "./components/ExtensionMessage";

/*global chrome*/
export default function LoggedInRouter({ api, setUser }) {
  const EXTENSION_ID = "ghnfbnnmkbhhbcionebpncddbpflehmp";

  const [hasExtension, setHasExtension] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (chrome.runtime) {
      chrome.runtime.sendMessage(
        EXTENSION_ID,
        "This is a message from Zeeguu.org",
        function (reply) {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
          }
          if (reply.message === true) {
            setHasExtension(true);
            console.log("Extension installed!");
          }
          else{
            handleOpen()
          }
        }
      );
    } else {
      handleOpen();
    }
  }, []);

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  return (
    <SideBar api={api}>
      {!hasExtension ? (
        <ExtensionMessage
          handleClose={handleClose}
          open={open}
        ></ExtensionMessage>
      ) : null}
      <PrivateRoute path="/articles" api={api} component={ArticlesRouter} />
      <PrivateRoute path="/exercises" api={api} component={ExercisesRouter} />
      <PrivateRoute path="/words" api={api} component={WordsRouter} />

      <PrivateRoute path="/teacher" api={api} component={TeacherRouter} />

      <PrivateRoute
        path="/account_settings"
        api={api}
        setUser={setUser}
        component={Settings}
      />

      <PrivateRoute path="/read/article" api={api} component={ArticleReader} />

      <PrivateRoute
        path="/user_dashboard"
        api={api}
        component={UserDashboard}
      />
    </SideBar>
  );
}
