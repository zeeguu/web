/*global chrome*/
const PREFERRED_LOCALES = {fr: "fr-FR", nl: "nl-NL", en: "en-US", es: "es-ES"};
const PREFERRED_VOICE_NAMES = {fr: ["Google", "Thomas", "Audrey", "Aurelie"]}

function voiceForLanguageCode(code, voices) {

    let specificCode = PREFERRED_LOCALES[code] ?? code;
    console.log(Date())
    console.log(specificCode);

    let languageVoices = voices.filter((x) => x.lang.startsWith(specificCode));
    console.log(languageVoices);

    let preferredLocaleNames = PREFERRED_VOICE_NAMES[code] || [];
    console.log(preferredLocaleNames);


    for (let i = 0; i < preferredLocaleNames.length; i++) {
        let preferredName = preferredLocaleNames[i];
        console.log("looking for... " + preferredName);
        let favoriteVoices = languageVoices.filter((x) => x.name.startsWith(preferredName));
        console.log(favoriteVoices);

        if (favoriteVoices.length > 0) {
            let voice = favoriteVoices [0];
            console.log(voice.name + " " + voice.lang);
            return voice;
        }
    }

    let voice = languageVoices[0];
    console.log(voice.name + voice.lang);
    return voice;
}

const ZeeguuSpeech = class {
    constructor(api, language) {
        this.api = api;
        this.language = language;
        this.runningFromExtension = true;

        this.pronunciationPlayer = new Audio();
        this.pronunciationPlayer.autoplay = true;

        // onClick of first interaction on page before I need the sounds
        // (This is a tiny MP3 file that is silent and extremely short - retrieved from https://bigsoundbank.com and then modified)
        this.pronunciationPlayer.src =
            "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

        if (
            typeof chrome !== "undefined" &&
            typeof chrome.runtime !== "undefined"
        ) {
            try {
                chrome.runtime.sendMessage({
                    type: "SPEAK",
                    options: {
                        text: "",
                        language: this.language,
                    },
                });
                // console.log("we're running from extension");
            } catch (error) {
                this.runningFromExtension = false;
            }
        } else {
            this.runningFromExtension = false;
        }

        const allVoicesObtained = new Promise(function (resolve, reject) {
            let voices = window.speechSynthesis.getVoices();
            if (voices.length !== 0) {
                resolve(voices);
            } else {
                window.speechSynthesis.addEventListener("voiceschanged", function () {
                    voices = window.speechSynthesis.getVoices();
                    resolve(voices);
                });
            }
        });

        allVoicesObtained.then(
            (voices) => (this.voice = voiceForLanguageCode(this.language, voices))
        );

    }

    speakOut(word) {
        if (this.runningFromExtension) {
            chrome.runtime.sendMessage({
                type: "SPEAK",
                options: {
                    text: word,
                    language: this.language,
                },
            });
        } else {
            if (this.language === "da") {
                return this.playFromAPI(this.api, word, this.pronunciationPlayer);
            } else {
                var utterance = new SpeechSynthesisUtterance(word);
                utterance.voice = this.voice;
                speechSynthesis.cancel();
                speechSynthesis.speak(utterance);
            }
        }
    }

    playFullArticle(articleInfo, api, player) {
        return new Promise(function (resolve, reject) {
            api.getLinkToFullArticleReadout(
                articleInfo,
                articleInfo.id,
                (linkToMp3) => {
                    console.log("about to play..." + linkToMp3);
                    player.src = linkToMp3;
                    player.autoplay = true;
                    player.onerror = reject;
                    player.onended = resolve;
                }
            );
        });
    }

    playFromAPI(api, word, player) {
        return new Promise(function (resolve, reject) {
            api.getLinkToDanishSpeech(word, (linkToMp3) => {
                player.src = linkToMp3;
                player.autoplay = true;
                player.onerror = reject;
                player.onended = resolve;
            });
        });
    }
};

export default ZeeguuSpeech;
