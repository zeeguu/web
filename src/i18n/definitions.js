import LocalizedStrings from "localized-strings";
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
      myClasses: "My Classes",
      myTexts: "My Texts",
      tutorials: "Help",
      login: "Sign in",
      email: "Email",
      name: "Name",
      learnedLanguage: "Learned Language",
      plsProvideValidEmail: "Please provide a valid email.",
      resetYourPassword: "reset your password",
      resetPassword: "Reset Password",
      code: "Code",
      interest: "interest",
      addTexts: "Add Texts",
      delete: "Delete",
      cancel: "Cancel",
      joinClass: "Join Class",
      youHaveNotJoinedAClass: "You haven't joined a class yet.",

      //LoadingAnimation
      loadingMsg: "Loading...",

      //Sidebar
      teacherSite: "Teacher site",
      studentSite: "Student site",
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
      passwordChangedSuccessfullyMsg:
        "Your password has been changed successfully.",
      youCanGoTo: "You can go to ",
      now: " now.",
      plsCheck: "Please check ",
      forCode: " for the one-time code we sent you.",
      codeReceived: "Code received via email",
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
      backToEditing: "Back to editing",
      saveOwnCopy: "Save own copy",

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

      //TagsOfInterests
      addPersonalInterest: "Add a personal interest",

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

      //ButtonInput
      check: "Check",
      hint: "Hint",

      //ButtonFeedback
      speak: "Speak",
      next: "Next",

      //Settings
      nativeLanguage: "Native Language",
      yourCurrentClassIs: "Your current class is: ",
      changeClassbtn: "Change class",
      insertNewInviteCode: "Insert new invite code",
      insertInviteCode: "Insert invite code",
      checkIfInviteCodeIsValid:
        "Something went wrong. Please check that the invite code is valid and try again.",

      //_ActivityInsightsRouter
      learningActivities: "Learning Activities",
      reading: "Reading",
      backToClassroom: "Back To Classroom",

      //AddTextOptionTypes
      articleFromZeeguuToClass: "Assign an article from Zeeguu to a class",
      copyPasteArticleToClass: "Copy/paste content or type your own text",
      urlUploadToClass: "Use a URL-address",

      //AddToCohortDialog
      chooseClass: "Choose one or more classes",
      saveChanges: "Save changes",

      //AddURLDialog
      addTextFromWebpage: "Add text from a webpage",
      insertUrl: "Insert the url address of the text you wish to add",
      pleaseNote: "Please note: ",
      textNotExtracted: "Texts cannot be extracted from all webpages.",
      editTheSavedText:
        "So you might have to edit or delete the text, we save for you.",
      nothingInInputField:
        "You haven't typed in an URL-address in the input field.",
      saveAndEdit: "Save and edit",

      //AllTexts
      addText: "Add Text",
      noTextAddedYet: "You have not added any texts of your own yet.",

      //AttemptIcons
      incorrectAttemptIconExplanation:
        "indicates that the student made an incorrect attempt at solving the exercise.",
      correctExerciseIconExplanation:
        "indicates that the student solved the exercise correctly.",
      hintInExerciseIconExplanation:
        "indicates that the student asked for a hint in the exercise.",
      askedForSolutionInExercise:
        "indicates that the student asked to see the solution to the exercise.",
      studentExerciseFeedback: "Too hard/Too easy/Bad example etc.",
      exerciseFeedbackFromStudent:
        "is feedback that the student has given on the exercise.",
      typeOfExerciseIconExplanation:
        "is the type of exercise the student has practised the word in.",

      //CohortForm
      editClass: "Edit Class",
      createClass: "Create Class",
      classroomLanguage: "Classroom Language",
      errorInviteCode:
        "Something went wrong. Maybe the invite code is already in use.",
      errorEmptyInputField: "You must fill out all the input fields.",
      removeFromList: "Remove from list",

      //CohortFormInputFields
      chooseClassName: "Choose the class name (max. 20 characters)",
      classnameTooLong: "The class name is too long.",
      createInviteCode: "Create any invite code you like (max. 20 characters)",
      invitecodeTooLong: "The invite code is too long.",

      //CohortItemCard
      seeStudents: "See Students",

      //CohortList
      addClass: "Add Class",

      //DeleteCohortWarning
      dangerzone: "Danger Zone!",
      deleteCohortEnsurance:
        "Are you sure you want to delete this class? This cannot be undone.",
      cannotDeleteClassWithText:
        "Something went wrong. If you still share texts with this class, you cannot remove it from your list. Please, check that in 'My texts' and try again.",

      //DeleteStudentWarning
      wishToDeleteStudent: "Do you wish to remove",
      fromTheClass: "from the class?",
      howStudentsRejoinClass:
        "Students can rejoin the class if you give them the invite code again.",
      remove: "Remove",

      //DeleteTextWarning
      deleteTextWarning: "You are about to delete your text",
      confirmDeleteText:
        "Please confirm that you wish to delete the text or press 'Cancel'.",

      //EditText
      editText: "Edit Text",
      viewAsStudent: "View as student",
      addToClass: "Add to class",
      saveText: "Save Text",

      //EditTextInputFields
      defineLanguage: "Please, define the language of the text",
      pasteTitleHere: "Paste or type your title here...",
      clickToChangeTitle: "Click in the box below to edit the title",
      pasteBodyHere: "Paste or type the body of your text here...",
      clickToChangeBody: "Click in the box below to edit the text body",

      //HowToAddStudentsInfo
      addStudents: "Add Students",
      shareInviteCode:
        "Share this code with your students to invite them to the class: ",
      invitecodeInformation:
        "Students will not appear in the class until they have signed up for Zeeguu and used the invite code.",
      goToClass: "Go to class",

      //LanguageSelector
      chooseLanguage: "Choose a language...",

      //NoStudents
      noStudentsInClass: "There are no students in this class yet.",
      shareTheInviteCode: "Share the invite code",
      shareInviteCodeContinued: "with them,",
      soTheStudentCanJoinClass: "so they can sign up and join the classroom.",

      //PractisedWordsCard
      practisedWords: "Practised words",
      timeSpendOnExercises: "time spent on exercises",
      numberOfWords: "number of words",
      solvedOnFirstAttempt: "solved on 1st attempt",

      //ReadingInsightAccordion
      readingDate: "Read: ",

      //ReadingInsightHeader
      title: "Title",
      textLevel: "Text level",
      textLength: "Text length",
      readingTime: "Reading time",
      translatedWords: "Translated words",

      //StudentInfoLine
      textsRead: "texts read",
      exercisesCompleted: "exercises completed",

      //StudentInfoLineHeader
      studentName: "Student name",
      readingExerciseTime: "Reading/Exercise time",
      average: "Average",
      lengthOfText: "text length",
      levelOfText: "text level",
      exercisesCorrect: "Exercises correct ",
      onFirstAttempt: "on 1st attempt",

      //StudentReadingInsights
      studentHasRead: " has read ",
      textsInTheLastPeriod: " texts in the last ",
      studentHasNotReadAnyArticles: "The student hasn't read any articles in",

      //StudentsActivityOverview
      backToClasses: "Back to all classes",

      //StudentTextView
      viewText: "View Text",

      //StudentTranslations
      translatedWordsInSentence:
        "Translated words in the context of their sencences",
      translatedWordInText: "The student translated no words in this text.",

      //TeacherTextPreview
      shareTextWithClasses:
        "Remember to share this text with one or more classes.",
      addedTo: "Added to: ",

      //TimeSelector
      changeTimePeriod: "Change the time period",

      //TimeSelectorHelperMap
      oneWeek: "1 week",
      twoWeeks: "2 weeks",
      oneMonth: "1 month",
      sixMonths: "6 months",
      oneYear: "1 year",

      //TutorialItemCard
      tutorialComingSoon: "This video tutorial is coming soon...",

      //Tutorials
      howToAddAndEditClass: "How to add and edit a class...",
      howToDeleteClass: "How to delete a class...",
      howToAddStudent: "How to add students...",
      howToDeleteStudents: "How to delete students...",
      howToAddText: "How to add a text...",
      howToEditAndDeleteText: "How to edit or delete a text...",
      howToShareText: "How to share texts with your class/classes...",
      howToExplainZeeguuData: "The data you can find in Zeeguu explained...",

      //ViewMoreLessButton
      viewMoreBtn: "View more",
      viewLessBtn: "View less",

      //WordsDropDown
      wordsTranslatedButNotInZeeguu:
        "Words translated by the student but not studied in Zeeguu",
      wordsTranslatedAndLearned:
        "Word practised correctly on four different days",
      wordsTranslatedAndExercised:
        "Practised words - translated and exercised by the student",

      //StudentExercisesInsights
      hasCompleted: " has completed ",
      exercisesInTheLast: " exercises in the last ",
    },

    da: {
      //Shared
      words: "Ord",
      articles: "Tekster",
      save: "gem",
      settings: "Indstillinger",
      exercises: "Øvelser",
      myClasses: "Mine klasser",
      myTexts: "Mine tekster",
      tutorials: "Hjælp",
      login: "Log ind",
      email: "Email",
      name: "Navn",
      learnedLanguage: "Sprog, du vil lære",
      plsProvideValidEmail: "Angiv venligst en gyldig email.",
      resetYourPassword: "nulstille dit kodeord",
      resetPassword: "Nulstil kodeord",
      code: "Kode",
      interest: "interesse",
      addTexts: "Tilføj tekster",
      delete: "Slet",
      cancel: "Annuller",
      joinClass: "Deltag i klasse",
      youHaveNotJoinedAClass: "Du er endnu ikke tilmeldt en klasse.",

      //LoadingAnimation
      loadingMsg: "Loader...",

      //Sidebar
      teacherSite: "Lærersiden",
      studentSite: "Elevsiden",
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
      thatWeStore: ", vi gemmer om dig er ",
      nameAndEmail: "det navn og den email",
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
        "Vi vil muligvis dele den anonymiserede interaktionsdata med andre forskere, da denne kan være vigtigere end algoritmer for forskningen.",

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
      passwordChangedSuccessfullyMsg: "Din kode er blevet ændret.",
      youCanGoTo: "Du kan gå til ",
      now: " nu.",
      plsCheck: "Vi har sendt en engangskode til: ",
      forCode: "",
      codeReceived: "Engangskoden fra mailen",
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
      backToEditing: "Tilbage til redigering",
      saveOwnCopy: "Gem egen kopi",

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
      correctOn: "Korrekt på: ",

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

      //ButtonInput
      check: "Tjek",
      hint: "Hint",

      //ButtonFeedback
      speak: "Udtale",
      next: "Næste",

      //Settings
      nativeLanguage: "Modersmål",
      yourCurrentClassIs: "Din nuværende klasse er: ",
      changeClassbtn: "Ændre klasse",
      insertNewInviteCode: "Indsæt ny invitationskode",
      insertInviteCode: "Indsæt invitationskode",
      checkIfInviteCodeIsValid:
        "Something went wrong. Please check that the invite code is valid and try again.",

      //_ActivityInsightsRouter
      learningActivities: "Læringsaktiviteter",
      reading: "Læsning",
      backToClassroom: "Tilbage til klasseværelset",

      //AddTextOptionTypes
      articleFromZeeguuToClass: "Tilføj en artikel fra Zeeguu til en klasse",
      copyPasteArticleToClass: "Kopier/indsæt tekst, eller skriv din egen",
      urlUploadToClass: "Brug en URL-addresse",

      //AddToCohortDialog
      chooseClass: "Vælg en eller flere klasser",
      saveChanges: "Gem ændringer",

      //AddURLDialog
      addTextFromWebpage: "Tilføj tekst fra en hjemmeside",
      insertUrl: "Indsæt url-adressen på den tekst, du ønsker at tilføje",
      pleaseNote: "Bemærk venligst: ",
      textNotExtracted:
        "Det er ikke alle hjemmesider, hvorfra teksten kan udvindes.",
      editTheSavedText:
        "Så du bliver muligvis nødt til at redigere eller slette den tekst, vi gemmer til dig.",
      nothingInInputField:
        "Du mangler at indsætte en URL-adresse i feltet ovenfor.",
      saveAndEdit: "Gem og rediger",

      //AllTexts
      addText: "Tilføj tekst",
      noTextAddedYet: "Du har ikke tilføjet nogle af dine egne tekster endnu.",

      //AttemptIcons
      incorrectAttemptIconExplanation:
        "indikerer, at eleven gjorde et forkert forsøg på at løse øvelsen.",
      correctExerciseIconExplanation:
        "indikerer, at eleven løste øvelsen korrekt.",
      hintInExerciseIconExplanation:
        "indikerer, at eleven bad om et tip i løbet af øvelsen.",
      askedForSolutionInExercise:
        "indikerer, at eleven bad om at se løsningen på øvelsen.",
      studentExerciseFeedback: "For svær/For nem/Dårligt eksempel.",
      exerciseFeedbackFromStudent: "er elevens feedback, af øvelsen.",
      typeOfExerciseIconExplanation:
        "er den type øvelse, hvor ordet, som eleven har øvet, er i.",

      //CohortForm
      editClass: "Rediger klasse",
      createClass: "Opret en klasse",
      classroomLanguage: "Sprog i klasse",
      errorInviteCode:
        "Noget gik galt. Måske er invitationskoden allerede i brug. DEV BEMÆRKNING: Kan ikke slette klasse, som indeholder tekster.",
      errorEmptyInputField: "Venligst udfyld alle felter.",
      removeFromList: "Fjern fra liste",

      //CohortFormInputFields
      chooseClassName: "Angiv navnet på denne klasse (maks. 20 tegn)",
      classnameTooLong: "Klassenavnet er desværre for langt.",
      createInviteCode: "Opret en invitationskode (maks. 20 tegn)",
      invitecodeTooLong: "Invitationskoden er desværre for lang.",

      //CohortItemCard
      seeStudents: "Se elever",

      //CohortList
      addClass: "Tilføj klasse",

      //DeleteCohortWarning
      dangerzone: "Farezone!",
      deleteCohortEnsurance:
        "Er du sikker på, at du vil slette denne klasse? Du kan ikke fortryde.",
      cannotDeleteClassWithText:
        "Noget gik galt. Hvis du deler tekster med denne klasse, kan du ikke slette klassen. Fjern delte tekster med denne klasse i 'Mine tekster', og prøv igen.",

      //DeleteStudentWarning
      wishToDeleteStudent: "Ønsker du at fjerne",
      fromTheClass: "fra klassen?",
      howStudentsRejoinClass:
        "Elever kan tilføjes til klassen igen, ved at du giver dem invitationskoden.",
      remove: "Fjern",

      //DeleteTextWarning
      deleteTextWarning: "Du er igang med at slette din tekst",
      confirmDeleteText:
        "Bekræft venligst, at du vil slette teksten, eller tryk på 'Annuller'.",

      //EditText
      editText: "Rediger tekst",
      viewAsStudent: "Vis som var du elev",
      addToClass: "Tilføj til klasse",
      saveText: "Gem tekst",

      //EditTextInputFields
      defineLanguage: "Angiv venligst hvilket sprog teksten er på",
      pasteTitleHere: "Indsæt eller skriv tekstens titlen her...",
      clickToChangeTitle: "Klik i feltet nedenfor for at redigere titlen",
      pasteBodyHere: "Indsæt eller skriv selv tekstens brødteksten her...",
      clickToChangeBody: "Klik i feltet nedenfor for at redigere brødteksten",

      //HowToAddStudentsInfo
      addStudents: "Tilføj elever",
      shareInviteCode:
        "Del denne kode med dine elever for at invitere dem til klassen: ",
      invitecodeInformation:
        "Eleverne vil ikke blive vist i klassen før de har oprettet sig i Zeeguu og brugt invitationskoden til at blive en del af klassen.",
      goToClass: "Bliv ført til klassen",

      //LanguageSelector
      chooseLanguage: "Vælg sprog...",

      //NoStudents
      noStudentsInClass: "Der er ikke nogen elever i denne klasse endnu.",
      shareTheInviteCode: "Del invitationskoden",
      shareInviteCodeContinued: "med eleverne,",
      soTheStudentCanJoinClass:
        "så de kan oprette sig og blive en del af klassen.",

      //PractisedWordsCard
      practisedWords: "Øvede ord",
      timeSpendOnExercises: "tid brugt på øvelser",
      numberOfWords: "antal ord",
      solvedOnFirstAttempt: "løst ved 1. forsøg",

      //ReadingInsightAccordion
      readingDate: "Læst: ",

      //ReadingInsightHeader
      title: "Titel",
      textLevel: "Tekst niveau",
      textLength: "Tekst længde",
      readingTime: "Læsetid",
      translatedWords: "Oversatte ord",

      //StudentInfoLine
      textsRead: "læste tekster",
      exercisesCompleted: "gennemførte øvelser",

      //StudentReadingInsights
      studentHasRead: " har læst ",
      textsInTheLastPeriod: " tekster i en periode på ",
      studentHasNotReadAnyArticles:
        "Eleven har endnu ikke læst nogle tekster i",

      //StudentInfoLineHeader
      studentName: "Elevens navn",
      readingExerciseTime: "Læse/Øvelsestid",
      average: "Gennemsnitlig",
      lengthOfText: "tekst længde",
      levelOfText: "sværhedsgrad",
      exercisesCorrect: "Korrekt øvelse ",
      onFirstAttempt: "ved 1. forsøg",

      //StudentsActivityOverview
      backToClasses: "Tilbage til klasser",

      //StudentTextView
      viewText: "Vis tekst",

      //StudentTranslations
      translatedWordsInSentence:
        "Oversatte ord i kontekst af den sætning ordet indgår",
      translatedWordInText: "Eleven oversatte ingen ord i denne tekst.",

      //TeacherTextPreview
      shareTextWithClasses:
        "Husk at tilføj denne tekst til en eller flere klasser.",
      addedTo: "Tilføjet til: ",

      //TimeSelector
      changeTimePeriod: "Skift tidsperiode",

      //TimeSelectorHelperMap
      oneWeek: "1 uge",
      twoWeeks: "2 uger",
      oneMonth: "1 måned",
      sixMonths: "6 måneder",
      oneYear: "1 år",

      //TutorialItemCard
      tutorialComingSoon: "Denne video kommer snart...",

      //Tutorials
      howToAddAndEditClass: "Sådan tilføjes og redigeres en klasse...",
      howToDeleteClass: "Sådan slettes en klasse...",
      howToAddStudent: "Sådan tilføjes elever...",
      howToDeleteStudents: "Sådan slettes elever...",
      howToAddText: "Sådan tilføjes en tekst...",
      howToEditAndDeleteText: "Sådan redigeres eller slettes en tekst...",
      howToShareText: "Sådan deler du tekster med din klasse / dine klasser...",
      howToExplainZeeguuData: "De data, du kan finde i Zeeguu forklaret...",

      //ViewMoreLessButton
      viewMoreBtn: "Vis mere",
      viewLessBtn: "Vis mindre",

      //WordsDropDown
      wordsTranslatedButNotInZeeguu:
        "Ord oversat af eleven, men ikke inkluderet i øvelser",
      wordsTranslatedAndLearned: "Ord øvet korrekt på fire forskellige dage",
      wordsTranslatedAndExercised: "Øvede ord - oversat og øvet af eleven",

      //StudentExercisesInsights
      hasCompleted: " har gennemført ",
      exercisesInTheLast: " øvelser i en periode på ",
    },
  },
  {
    /* options */
  }
);

export default strings;
