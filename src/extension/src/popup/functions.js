import { Article, ArticleAsync } from "../InjectedReaderApp/Article";
import { BROWSER_API } from "../utils/browserApi";

export async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await BROWSER_API.tabs.query(queryOptions);
  return tab;
}

export function setCurrentURL(tabURL) {
  BROWSER_API.storage.local.set({ tabURL: tabURL });
}

export async function getCurrentURL() {
  const value = await BROWSER_API.storage.local.get("tabURL");
  return value.tabURL;
}

export async function getNativeLanguage() {
  const value = await BROWSER_API.storage.local.get("userInfo");
  return value.userInfo.native_language;
}

export async function getUsername() {
  const value = await BROWSER_API.storage.local.get("userInfo");
  return value.userInfo.name;
}

export async function getSessionId() {
  const value = await BROWSER_API.storage.local.get("sessionId");
  return value.sessionId;
}

export function getSourceAsDOM(url) {
  try {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    // Don't set timeout for sync requests - it's not supported
    xmlhttp.send();

    if (xmlhttp.status !== 200) {
      throw new Error(`HTTP ${xmlhttp.status}: ${xmlhttp.statusText}`);
    }

    const parser = new DOMParser();
    //const clean = DOMPurify.sanitize(xmlhttp.responseText);
    return parser.parseFromString(xmlhttp.responseText, "text/html");
  } catch (error) {
    console.error("Failed to fetch article content:", error);
    throw error;
  }
}

export async function getSourceAsDOMAsync(url) {
  return new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true); // Async request
    xmlhttp.timeout = 15000; // Set 15 second timeout

    xmlhttp.onload = function () {
      if (xmlhttp.status === 200) {
        const parser = new DOMParser();
        //const clean = DOMPurify.sanitize(xmlhttp.responseText);
        resolve(parser.parseFromString(xmlhttp.responseText, "text/html"));
      } else {
        reject(new Error(`HTTP ${xmlhttp.status}: ${xmlhttp.statusText}`));
      }
    };

    xmlhttp.onerror = function () {
      reject(new Error("Network error occurred"));
    };

    xmlhttp.ontimeout = function () {
      reject(new Error("Request timed out"));
    };

    try {
      xmlhttp.send();
    } catch (error) {
      reject(error);
    }
  });
}

export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function deleteCurrentDOM() {
  const body = document.querySelector("body");
  if (body) {
    removeAllChildNodes(body);
  }
  const head = document.querySelector("head");
  if (head) {
    // Only preserve styled-components style tags (they have data-styled attribute)
    // These are our extension's styles, not the page's original styles
    const styledComponentsStyles = head.querySelectorAll("style[data-styled]");
    removeAllChildNodes(head);
    // Re-add only our styled-components styles
    styledComponentsStyles.forEach((style) => head.appendChild(style));
  }
  const div = document.querySelector("div");
  if (div) {
    removeAllChildNodes(div);
  }
  const iframe = document.querySelector("iframe");
  if (iframe) {
    removeAllChildNodes(iframe);
  }
}

export function deleteTimeouts() {
  var id = window.setTimeout(function () {}, 0);
  while (id--) {
    window.clearTimeout(id);
  }
}

export function deleteEvents() {
  // https://stackoverflow.com/a/39026635
  document.body.outerHTML = document.body.outerHTML;
}

export function deleteIntervals() {
  var id = window.setInterval(function () {}, 0);
  while (id--) {
    window.clearInterval(id);
  }
}

function decodeHTMLEntities(text) {
  if (!text) return text;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function extractMainImage(cleanHTML) {
  let mainImageUrl = null;
  try {
    // Try to get og:image meta tag first
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      mainImageUrl = ogImage.getAttribute('content');
    }

    // If no og:image, scan article HTML for large images
    if (!mainImageUrl) {
      const parser = new DOMParser();
      const articleDoc = parser.parseFromString(cleanHTML, 'text/html');
      const images = articleDoc.querySelectorAll('img');

      for (let img of images) {
        const src = img.getAttribute('src');
        if (!src) continue;

        // Skip icons, placeholders, gifs, svgs
        if (src.includes('icon') || src.includes('placeholder') ||
            src.endsWith('.gif') || src.endsWith('.svg')) {
          continue;
        }

        // Take first valid image (Readability already filtered out small ones)
        mainImageUrl = src;
        break;
      }
    }
  } catch (e) {
    console.log('Failed to extract main image:', e);
  }
  return mainImageUrl;
}

export function checkLanguageSupport(
  api,
  tab,
  setLanguageSupported,
  setArticleData,
  setLoadingProgress,
  setFragmentData,
  setDetectedLanguage = null,
) {
  if (setLoadingProgress) setLoadingProgress("Fetching article content...");

  // Use Readability to extract clean article content
  ArticleAsync(tab.url)
    .then((article) => {
      // Send the cleaned content from Readability instead of full page HTML
      // This avoids navigation menus and improves parsing performance
      const cleanHTML = article.content;
      console.log(`Clean HTML size: ${cleanHTML.length} characters`);
      console.log(`First 500 chars:`, cleanHTML.substring(0, 500));

      const mainImageUrl = extractMainImage(cleanHTML);

      return { article, rawHTML: cleanHTML, imageUrl: mainImageUrl };
    })
    .then(({ article, rawHTML, imageUrl }) => {
      if (setArticleData) setArticleData(article);
      if (setLoadingProgress) setLoadingProgress("Checking language support...");

      api.detectArticleLanguage(
        article.textContent,
        (result) => {
          // Set detected language regardless
          if (setDetectedLanguage && result.detected_language) {
            setDetectedLanguage(result.detected_language);
          }

          if (result.supported === false) {
            setLanguageSupported(false);
          } else if (result.needs_translation === true) {
            // Language is supported but needs translation
            setLanguageSupported(false); // This will trigger the translation prompt
          } else if (result.supported === true && !result.needs_translation) {
            // Language is supported and matches user's learned language
            if (setLoadingProgress) setLoadingProgress("Processing article fragments...");

            // Send all extracted data from Readability to avoid backend processing
            // The extension has already done all the extraction work
            let info = {
              url: tab.url,
              htmlContent: rawHTML,
              textContent: article.textContent,
              title: decodeHTMLEntities(article.title),
              author: decodeHTMLEntities(article.byline),
              excerpt: decodeHTMLEntities(article.excerpt),
              siteName: decodeHTMLEntities(article.siteName),
              imageUrl: imageUrl,
              preExtracted: true  // Flag to tell backend we've already extracted everything
            };

            if (setLoadingProgress) setLoadingProgress("Assessing article difficulty level...");

            api.findOrCreateArticle(
              info,
              (articleResult) => {
                if (articleResult.includes("Language not supported")) {
                  setLanguageSupported(false);
                  return;
                }

                try {
                  let artinfo = JSON.parse(articleResult);
                  if (setFragmentData) {
                    setFragmentData(artinfo);
                  }

                  if (setLoadingProgress) setLoadingProgress("Preparing reader...");

                  if (setLoadingProgress) setLoadingProgress("Opening article reader...");

                  setLanguageSupported(true);
                } catch (error) {
                  console.error("Failed to parse article info:", error);
                  setLanguageSupported(false);
                }
              },
              (error) => {
                // Handle errors when creating/fetching article
                console.error("Failed to create/fetch article:", error);

                if (error.status === 422) {
                  // Article parsing failed
                  console.log("Article could not be parsed");
                  setLanguageSupported(false);
                  if (setLoadingProgress) {
                    setLoadingProgress("This article could not be processed. Please try a different article.");
                  }
                } else if (error.status === 401) {
                  // Authentication error - handle same as language detection
                  console.log("Session invalid during article creation");
                  setLanguageSupported(false);
                  if (setLoadingProgress) {
                    setLoadingProgress("Session expired. Please close this popup and click the extension icon again.");
                  }
                } else {
                  // Other errors
                  setLanguageSupported(false);
                  if (setLoadingProgress) {
                    setLoadingProgress("An error occurred. Please try again.");
                  }
                }
              }
            );
          }
        },
        async (error) => {
          // Handle authentication and other API errors
          console.error("Language detection API error:", error);

          // Check for 401 - error might be a string like "HTTP 401" or an object
          const is401 = error === 401 || error?.status === 401 || (typeof error === 'string' && error.includes('401'));
          if (is401) {
            // 401 Unauthorized - session is invalid
            console.log("Session invalid - clearing stale cookies");

            // Remove stale sessionID cookie and local storage
            // so next time the popup opens it will get fresh cookies
            try {
              const { WEB_URL } = await import("../../../config");
              const { removeCookiesOnZeeguu } = await import("./cookies");

              // Clear stale cookies
              await removeCookiesOnZeeguu(WEB_URL);

              // Clear extension local storage
              await BROWSER_API.storage.local.clear();

              console.log("Cleared stale session cookies and storage");
            } catch (e) {
              console.error("Error clearing cookies:", e);
            }

            // Show error message to user
            setLanguageSupported(false);
            if (setLoadingProgress) {
              setLoadingProgress("Session expired. Please close this popup and click the extension icon again.");
            }
          } else {
            // Other errors - show a more accurate message
            setLanguageSupported(false);
            if (setLoadingProgress) {
              setLoadingProgress("Connection error. Please check your internet and try again.");
            }
          }
        }
      );
    })
    .catch((error) => {
      console.error("Failed to fetch article for language check:", error);
      setLanguageSupported(false);
    });
}

export function checkLanguageSupportFromUrl(api, url, setLanguageSupported) {
  Article(url).then((article) => {
    api.isArticleLanguageSupported(article.textContent, (result_dict) => {
      // console.log(result_dict);
      if (result_dict === "NO") {
        setLanguageSupported(false);
      }
      if (result_dict === "YES") {
        setLanguageSupported(true);
      }
    });
  });
}

export function setUserInLocalStorage(user, api) {
  if (user !== undefined) {
    BROWSER_API.storage.local.set({ userInfo: user });
    BROWSER_API.storage.local.set({ sessionId: user.session });
    api.session = user.session;
  }
}
