import strings from "../i18n/definitions";
import LocalStorage from "../assorted/LocalStorage";
import React, { useState, useEffect } from "react";

export default function ShowLinkRecommendationsIfNoArticles({ articleList }) {
  const [learnedLanguage, setLearnedLanguage] = useState(null);

  useEffect(() => {
    let userInfo = LocalStorage.userInfo();
    setLearnedLanguage(userInfo.learned_language);
  }, []);

  if (articleList.length === 0 && learnedLanguage) {
    return (
      <>
        <p> {strings.noArticles}</p>
        {learnedLanguage === "pt" && (
          <>
            <p> {strings.newssites}</p>
            <ul>
              <li>
                <a href="https://www.sapo.pt/" rel="noopener">
                  <p>sapo.pt</p>
                </a>
              </li>
              <li>
                <a href="https://cnnportugal.iol.pt/" rel="noopener">
                  <p>cnnportugal.iol.pt</p>
                </a>
              </li>
              <li>
                <a href="https://www.noticiasaominuto.com/" rel="noopener">
                  <p>noticiasaominuto.com</p>
                </a>
              </li>
              <li>
                <a href="https://abola.pt/" rel="noopener">
                  <p>abola.pt</p>
                </a>
              </li>
              <li>
                <a href="https://www.rtp.pt/noticias/" rel="noopener">
                  <p>rtp.pt</p>
                </a>
              </li>
              <li>
                <a href="https://www.cmjornal.pt/" rel="noopener">
                  <p>cmjornal.pt</p>
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
