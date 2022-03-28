import Cookies from 'js-cookie'

function saveUserInfoIntoCookies(userInfo, sessionID=null) {
    let far_into_the_future = 365*5;
    Cookies.set('nativeLanguage', userInfo.native_language, {expires: far_into_the_future});
    Cookies.set('name', userInfo.name, {expires: far_into_the_future});
    if (sessionID) {
        console.log("saving also session ID")
        Cookies.set('sessionID', sessionID, {expires: far_into_the_future});
    }
}

function removeUserInfoFromCookies() {
    Cookies.remove('sessionID');
    Cookies.remove('nativeLanguage');
    Cookies.remove('name');
}

export {saveUserInfoIntoCookies, removeUserInfoFromCookies}