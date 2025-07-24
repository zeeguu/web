import { InjectedReaderApp } from "./InjectedReaderApp/InjectedReaderApp";
import ReactDOM from "react-dom";
import { useState } from "react";
import {
  deleteCurrentDOM,
  deleteEvents,
  deleteIntervals,
  deleteTimeouts,
} from "./popup/functions";
import { cleanDOMAfter } from "./Cleaning/pageSpecificClean";
import Zeeguu_API from "../../api/Zeeguu_API";
import { API_URL } from "../../config";
import ZeeguuError from "./ZeeguuError";
import { APIContext } from "../../contexts/APIContext";
import { ProgressProvider } from "../../contexts/ProgressContext";
import { GlobalStyle } from "./InjectedReaderApp/InjectedReaderApp.styles";
import { BROWSER_API } from "./utils/browserApi";

// Override insertBefore to fix styled-components crashes on certain websites
// Some sites (like fotogramas.es) dynamically modify their DOM structure, which can cause
// styled-components' style injection to fail with "The node before which the new node is 
// to be inserted is not a child of this node" errors. This override adds safety checks.
const originalInsertBefore = Node.prototype.insertBefore;
Node.prototype.insertBefore = function(newNode, referenceNode) {
  try {
    // Check if the reference node is actually a child of this node
    if (referenceNode && !this.contains(referenceNode)) {
      // If not, append instead
      return this.appendChild(newNode);
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  } catch (e) {
    console.warn('insertBefore failed, falling back to appendChild:', e);
    return this.appendChild(newNode);
  }
};

export function Main({ articleData, fragmentData, sessionId: passedSessionId, url }) {
  const [article, setArticle] = useState(articleData);
  const [sessionId, setSessionId] = useState(passedSessionId);
  const [modalIsOpen, setModalIsOpen] = useState(true);

  let api = new Zeeguu_API(API_URL);
  api.session = sessionId;

  // If we have pre-fetched data, render immediately
  if (articleData && fragmentData && passedSessionId) {
    return (
      <>
        <GlobalStyle />
        <APIContext.Provider value={api}>
          <ProgressProvider>
            <InjectedReaderApp modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} api={api} url={url} article={articleData} fragmentData={fragmentData} />
          </ProgressProvider>
        </APIContext.Provider>
      </>
    );
  }

  // Fallback case: no pre-fetched data - show error (errors should be handled in popup now)
  return (
    <>
      <GlobalStyle />
      <ZeeguuError
        isNotReadable={false}
        isNotLanguageSupported={false}
        isMissingSession={true}
        isZeeguuAPIDown={false}
        isInternetDown={false}
        api={api}
      />
    </>
  );
}

const div = document.createElement("div");
const url = window.location.href;

// Get data from popup
BROWSER_API.storage.local.get(['articleData', 'fragmentData', 'sessionId', 'url']).then((result) => {
  const { articleData, fragmentData, sessionId, url: storedUrl } = result;
  
  try {
    deleteIntervals();
    deleteTimeouts();
    cleanDOMAfter(url);
    deleteEvents();
    deleteCurrentDOM();
    
    // Ensure we have a proper head element for styled-components
    if (!document.head) {
      const head = document.createElement('head');
      document.documentElement.insertBefore(head, document.documentElement.firstChild);
    }
    
    // Ensure body exists
    if (!document.body) {
      const body = document.createElement('body');
      document.documentElement.appendChild(body);
    }
    
    document.body.appendChild(div);
    
    // Small delay to ensure DOM is ready for styled-components CSS injection
    setTimeout(() => {
      ReactDOM.render(<Main articleData={articleData} fragmentData={fragmentData} sessionId={sessionId} url={storedUrl || url} />, div);
    }, 10);
  } catch (err) {
    console.error(`failed to execute script: ${err}`);
    // Fallback if something goes wrong
    setTimeout(() => {
      ReactDOM.render(<Main articleData={null} fragmentData={null} sessionId={sessionId} url={url} />, div);
    }, 10);
  }
}).catch((err) => {
  console.error('Failed to get data from storage:', err);
  // Fallback
  deleteIntervals();
  deleteTimeouts();
  cleanDOMAfter(url);
  deleteEvents();
  deleteCurrentDOM();
  
  if (!document.head) {
    const head = document.createElement('head');
    document.documentElement.insertBefore(head, document.documentElement.firstChild);
  }
  
  // Ensure body exists
  if (!document.body) {
    const body = document.createElement('body');
    document.documentElement.appendChild(body);
  }
  
  document.body.appendChild(div);
  
  setTimeout(() => {
    ReactDOM.render(<Main articleData={null} fragmentData={null} sessionId={null} url={url} />, div);
  }, 10);
});
