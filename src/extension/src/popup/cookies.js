import { BROWSER_API, cookies } from "../utils/browserApi";

export async function isLoggedIn(cookieUrl) {
  const cookie = await cookies.get({ url: cookieUrl, name: "sessionID" });
  if (cookie) {
    BROWSER_API.storage.local.set({ loggedIn: true }, () =>
      console.log(cookieUrl, "User already is logged in")
    );
  } else {
    BROWSER_API.storage.local.set({ loggedIn: false });
  }
}

export async function getUserInfo(cookieUrl, setUser) {
  try {
    // Try multiple URL variations for Firefox compatibility
    const urlVariations = [
      cookieUrl,
      "https://zeeguu.org",
      "https://www.zeeguu.org"
    ];

    let nameCookie = null;
    let nativeLangCookie = null;
    let sessionCookie = null;

    // Try direct cookie access first
    [nameCookie, nativeLangCookie, sessionCookie] = await Promise.all([
      cookies.get({ url: cookieUrl, name: "name" }),
      cookies.get({ url: cookieUrl, name: "nativeLanguage" }),
      cookies.get({ url: cookieUrl, name: "sessionID" })
    ]);

    // If session cookie not found, try other URL variations (Firefox issue)
    if (!sessionCookie) {
      for (const url of urlVariations) {
        try {
          const allCookies = await cookies.getAll({ url });
          if (allCookies && allCookies.length > 0) {
            if (!nameCookie) {
              nameCookie = allCookies.find(c => c.name === "name");
            }
            if (!nativeLangCookie) {
              nativeLangCookie = allCookies.find(c => c.name === "nativeLanguage");
            }
            if (!sessionCookie) {
              sessionCookie = allCookies.find(c => c.name === "sessionID");
            }
            if (sessionCookie) break;
          }
        } catch (e) {
          // Continue to next URL
        }
      }
    }

    if (nameCookie) {
      setUser((prevState) => ({ ...prevState, name: decodeURI(nameCookie.value) }));
    }
    if (nativeLangCookie) {
      setUser((prevState) => ({
        ...prevState,
        native_language: nativeLangCookie.value,
      }));
    }
    if (sessionCookie) {
      setUser((prevState) => ({ ...prevState, session: sessionCookie.value }));
    }
  } catch (error) {
    console.error("Error getting user info:", error);
  }
}

export async function getIsLoggedIn(cookieUrl) {
  try {
    // Try to get the sessionID cookie directly
    const cookieResult = await cookies.get({
      url: cookieUrl,
      name: "sessionID"
    });
    
    if (cookieResult && cookieResult.value) {
      BROWSER_API.storage.local.set({ loggedIn: true }, () =>
        console.log(cookieUrl, "User already is logged in")
      );
      return true;
    }
    
    // If direct cookie access fails (Firefox issue), try API validation
    // Try different URL variations to find cookies
    const urlVariations = [
      cookieUrl,
      "https://zeeguu.org",
      "https://www.zeeguu.org"
    ];
    
    let sessionId = null;
    for (const url of urlVariations) {
      try {
        const allCookies = await cookies.getAll({ url });
        if (allCookies && allCookies.length > 0) {
          const sessionCookie = allCookies.find(cookie => cookie.name === "sessionID");
          if (sessionCookie && sessionCookie.value) {
            sessionId = sessionCookie.value;
            break;
          }
        }
      } catch (e) {
        // Continue to next URL
      }
    }
    
    // If we found a session ID, validate it with the API
    if (sessionId) {
      const response = await fetch(`https://api.zeeguu.org/validate?session=${sessionId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.text();
        if (result && result.trim().toLowerCase() === 'ok') {
          BROWSER_API.storage.local.set({ loggedIn: true });
          return true;
        }
      }
    }
    
    // User is not logged in
    BROWSER_API.storage.local.set({ loggedIn: false });
    return false;
    
  } catch (error) {
    console.error("Error checking login status:", error);
    BROWSER_API.storage.local.set({ loggedIn: false });
    return false;
  }
}

export async function getUserInfoDictFromCookies(cookieUrl) {
  let userInfoDict = { name: "", native_language: "", session: "" };
  
  try {
    const [nameCookie, nativeLangCookie, sessionCookie] = await Promise.all([
      cookies.get({ url: cookieUrl, name: "name" }),
      cookies.get({ url: cookieUrl, name: "nativeLanguage" }),
      cookies.get({ url: cookieUrl, name: "sessionID" })
    ]);
    
    userInfoDict.name = nameCookie ? nameCookie.value : "";
    userInfoDict.native_language = nativeLangCookie ? nativeLangCookie.value : "";
    userInfoDict.session = sessionCookie ? sessionCookie.value : "";
    
  } catch (error) {
    console.error("Error getting user info cookies:", error);
  }
  
  return userInfoDict;
}

export async function saveCookiesOnZeeguu(userInfo, session, url) {
  const stringSession = String(session);
  
  try {
    await Promise.all([
      cookies.set({ name: "sessionID", url: url, value: stringSession }),
      cookies.set({ name: "name", url: url, value: userInfo.name }),
      cookies.set({ name: "nativeLanguage", url: url, value: userInfo.native_language })
    ]);
  } catch (error) {
    console.error("Error saving cookies:", error);
  }
}

export async function removeCookiesOnZeeguu(cookieUrl) {
  try {
    await Promise.all([
      cookies.remove({ url: cookieUrl, name: "sessionID" }),
      cookies.remove({ url: cookieUrl, name: "name" }),
      cookies.remove({ url: cookieUrl, name: "nativeLanguage" })
    ]);
  } catch (error) {
    console.error("Error removing cookies:", error);
  }
}
