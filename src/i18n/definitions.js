import LocalizedStrings from "localized-strings";
import { now } from "moment";
/* You find the definitions under the component in which they are rendered.
Definitions that are rendered in multiple components are under "Shared". */
let strings = new LocalizedStrings(
  {
    en: {
      //Shared
      words: "Words",
      articles: "Texts",
      save: "save",
      settings: "Settings",
      exercises: "Exercises",
      login: "Sign in",
      email: "Email",
      name: "Name",
      learnedLanguage: "Learned Language",
      plsProvideValidEmail: "Please provide a valid email.",
      resetYourPassword: "reset your password",
      resetPassword: "Reset Password",
      code: "Code",

      //LoadingAnimation
      loadingMsg: "Loading...",

      //Sidebar
      teacherSite: "Teacher site",
      logout: "Logout",

      //CreateAccount
      nameIsRequired: "Name is required.",
      learnedLanguageIsRequired: "Learned language is required.",
      languangeLevelIsRequired: "Language level is required.",
      plsSelectBaseLanguage: "Please select a base language.",
      passwordMustBeMsg: "Password should be at least 4 characters long.",
      createAccount: "Create Account",
      thankYouMsgPrefix:
        "Thanks for being a beta-tester. We really want to hear from you at",
      thankYouMsgSuffix: ". Contact us also if you don't have an invite code.",
      inviteCode: "Invite Code",
      levelOfLearnedLanguage: "Level in Learned Language",
      baseLanguage: "Base languange",

      //PrivacyNotice
      privacyNotice: "Privacy Notice",
      zeeguuIsAReaserchProject:
        "Zeeguu is a research project. Our goal is to discover ways in which learning a foreign language is more fun.",
      the: "The ",
      onlyPersonalInfo: "only personal information",
      thatWeStore: " that we store about you is the ",
      nameAndEmail: "name and email",
      restOfPersonalInfoMsg:
        "you provide on this page. We do not share it with anybody. We need it to send you a reset password code, important announcements about the platform, and possibly a survey at some point.",
      weStore: "We store ",
      anonymizedData: "anonymized data",
      aboutYour: " about your ",
      interaction:
        "interactions with foreign language texts and vocabulary exercises",
      togetherWithThe: " together with the ",
      times: "times of these interactions",
      restOfDataStorageInfoMsg:
        ". They help us estimate the words you know, the ones you should learn, recommend texts, and approximate time spent studying.",
      weMightMakeDataAvailableInfo:
        "        We might make the anonymized interaction data available for other researchers too. In research, data can be even more important than algorithms.",

      //Signin
      password: "Password",
      alternativelyYouCan: "Alternatively, you can",
      createAnAccount: "create an account",
      or: "or",

      //ResetPasswordStep1
      weNeedTheEmailMsg:
        "To do this we need the email that you registered with us.",
      //ResetPasswordStep2
      plsProvideCode: "Please provide a code.",
      somethingWentWrong: "Something went wrong!",
      youCanTryTo: "You can try to ",
      again: "again. ",
      orContactUsAt: "Or contact us on ",
      success: "Success!",
      passwordChangedSuccessfullyMsg:"Your password has been changed successfully.",
      youCanGoTo: "You can go to ",
      now: " now.",
      plsCheck: "Please check ",
      forCode: " for the one-time code we sent you.",
      codeReceived:"Code received via email",
      newPassword: "New Password",
      setNewPassword: "Set New Password",

      //LandingPage
      projectDescription_UltraShort:
        "A research project aiming to personalize reading and vocabulary practice in foreign languages",
      betaTester: "Become a Betatester!",
      howDoesItWork: "How Does It Work?",
      personalizedRecommandations: "Personalized Recommendations",
      personalizedRecommandationsEllaboration1:
        "Our system continuously searches the net for texts based on your personalized interests. We believe that personally relevant texts will motivate you to study more.",
      personalizedRecommandationsEllaboration2:
        'Moreover, we aim to help you to find texts that are at the right difficulty level since you learn best when materials are challenging but not too difficult (this is what is called "studying in the zone of proximal development").',
      easyTranslations: "Easy Translations",
      easyTranslationsEllaboration1:
        "If a text is challenging it will also include words that you don't understand.",
      easyTranslationsEllaboration2:
        "By using machine translation our system helps you obtain translations in any text with a simple click (or tap on touch-enabled devices).",
      easyTranslationsEllaboration3:
        "The system also provides word pronunciation support. For some languages, e.g. Danish, this is actually very important.",
      personalizedPractise: "Personalized Practice",
      personalizedPractiseEllaboration1:
        "Zeeguu generates personalized vocabulary exercises by using the original context in which you encountered words that you didn't understand. We do this because contextual learning works better.",
      personalizedPractiseEllaboration2:
        "Spaced repetition algorithms optimize your practice. Moreover, if you have limited time, our algorithms will prioritize frequent words in your exercises.",

      //News
      news: "News",
      jan: "Jan",
      feb: "Feb",
      may: "May",
      jul: "Jul",
      aug: "Aug",
      sep: "Sep",
      oct: "Oct",
      dec: "Dec",
      pernilleObtainsFundingPrefix:
        "Pernille Hvalsoe obtains funding from The Danish Agency for International Recruitment and Integration for a ",
      pernilleObtainsFundingLinkTitle:
        "project which uses Zeeguu to increase personalization",
      pernilleObtainsFundingSuffix: " in the Danish classroom",
      procrastinationPaper:
        "Paper using Zeeguu to teach vocabulary in moments of online procrastination accepted at CHI 2021 ",
      rotterdamStarts:
        "A highschool in Rotterdam starts using Zeeguu in their language classes",
      euroCall2020: "Workshop about Zeeguu at EuroCALL 2020",
      betaTesters40K:
        "The beta-testers of Zeeguu reach 40'000 distinct words practiced within the exercises",
      betaTesters100K:
        "The beta-testers of Zeeguu have reached 100'000 translations in their foreign language readings",
      amsterdamStarts:
        "A highschool in Amsterdam starts using Zeeguu in the French courses",
      euroCall2019: "Mircea talks about Zeeguu at EuroCALL 2019",
      asWeMayStudyPaper:
        "Paper about Zeeguu is accepted at CHI 2018 - the top international conference on HCI",
      groningenStarts:
        "Students at the Language Center from the University of Groningen use Zeeguu in their Dutch classes",
      gomarusStarts:
        "Students at the Gomarus College in Netherlands start using Zeeguu in their French classes",
      zeeguuIsReady: "Zeeguu is online and ready to welcome beta-testers",

      //Contributors
      contributors: "Contributors",

      //ArticleRouter
      findTab: "Find",
      classroomTab: "Classroom",
      bookmarkedTab: "Bookmarked",

      //WordsRouter
      yourWordsHeadline: "Your Words",
      history: "History",
      starred: "Starred",
      ranked: "Ranked",
      learned: "Learned",

      //WordsHistory
      titleTranslationHistory: "Translation History",
      starAWordMsg:
        "Star a word to ensure it appears in exercises. Delete to avoid it.",

      //ArticleReader
      translateOnClick: "translate on click",
      listenOnClick: "listen on click",
      source: "source",
      helpUsMsg:
        "Help us make Zeeguu even smarter by always letting us know whether you liked reading an article or not.",
      didYouEnjoyMsg: "Did you enjoy the article?",
      yes: "yes",
      no: "no",
      reviewVocabulary: "Review Vocabulary",
      reviewVocabExplanation:
        "Review your translations now to ensure better learning and ensure that you tell Zeeguu which of the words you want prioritize in your study.",

      //BookmarkButton
      addToBookmarks: "Add to bookmarks",
      removeFromBookmarks: "Remove from bookmarks",

      //SortingButtons
      sortBy: "Sort by:",
      difficulty: "Difficulty",

      //Interests
      interests: "Interests",
      nonInterests: "Non-interests",

      //SearchField
      searchAllArticles: "Search all articles",

      //Search
      searching: "Searching...",
      youSearchedFor: "You searched for: ",

      //ClassroomArticles
      noArticlesInClassroom: "There are no articles in your classroom.",

      //BookmarkedArticles
      noBookmarksYet: "You haven't bookmarked any articles yet.",

      //TagOfFilters
      addPersonalFilter: "Add a personal filter",

      //Learned
      titleLearnedWords: "Learned Words",
      learnedWordsAreMsg:
        "Learned words are words that were correct in exercises on four different days.",
      numberOfLearnedWordsMsg: "You have learned {0} words so far.",
      correctOn: "Correct on: ",

      //Starred
      titleStarredWords: "Starred Words",
      noStarredMsg: "You have no starred words yet.",

      //Top
      titleRankedWords: "Ranked Words",
      rankedMsg: "Words that you have translated ranked by importance.",

      //WordsOnDate
      open: "Open",

      //Exercises
      wordSourceDefaultText: "your past readings",
      wordSourcePrefix: "Words in",

      //FindWordsInContext
      findTheWordInContextHeadline: "Find the word in context",

      //FeedbackButtons
      giveFeedback: "Feedback on this Exercise",

      //ButtomInput
      check: "Check",
      hint: "Hint",

      //ButtomFeedback
      speak: "Speak",
      next: "Next",

      //Settings
      nativeLanguage: "Native Language",
    },

    da: {
      //Shared
      words: "Ord",
      articles: "Tekster",
      save: "gem",
      settings: "Indstillinger",
      exercises: "Øvelser",
      login: "Log ind",
      email: "Email",
      name: "Navn",
      learnedLanguage: "Sprog, du vil lære",
      plsProvideValidEmail: "Angiv venligst en gyldig email.",
      resetYourPassword: "nulstille dit kodeord",
      resetPassword: "Nulstil kodeord",
      code: "Kode",

      //LoadingAnimation
      loadingMsg: "Loader...",

      //Sidebar
      teacherSite: "Lærersiden",
      logout: "Log ud",

      //CreateAccount
      nameIsRequired: "Vi mangler et navn.",
      learnedLanguageIsRequired: 'Udfyld feltet "Sprog, du vil lære"',
      languangeLevelIsRequired:
        "Angiv niveauet af det sprog, du gerne vil lære.",
      plsSelectBaseLanguage: "Angiv, dit base sprog.",
      passwordMustBeMsg: "Kodeordet skal være mindst fire karakterer",
      createAccount: "Opret konto",
      thankYouMsgPrefix:
        "Tak fordi du vil være beta-tester. Du er altid velkommen til at kontakte os på: ",
      thankYouMsgSuffix:
        ". Du kan også kontakte os, hvis du mangler en invitationskode.",
      inviteCode: "Invitationskode",
      levelOfLearnedLanguage: "Niveau på dit læringssprog",
      baseLanguage: "Basesprog",

      //PrivacyNotice
      privacyNotice: "Fortrolighedserklæring",
      zeeguuIsAReaserchProject:
        "Zeeguu er et forskningsprojekt. Vores mål er at undersøge, hvordan man kan gøre det sjovere at lære et fremmedsprog.",
      the: "Den ",
      onlyPersonalInfo: "eneste personlige information",
      thatWeStore: ", vi gemmer om dig er det/den ",
      nameAndEmail: "navn og email",
      restOfPersonalInfoMsg:
        " du giver os på denne side. Vi deler ikke din email med nogen overhovedet. Vi har brug for den til at kunne sende kodeord, vigtig information om Zeeguu samt muligvis en brugerundersøgelse på et tidspunkt.",
      weStore: "Vi gemmer ",
      anonymizedData: "anonymiseret data",
      aboutYour: " om din ",
      interaction:
        " interaktion med fremmedsprogsteksterne og ordforrådsøvelserne",
      togetherWithThe: " sammen med ",
      times: "tidspunkterne for disse interaktioner",
      restOfDataStorageInfoMsg:
        ". Denne data hjælper os til at kunne estimere; hvilke ord du kender, hvilke du skal lærer, hvilke tekster vi skal anbefale, samt til cirka at kunne anslå, hvor meget tid der bliver brugt på læringen.",
      weMightMakeDataAvailableInfo:
        "Vi vil muligvis dele den anonymiserede interaktionsdata med andre forskere, da denne kan være vigtige end algoritmer for forskningen.",

      //Signin
      password: "Kodeord",
      alternativelyYouCan: "Alternativt kan du",
      createAnAccount: "oprette en konto",
      or: "eller",

      //ResetPasswordStep1
      weNeedTheEmailMsg:
        "Vi har brug for den email, du registrede hos os, for at nulstille kodeordet.",
      //ResetPasswordStep2
      plsProvideCode: "Angiv venligst engangskoden.",
      somethingWentWrong: "Noget gik galt!",
      youCanTryTo: "Du kan prøve at ",
      again: "igen.",
      orContactUsAt: "Ellers kan du kontakte os på: ",
      success: "Succes!",
      passwordChangedSuccessfullyMsg:"Din kode er blevet ændret.",
      youCanGoTo: "Du kan gå til ",
      now: " nu.",
      plsCheck: "Vi har sendt en engangskode til: ",
      forCode: "",
      codeReceived:"Engangskoden fra mailen",
      newPassword: "Nyt kodeord",
      setNewPassword: "Gem nyt kodeord",

      //LandingPage
      projectDescription_UltraShort:
        "Et forskningsprojekt på vej mod at tilpasse fremmedsprogslæsning og ordforrådstræning til den enkelte.",
      betaTester: "Bliv Betatester!",
      howDoesItWork: "Hvordan fungerer det?",
      personalizedRecommandations: "Personlige anbefalinger",
      personalizedRecommandationsEllaboration1:
        "Vores system søger løbende på nettet efter tekster baseret på dine personlige interesser. Vi mener, at personligt relevante tekster vil motivere dig til at studere mere.",
      personalizedRecommandationsEllaboration2:
        'Ydermere forsøger vi at finde tekster, der passer i sværhedsgrad. Det gør vi, fordi man lærer bedst, når materialet er udfordrende uden at være for svært. (Dette kaldes: "Læring i zonen for nærmeste udvikling").',
      easyTranslations: "Lette oversættelser",
      easyTranslationsEllaboration1:
        "Hvis en tekst er udfordrende, indeholder den også ord, du ikke forstår.",
      easyTranslationsEllaboration2:
        "Gennem maskinoversættelse hjælper vores system dig med at få oversættelser med et simpelt museklik (eller en skærmberøring på touch-skærme).",
      easyTranslationsEllaboration3:
        "Systemet giver også mulighed for at få hjælp til udtalen. For nogle sprog - som f.eks, dansk - er dette ganske vigtigt.",
      personalizedPractise: "Personlig træning",
      personalizedPractiseEllaboration1:
        'Zeeguu genererer personligt tilpassede ordforråds- øvelser ved at bruge den originale kontekst af dine "ikke-umiddelbart-forståede ord". Dette gør vi, fordi der er større udbytte af kontekstuel læring.',
      personalizedPractiseEllaboration2:
        "Algoritmer til regelmæssig gentagelse sikrer, at du får den bedst mulige ordforrådstræning. Hvis du har begrænset tid, vil algoritmerne priortere træningen af dine hyppigt anvendte ord.",

      //News
      news: "Nyheder",
      jan: "Jan",
      feb: "Feb",
      may: "Maj",
      jul: "Jul",
      aug: "Aug",
      oct: "Okt",
      sep: "Sep",
      dec: "Dec",
      pernilleObtainsFundingPrefix:
        "Pernille Hvalsoe modtager bevillinger fra Styrelsen for International Rekruttering og Integration til et ",
      pernilleObtainsFundingLinkTitle:
        "projekt som bruger Zeeguu til at øge individualiseringen af materialer",
      pernilleObtainsFundingSuffix: " i de danske klasseværelser.",
      procrastinationPaper:
        "Udgivelse om at bruge Zeeguu til ordforrådsundervisning i online overspringshandlinger bliver godkendt på CHI 2021 ",
      rotterdamStarts:
        "Et gymnasium i Rotterdam begynder at bruge Zeeguu i deres sprogundervisning.",
      euroCall2020: "Workshop om Zeeguu på EuroCALL 2020.",
      betaTesters40K:
        "Beta-testerne af Zeeguu når op på 40.000 forskellige ord trænet i øvelserne.",
      betaTesters100K:
        "Beta-testerne af Zeeguu har nået 100.000 oversættelser i deres fremmedsprogslæsning.",
      amsterdamStarts:
        "Et gymnasium Amsterdam begynder at bruge Zeeguu i deres franskundervisning.",
      euroCall2019: "Mircea taler om Zeeguu på EuroCALL 2019.",
      asWeMayStudyPaper:
        "Udgivelse om Zeeguu bliver godkendt på CHI 2018 - en stor international conference om HCI ",
      groningenStarts:
        "Studerende på sprogcenteret ved Groningen Universitet begynder at bruge Zeeguu i deres undervisning i hollandsk.",
      gomarusStarts:
        "Studerende på Gomarus Universitet i Holland begynder at bruge Zeeguu i deres franskundervisning.",
      zeeguuIsReady: "Zeeguu er online og klar til betatestere.",

      //Contributors
      contributors: "Bidragsydere",

      //ArticleRouter
      findTab: "Find",
      classroomTab: "Klasse",
      bookmarkedTab: "Bogmærker",

      //WordsRouter
      yourWordsHeadline: "Dine ord",
      history: "Oversatte",
      starred: "Stjernemarkerede",
      ranked: "Rangerede",
      learned: "Indlærte",

      //WordsHistory
      titleTranslationHistory: "Oversættelseshistorik",
      starAWordMsg:
        "Stjernemarkér et ord for at være sikker på, at det indgår i øvelserne. Delete ordet for at undgå øvelser med det.",

      //ArticleReader
      translateOnClick: "klik og oversæt",
      listenOnClick: "klik for udtale",
      source: "kilde",
      helpUsMsg:
        "Hjælp os med at gøre Zeeguu endnu bedre ved at fortælle os, om du kunne lide at læse artiklen eller ej.",
      didYouEnjoyMsg: "Kunne du lide artiklen?",
      yes: "ja",
      no: "nej",
      reviewVocabulary: "Gennemse ordforråd",
      reviewVocabExplanation:
        "Gennemse dine oversatte ord nu for at sikre bedre læring. Husk at fortælle Zeeguu hvilke ord, du gerne vil prioritere i din træning.",

      //BookmarkButton
      addToBookmarks: "Tilføj til bogmærker",
      removeFromBookmarks: "Fjern fra bogmærker",

      //SortingButtons
      sortBy: "Sorter efter:",
      difficulty: "Sværhedsgrad",

      //Interests
      interests: "Interesseret",
      nonInterests: "Uinteresseret",

      //SearchField
      searchAllArticles: "Søg i alle artikler",

      //Search
      searching: "Søger...",
      youSearchedFor: "Du søgte på: ",

      //ClassroomArticles
      noArticlesInClassroom: "Der er ingen artikler i denne klasse.",

      //BookmarkedArticles
      noBookmarksYet: "Du har endnu ingen bogmærker.",

      //TagOfFilters
      addPersonalFilter: "Tilføj et personligt filter",

      //TagsOfInterests
      addPersonalInterest: "Tilføj en personlig interesse",

      //Learned
      titleLearnedWords: "Indlærte ord",
      learnedWordsAreMsg:
        "Lærte ord er ord, der har været trænet korrekt i øvelser på fire forskellige dage.",
      numberOfLearnedWordsMsg: "Du har lært {0} ord indtil videre.",

      //Starred
      titleStarredWords: "Starred Words",
      noStarredMsg: "Du har ikke markeret nogen ord med stjerne endnu.",

      //Top
      titleRankedWords: "Rangerede ord",
      rankedMsg: "De ord, du har oversat, er rangeret efter vigtighed.",

      //WordsOnDate
      open: "Åben",

      //Exercises
      wordSourceDefaultText: "din tidligere læsning",
      wordSourcePrefix: "Ord fra",

      //FindWordsInContext
      findTheWordInContextHeadline: "Find ordet/ordene i sammenhængen",

      //FeedbackButtons
      giveFeedback: "Feedback på øvelsen",

      //ButtomInput
      check: "Tjek",
      hint: "Hint",

      //ButtomFeedback
      speak: "Udtale",
      next: "Næste",

      //Settings
      nativeLanguage: "Modersmål",
    },
  },
  {
    /* options */
  }
);

export default strings;
