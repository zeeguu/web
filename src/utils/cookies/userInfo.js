import Cookies from 'js-cookie'

function saveUserInfoIntoCookies(userInfo, sessionID=null) {
    let far_into_the_future = 365*5;
    const DOMAIN = "https://zeeguu.org";
    Cookies.set('nativeLanguage', userInfo.native_language, {expires: far_into_the_future}, {domain: DOMAIN});
    Cookies.set('name', userInfo.name, {expires: far_into_the_future}, {domain: DOMAIN});
    if (sessionID) {
        console.log("saving also session ID")
        Cookies.set('sessionID', sessionID, {expires: far_into_the_future}, {domain: DOMAIN});
    }
}

function removeUserInfoFromCookies() {
    Cookies.remove('sessionID');
    Cookies.remove('nativeLanguage');
    Cookies.remove('name');
}

export {saveUserInfoIntoCookies, removeUserInfoFromCookies}