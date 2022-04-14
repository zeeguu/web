import strings from "../i18n/definitions";
import LocalStorage from "../assorted/LocalStorage";
import React, { useState, useEffect } from "react";

export default function NoArticles({ articleList }) {
  const [learnedLanguage, setLearnedLanguage] = useState(null);

  useEffect(() => {
    let userInfo = LocalStorage.userInfo();
    setLearnedLanguage(userInfo.learned_language);
  }, []);

  if (articleList.length === 0 && learnedLanguage) {
    return (
      <>
        <p> {strings.noArticles}</p>
        {learnedLanguage === "ua" && (
          <>
            <p> {strings.newssites}</p>
            <ul>
              <li>
                <a href="https://censor.net/" rel="noopener">
                  <p>censor.net</p>
                </a>
              </li>
              <li>
                <a href="https://www.pravda.com.ua/" rel="noopener">
                  <p>pravda.com.ua</p>
                </a>
              </li>
              <li>
                <a href="https://tsn.ua/" rel="noopener">
                  <p>tsn.ua</p>
                </a>
              </li>
              <li>
                <a href="https://www.rbc.ua/" rel="noopener">
                  <p>rbc.ua</p>
                </a>
              </li>
            </ul>
          </>
        )}
        {learnedLanguage === "hu" && (
          <>
            <p> {strings.newssites}</p>
            <ul>
              <li>
                <a href="https://index.hu/" rel="noopener">
                  <p>index.hu</p>
                </a>
              </li>
              <li>
                <a href="https://telex.hu/" rel="noopener">
                  <p>telex.hu</p>
                </a>
              </li>
              <li>
                <a href="https://24.hu/" rel="noopener">
                  <p>24.hu</p>
                </a>
              </li>
              <li>
                <a href="https://www.origo.hu/" rel="noopener">
                  <p>origo.hu</p>
                </a>
              </li>
            </ul>
          </>
        )}
        {learnedLanguage === "no" && (
          <>
            <p> {strings.newssites}</p>
            <ul>
              <li>
                <a href="https://www.vg.no/" rel="noopener">
                  <p>vg.no</p>
                </a>
              </li>
              <li>
                <a href="https://www.nrk.no/" rel="noopener">
                  <p>nrk.no</p>
                </a>
              </li>
              <li>
                <a href="https://www.dagbladet.no/" rel="noopener">
                  <p>dagbladet.no</p>
                </a>
              </li>
              <li>
                <a href="https://www.tv2.no/" rel="noopener">
                  <p>tv2.no</p>
                </a>
              </li>
            </ul>
          </>
        )}
      </>
    );
  } else {
    return null;
  }
}
