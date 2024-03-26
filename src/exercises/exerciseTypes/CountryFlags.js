import { create } from "@mui/material/styles/createTransitions";
import React from "react";

function CountryFlags({ languageCode }) {

    function createFlagImage(country, altText){
        return <img src={`/static/flags/${country}.png`} alt={`${altText}`} style={{height: '1em', width: '1em'}} />
    }
    function getFlagEmoji(languageCode) {
        const languageFlags = {
            sq: createFlagImage('albania', 'Albanian flag'),
            ar: createFlagImage('egypt', 'Egyptian'), //Arabic, flag of Egypt, since it's the most commonly taught variant
            bn: createFlagImage('bangladesh', 'Bengali'),
            "zh-CN": createFlagImage('china', 'Chinese'),
            da: createFlagImage('denmark', 'Danish'),
            nl: createFlagImage('netherlands', 'Dutch'),
            es: createFlagImage('spain', 'Spanish'),
            en: createFlagImage('uk', 'United Kingdom'),
            fr: createFlagImage('france', 'French'),
            de: createFlagImage('germany', 'German'),
            el: createFlagImage('greece', 'Greek'),
            hu: createFlagImage('hungary', 'Hungarian'),
            ind: createFlagImage('indonesia', 'Indonesian'),
            it: createFlagImage('italy', 'Italian'),
            ku: createFlagImage('kurdish-flag', 'Kurdish'),
            ja: createFlagImage('japan', 'Japanese'),
            lv: createFlagImage('latvia', 'Latvian'),
            no: createFlagImage('norway', 'Norwegian'),
            pl: createFlagImage('poland', 'Polish'),
            pt: createFlagImage('portugal', 'Portuguese'),
            ro: createFlagImage('romania', 'Romanian'),
            ru: createFlagImage('russia', 'Russian'),
            sr: createFlagImage('serbia', 'Serbian'),
            so: createFlagImage('somalia', 'Somali'),
            ta: [
                createFlagImage('srilanka', 'Tamil Sri Lanka'),
                createFlagImage('india', 'Tamil India'),
                createFlagImage('singapore', 'Tamil Singapore')
            ], // Tamil, flags of Sri Lanka, India, and Singapore
            sv: createFlagImage('sweden', 'Swedish'),
            tr: createFlagImage('turkey', 'Turkish'),
            uk: createFlagImage('ukraine', 'Ukrainian'),
            ur: createFlagImage('pakistan', 'Urdu'),
            vi: createFlagImage('vietnam', 'Vietnamese'),
            cym: createFlagImage('wales', 'Welsh')
        };
        return languageFlags[languageCode] || "";
    }

    return <span style={{ margin: '0.5em' }}>{getFlagEmoji(languageCode)}</span>;
}

export default CountryFlags;
