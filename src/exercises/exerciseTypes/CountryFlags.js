import React from "react";

function CountryFlags({ languageCode }) {
    function getFlagEmoji(languageCode) {
        const languageFlags = {
            sq: "🇦🇱", // Albanian
            ar: "🇪🇬", //Arabic, flag of Egypt, since it's the most commonly taught variant
            "zh-CN": "🇨🇳", // Chinese""
            da: "🇩🇰", // Danish
            fr: "🇫🇷", // French
            de: "🇩🇪", // German
            el: "🇬🇷", // Greek
            hu: "🇭🇺", // Hungarian
            ind: "🇮🇩", // Indonesian 
            it: "🇮🇹", // Italian
            ku: <img src={"/static/icons/kurdish-flag.png"} alt="Kurdish flag" style={{height: '1em', width: '1em'}} />, //Kurdish
            ur: "🇵🇰", // Urdu
            ja: "🇯🇵", // Japanese
            lv: "🇱🇻", // Latvian
            nl: "🇳🇱", // Dutch
            no: "🇳🇴", // Norwegian
            pl: "🇵🇱", // Polish
            pt: "🇵🇹", // Portuguese
            ro: "🇷🇴", // Romanian
            ru: "🇷🇺", // Russian
            sr: "🇷🇸", // Serbian
            so: "🇸🇴", // Somali
            es: "🇪🇸", // Spanish
            en: "🇬🇧", // English
            ta: "🇱🇰🇮🇳🇸🇬", // Tamil, flag of Sri Lanka, India and Singapore
            bn: "🇧🇩", // Bengali
            sv: "🇸🇪", // Swedish
            tr: "🇹🇷", // Turkish
            uk: "🇺🇦", // Ukrainian
            vi: "🇻🇳", // Vietnamese
            cym: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" // Welsh
        };
        return languageFlags[languageCode] || "";
    }

    return <span style={{ margin: '0.5em' }}>{getFlagEmoji(languageCode)}</span>;
}

export default CountryFlags;
