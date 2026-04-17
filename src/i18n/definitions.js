import LocalizedStrings from "localized-strings";
/* You find the definitions under the component in which they are rendered.
Definitions that are rendered in multiple components are under "Shared". */
let strings = new LocalizedStrings(
  {
    en: {
      //Shared
      title: "Title",
      words: "Words",
      readingCompletion: "Completion",
      lengthWithCapital: "Length",
      levelWithCapital: "Level",
      articles: "Read",
      text: "Text",
      save: "Save",
      apply: "Apply",
      settings: "Settings",
      more: "More",
      wordHistoryTitle: "Word Translation History",
      exercises: "Exercise",
      dailyAudio: "Listen",
      translate: "Translate",
      today: "Today",
      pastLessons: "Past Lessons",
      topbarProgressDisplay: "Topbar Progress Display",
      myClasses: "My Classrooms",
      myTexts: "My Texts",
      tutorials: "Help",
      login: "Log In",
      register: "Register",
      getStarted: "Get Started",
      createAccount: "Create Account",
      createBetaAccount: "Create Beta Account",
      email: "Email",
      emailPlaceholder: "example@email.com",
      zeeguuTeamEmail: "zeeguu.team@gmail.com",
      name: "Name",
      fullName: "Full Name",
      fullNamePlaceholder: "First and last name",
      learnedLanguage: "I want to learn",
      languageSelectorPlaceholder: "Select language",
      plsProvideValidEmail: "Please provide a valid email.",
      plsAcceptPrivacyNotice: "Please accept Privacy Notice",
      password: "Password",
      passwordConfirm: "Confirm Password",
      passwordPlaceholder: "Enter password",
      passwordConfirmPlaceholder: "Re-enter password",
      passwordHelperText: "Must contain at least 4 characters",
      resetYourPassword: "reset your password",
      resetPassword: "Reset Password",
      forgotPassword: "Forgot Password?",
      alreadyHaveAccount: "Already have an account?",
      code: "Code",
      interest: "interest",
      addTexts: "Add Texts",
      delete: "Delete",
      cancel: "Cancel",
      joinClass: "Join Classroom",
      youHaveNotJoinedAClass: "You haven't joined a class yet.",
      titleLearnedWords: "Learned Words",
      tooEasy: "too easy",
      shareWithColleague: "Send to colleague",
      colleagueEmailExample: "eg. 'colleague@work.mail.com'",
      next: "Next",
      youCanChangeLater: "You can always change it later",
      yesPlease: "Yes, please",
      noThankYou: "No, thank you",

      //LoadingAnimation
      loadingMsg: "Loading...",

      //Sidebar
      teacherSite: "Teacher Site",
      studentSite: "Student Site",
      logout: "Logout",
      userDashboard: "Statistics",

      // User Dashboard:
      titleUserDashboard: "User Statistics",

      //Progress Items
      iconTextWeeklyArticles: "Weekly minutes read",
      iconTextWeeklyWordsTranslated: "Weekly words translated",
      iconTextWeeklyExercises: "Weekly exercises",
      iconTextDailyStreak: "Daily streak",

      iconTextTotalArticles: "Minutes read",
      iconTextTotalWordsTranslated: "Words translated",
      iconTextTotalWordsPracticed: "Words practiced",
      iconTextTotalWordsLearned: "Words learned",

      articlesReadTextStart: "You have read for",
      articlesReadWeeklyTextEnd: "minutes this week.",
      articlesReadWeeklyTextEndSingle: "minute this week.",
      articlesReadTotalTextEnd: "minutes in total since you started using Zeeguu.",
      articlesReadTotalTextEndSingle: "minute in total since you started using Zeeguu.",

      wordsTranslatedTextStart: "You have translated",
      wordsPracticedTextStart: "You have practiced",
      wordsLearnedTextStart: "You have learned",
      exercisesTextStart: "You have completed",
      exercisesTextEnd: "exercises this week.",
      exercisesTextEndSingle: "exercise this week.",

      wordsTextWeeklyEnd: "words this week.",
      wordsTextWeeklyEndSingle: "word this week.",
      wordsTextTotalEnd: "words in total since you started using Zeeguu.",
      wordsTextTotalEndSingle: "word in total since you started using Zeeguu.",

      streakTextStart: "You have been active every day for",
      streakTextStartSingle: "You have been active for",
      streakTextEnd: "days straight.",
      streakTextEndSingle: "day straight.",
      streakAsteriks: "",

      //Streak banner & milestones
      streakDay: "day",
      streakStreak: "streak",
      streakDayStreak: "day streak",
      streakMilestoneYear: "A whole year of learning!",
      streakMilestoneTripleDigits: "Triple digits!",
      streakMilestoneHalfway: "Halfway to 100!",
      streakMilestoneMonth: "A full month!",
      streakMilestoneTwoWeeks: "Two weeks strong!",
      streakMilestoneWeek: "A full week!",
      streakMilestoneAlmostWeek: "Almost a week!",
      streakMilestoneKeepGoing: "Keep it going!",
      streakMilestoneGreatStart: "Great start!",

      //Positive feedback
      positiveFeedbackMsg1: "You are doing great!",
      positiveFeedbackMsg2: "Keep up the good work!",
      positiveFeedbackMsg3: "You are on the right track!",
      positiveFeedbackMsg4: "You are making progress!",

      //CreateAccount
      nameIsRequired: "Name is required.",
      passwordMustBeMsg: "Password should be at least 4 characters long.",
      plsAcceptPrivacyPolicy: "You need to agree to our privacy notice.",
      thankYouMsgPrefix: "Thanks for being a beta-tester. We really want to hear from you at",
      thankYouMsgSuffix: ". Contact us also if you don't have an invite code.",
      inviteCode: "Invite Code",
      inviteCodePlaceholder: "Enter your invite code",
      levelOfLearnedLanguage: "My current level",
      levelOfLearnedLanguagePlaceholder: "Select level",
      baseLanguage: "I want translations in",
      baseLanguagePlaceholder: "Select Language",

      //Topbar preferences display
      progressIconPreferences: "Progress Icon Preferences",
      exercisesThisWeek: "Exercises this week",
      articlesReadThisWeek: "Articles read this week",
      dailyStreak: "Daily streak",

      //LanguagePreferences
      languagePreferences: "Language Preferences",
      learnedLanguageIsRequired: "Learned language is required.",
      languangeLevelIsRequired: "Language level is required.",
      plsSelectBaseLanguage: "Please select a base language.",

      //SelectInterests
      selectInterests: "Select Interests",

      //ExcludeWords
      excludeWords: "Exclude Words",
      excludedKeywords: "Excluded Keywords",
      addUnwantedWordHelperText: "Add one unwanted word or phrase at a time",
      unwantedWordPlaceholder: "E.g. robbery",

      //PrivacyNotice
      privacyNotice: "Privacy Notice",
      zeeguuIsAResearchProject:
        "Zeeguu is a research project. Our goal is to discover ways in which learning a foreign language is more fun and more effective.",
      the: "The ",
      onlyPersonalInfo: "only personal information",
      thatWeStore: " that we store about you is the ",
      nameAndEmail: "name and email",
      restOfPersonalInfoMsg:
        " you provide on this page. We will share your name and email only with your teacher if you are part of a class. We need your email to send you a reset password code, important announcements about the platform, and possibly a survey at some point.",
      weStore: "We store ",
      anonymizedData: "anonymized data",
      aboutYour: " about your ",
      interaction: "interactions with foreign language texts and vocabulary exercises",
      togetherWithThe: " together with the ",
      times: "times of these interactions",
      restOfDataStorageInfoMsg:
        ". This helps us estimate the words you know, the ones you should learn, recommend texts, and approximate time spent studying.",
      weMightMakeDataAvailableInfo:
        "We might make the anonymized interaction data available to other researchers too. In research, data can be even more important than algorithms.",

      //Signin
      dontHaveAnAccount: "Don't have an account?",
      createAnAccount: "create an account",
      or: "or",

      //ResetPasswordStep1
      weNeedTheEmailMsg: "To do this we need the email that you registered with us.",
      //ResetPasswordStep2
      plsProvideCode: "Please provide a code.",
      somethingWentWrong: "Something went wrong!",
      youCanTryTo: "You can try to ",
      again: "again. ",
      orContactUsAt: "Or contact us on ",
      success: "Success!",
      passwordChangedSuccessfullyMsg: "Your password has been changed successfully.",
      youCanGoTo: "You can go to ",
      now: " now.",
      plsCheck: "Please check ",
      forCode: " for the one-time code we sent you.",
      codeReceived: "Received Code",
      codeReceivedPlaceholder: "Enter The Code",
      newPassword: "New Password",
      newPasswordPlaceholder: "Enter New Password",
      setNewPassword: "Set New Password",
      rememberPassword: "Remember Password?",

      //InstallExtension
      installExtension: "Install Extension",
      iWillInstallLater: "I will install it later",
      installTheExtension: "Install the Extension",

      //ExtensionInstalled
      extensionInstalled: "Extension Installed",

      //LandingPage
      landingPage: "Landing Page",
      landingPageTitle: "Learn foreign languages while reading what you like",
      projectDescription_UltraShort: `Zeeguu is a research project that personalizes the way you learn foreign languages. It lets you read texts based on your interests, translate unfamiliar words, and practice vocabulary. On any device.`,
      betaTester: "Become a Betatester!",
      howDoesItWork: "How Does It Work?",
      personalizedReading: "Personalized Reading",
      personalizedRecommandationsEllaboration1:
        "Our system continuously searches the net for texts based on your personalized interests. We believe that personally relevant texts will motivate you to study more.",
      personalizedRecommandationsEllaboration2:
        'Moreover, we aim to help you to find texts that are at the right difficulty level since you learn best when materials are challenging but not too difficult (this is what is called "studying in the zone of proximal development").',
      easyTranslations: "Easy Translation & Pronunciation",
      easyTranslationsEllaboration1:
        "If a text is challenging it will also include words that you don't understand or don't know how to pronounce.",
      easyTranslationsEllaboration2:
        "By using machine translation our system helps you obtain translations in any text with a simple click (or tap on touch-enabled devices).",
      easyTranslationsEllaboration3:
        "The system also provides word pronunciation support. For some languages, e.g. Danish, this is actually very important.",
      personalizedExercises: "Personalized Exercises",
      personalizedPractiseEllaboration1:
        "Zeeguu generates personalized vocabulary exercises by using the original context in which you encountered words that you didn't understand. We do this because contextual learning works better.",
      personalizedMultipleExerciseTypes: " Different exercise types ensure that you do not get bored",
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
      moreThan1000Frenchies:
        "🇫🇷 More than 1000 users have used Zeeguu to study French by now! Together, they have interacted with more than 10.000 articles and translated more than 250.000 words. Trés bien, nos amis! 🎉",
      newsEmmaAndFrida:
        "Emma and Frida, 👩‍🎓👩‍🎓, release the cool new browser extension that cleans up the visual noise on news pages letting the reader focus on the text.",
      betaTesters200K:
        "📈 The beta-testers of Zeeguu have collectively reached 200'000 translations in their foreign language readings ",
      mirceaKeynoteAtEASEAI: "👨‍🏫 Mircea gives a keynote about Zeeguu at the ",
      pernilleObtainsFundingPrefix:
        "👩‍🔬 Pernille Hvalsoe obtains funding from The Danish Agency for International Recruitment and Integration for a ",
      pernilleObtainsFundingLinkTitle: "project which uses Zeeguu to study how to increase personalization",
      pernilleObtainsFundingSuffix: " in Danish language courses",
      procrastinationPaper:
        "Paper using Zeeguu to teach vocabulary in moments of online procrastination accepted at CHI 2021 ",
      rotterdamStarts: "A highschool in Rotterdam starts using Zeeguu in their language classes",
      euroCall2020: "Workshop about Zeeguu at EuroCALL 2020",
      betaTesters40K: "The beta-testers of Zeeguu reach 40'000 distinct words practiced within the exercises",
      betaTesters100K:
        "The beta-testers of Zeeguu have reached 100'000 translations in their foreign language readings",
      amsterdamStarts: "A highschool in Amsterdam starts using Zeeguu in the French courses",
      euroCall2019: "Mircea talks about Zeeguu at EuroCALL 2019",
      asWeMayStudyPaper: "Paper about Zeeguu is accepted at CHI 2018 - the top international conference on HCI",
      groningenStarts:
        "Students at the Language Center from the University of Groningen use Zeeguu in their Dutch classes",
      gomarusStarts: "Students at the Gomarus College in Netherlands start using Zeeguu in their French classes",
      zeeguuIsReady: "Zeeguu is online and ready to welcome beta-testers",

      //Contributors
      contributors: "Contributors",

      //ArticleRouter
      homeTab: "Home",
      recommended: "Recommended",
      classroomTab: "Classroom",
      bookmarkedTab: "Bookmarked",
      saved: "Saved",
      forYou: "For You",
      search: "Search",

      //WordsRouter
      yourWordsHeadline: "Your Words",
      activity: "Activity",
      myArticles: "My Articles",
      myWords: "My Words",
      myActivity: "My Activity",
      hidden: "Hidden",
      noHiddenArticles: "You have no hidden articles.",
      historyTab: "History",
      statisticsTab: "Statistics",
      starred: "Starred",
      learning: "In Learning",
      learned: "Learned",
      topWords: "Top Words",

      //WordsHistory
      titleTranslationHistory: "Translation History",
      starAWordMsg:
        "Star a word to ensure it appears in exercises. Delete to avoid it. Gray words don't appear unless starred.",

      // Home (Find Articles)
      titleHome: "Home",

      // Search Query (Find Articles)
      titleSearch: "Search",

      //FindArticles
      findArticles: "Find Articles",

      //ArticleReader
      translateOnClick: "translate on click",
      listenOnClick: "listen on click",
      reportBrokenArticle: "Report Broken Article",
      source: "source",
      helpUsMsg:
        "Help us make Zeeguu even smarter by always letting us know whether you liked reading an article or not.",
      didYouEnjoyMsg: "Did you enjoy the topic of the article?",
      answeringMsg: "Zeeguu can make better personalized recommendations based on your feedback.",
      yes: "Yes",
      no: "No",
      reviewVocabulary: "Review Vocabulary",
      reviewVocabExplanation:
        "Review your translations now to ensure better learning and ensure that you tell Zeeguu which of the words you want prioritize in your study.",
      backToEditing: "Back to editing",
      saveCopyToShare: "Save Copy to Share",

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
      searchAllArticlesAndVideos: "Search all articles and videos",

      //Search
      searching: "Searching...",
      youSearchedFor: "You searched for: ",
      NoSavedSearches: "You haven't saved any searches.",
      NoSearchMatch: "No articles found that match your search.",

      //ClassroomArticles
      noArticlesInClassroom: "There are no articles in your classroom.",

      noOwnArticles: "There are no own articles.",

      //RecommendedArticles
      noRecommendedArticles: "Like articles to get recommendations.",

      //BookmarkedArticles
      noBookmarksYet: "You haven't bookmarked any articles yet.",

      //TagOfFilters
      addPersonalFilter: "Add a personal filter",
      addExcludedKeyword: "Add an excluded keyword",

      //TagsOfInterests
      addPersonalInterest: "Add an interest keyword",

      //Learned
      learnedWordsAreMsg:
        "Learned words are words that were correct in exercises on all four levels.",
      numberOfLearnedWordsMsg: "You have learned {0} words so far.",
      correctOn: "Correct on: ",

      //Starred
      titleStarredWords: "Starred Words",
      noStarredMsg: "You have no starred words yet.",

      //Top
      titleRankedWords: "Most Important Words",
      rankedMsg:
        "The most important words that you translated. Ordered by frequency of occurrence in your learned language. To see all your past translations, go to History.",
      //To Learn
      titleToLearnWords: "Words to Learn",
      toLearnMsgLearningCycles:
        "These words have not yet been practiced in the exercises. Once you practice them for the first time they will be shown under Receptive.",
      toLearnMsg:
        "These words have not yet been practiced in the exercises. Once you practice them for the first time they will be shown under In Learning.",
      noToLearnWords: "You haven't practiced any words. Keep reading and translating to add words.",

      //Receptive
      titleReceptiveWords: "Receptive",
      receptiveMsg:
        "These words will appear in exercises testing your receptive knowledge. Receptive means you understand the word when you see or hear it, but can't necessarily use it yet.",
      noReceptiveWords: "You haven't practiced any words yet.",
      //Productive
      titleProductiveWords: "Productive",

      productiveMsg:
        "You already know these words receptively, so they will only appear in exercises testing your productive knowledge. Productive means you can use a word in writing or speech.",
      productiveDisableMsg:
        "You have disabled productive exercises. Words are now considered learned once they have completed the receptive learning cycle.",
      noProductiveWords: "You have no productive words at the moment.",

      //WordsOnDate
      open: "Open",

      //LearningCycle
      nextLearningCycle: "This word has now moved to your productive exercises.",
      wordLearned: "You've learned a new word!",
      receptiveTooltip:
        "This word is part of your receptive vocabulary knowledge. Receptive means the capability to comprehend a word when you hear or see it.",
      productiveTooltip:
        "This word is part of your productive vocabulary knowledge. Productive means the knowledge to use a word in writing or speech.",

      //CelebrationModal
      celebrationTitle: "Congratulations, you've learned a new word!",
      celebrationMsg:
        "You can now understand, use, and even write this word, so it won't be tested in the exercises anymore. Keep up the good work!",

      //WordEditAccordion
      deleteWord: "Delete Word",
      done: "Done",
      rememberToSubmit: 'Remember to click "Submit" in each accordion to save changes.',
      translation: "Translation",
      word: "Word",
      editWord: "Edit Word",
      expression: "Expression",
      editExpression: "Edit Expression",
      context: "Context",

      //WordsForArticle
      reviewTranslations: "Review Translations for Your Exercises ",
      from: "From: ",
      deleteTranslation: "Delete a translation if you don't want it to appear in exercises.",
      starTranslation: "Starred translations have priority in exercises.",
      ifGreyedTranslation:
        "Translations are grayed out because Zeeguu thinks they are not suitable for the exercises. Star them if you disagree.",
      theWordsYouTranslate: "The words you translate in the article will appear here for review",
      backToArticle: "Back to Article",
      toPracticeWords: "Practice These Words",

      //EmptyArticles
      noArticles:
        'We cannot find articles in the language you want to study and for your current interests. Consider changing your interests. Alternatively read articles with the help of the Zeeguu browser extension. You can also add articles to "My Texts" through the "Save article to Zeeguu.org" button from within the extension.',
      newssites: "Examples of some of the most popular news sites are:",

      //ExerciseType
      matchThreePairs: " match 3 pairs",
      pickTheWord: "pick the word",
      typeTheWord: "type the word",
      learnedOn: "Learned on:",
      orderWordsL1: "order words L1",
      orderWordsL2: "order words L2",
      multipleChoiceContext: "multiple choice context",
      multipleChoiceAudio: "multiple choice audio",
      multipleChoiceL1: "multiple choice L1",
      writeWhatYouHear: "write what you hear",
      translateL2toL1: "translate L2 to L1",
      translateWhatYouHear: "translate what you hear",
      clickInContext: "click in context",
      cloze: "gap-fill",

      studentFeedback: "Student feedback:",
      noType: "No type",
      orderWordsTipMessage: "You can click 'Hint ✔' at any time to get clues",
      orderWordsCorrectMessage: "Original sentence you read",
      orderWordsOnlyTwoMessagesShown: "Only the first 2 clues are shown",

      //Exercises
      titleExercises: "Exercises",
      wordSourceDefaultText: "your past readings",
      wordSourcePrefix: "Words in",
      goBackArticlePrefix: "Go back to reading: ",
      noTranslatedWords: "You have no words to practice at the moment",
      goToTextsToTranslateWords: "Read and translate words to get exercises.",
      goStarTranslations: "Go back and star translations for Zeeguu to include them in your exercises.",
      correctExercise1: "Well done!",
      correctExercise2: "Correct!",
      correctExercise3: "Good job!",
      solutionExercise1: "Check the solution!",
      solutionExercise2: "See the solution above!",
      newWordExercisesTooltip: "This is the first time you practice this word!",
      newExpressionExercisesTooltip: "This is the first time you practice this expression!",
      //LearnedWordsList
      studentHasNotLearnedWords: "The student has not learned any words yet.",

      //NonStudiedWordsList
      NoLoookedupWordsYet: "The student hasn't looked up any words yet.",

      //NonStudiedWordCard
      excludedByAlgorithm: "Excluded by algorithm",
      scheduledNotYetStudied: "Scheduled - not yet studied",

      //ExerciseHeadlines
      findTheWordInContextHeadline: "Find the word in the context below",
      findTheExpressionInContextHeadline: "Find the expression in the context below",
      chooseTheWordFittingContextHeadline: "Choose the alternative that fits the context",
      orderTheWordsToMakeTheHighlightedPhrase:
        "Order the words to make the highlighted phrase. Some words can be extra.",
      matchWordWithTranslation: "Match each word with its translation",
      audioExerciseHeadline: "Write the word your hear. Click to have it repeated!",
      multipleChoiceAudioHeadline: "Select the word which fits the context",
      findWordInContextClozeHeadline: "Translate the word to fit the context",
      translateL2toL1Headline: "Translate the highlighted word",
      translateWhatYouHearHeadline: "Translate the word you hear. Click to have it repeated!",
      multipleChoiceL2toL1Headline: "Select the correct translation of the highlighted word",
      clickWordInContextHeadline: "Click on the translation of the word below in the text",
      multipleChoiceContextHeadline: "Choose the context that fits the word",

      //FeedbackButtons
      dontShowThisWordAgain: "Don't show this word again",
      dontShowThisWordAgainAlert: "Please type your feedback before submitting.",
      giveFeedback: "Give Feedback",
      giveFeedbackAlert: "Please type your feedback before submitting.",
      selectWords: "Select the word(s):",
      selectWordsAlert: "Please select the word(s) for which you are providing feedback.",
      clickWords: "Click on the word(s) for which you are improving the translation:",
      otherFeedback: "Other reason:",
      sentFeedback1: "Feedback",
      sentFeedback2: "sent!",

      //FeedbackOptions
      bookmarkTooEasy: "Too Easy",
      bookmarkTooEasyTooltip: "I know this already! I don't need to practice it any longer.",
      iKnowThisWord: "I know this word",
      bookmarkTooHard: "Too Hard",
      bookmarkTooHardTooltip: "This is a little too difficult. I'd rather focus on simpler words for now.",
      dislike: "Thumb Down",
      imNotsure: "I'm not sure about this... And I'd rather not practice something that feels wrong.",
      nb: "NB:",
      youCanImprove: "You can improve the translation after finding/showing the solution. If you wish to do so, ",
      doNot: "do not",
      clickOnThisFeedbackButton: " click on this feedback button.",
      badContext: "Bad Context",
      badContextTooltip: "The context provided is bad. I can't figure out the solution with such bad context.",
      other: "Other",
      otherTooltip: "None of the other options apply. I would like to submit personalised feedback.",

      //ButtonInput
      undo: "Undo",
      confirm: "Confirm",
      reset: "Reset",
      check: "Check",
      hint: "Hint",
      showSolution: "Show solution",
      improveTranslation: "Improve Translation",
      corfirmReset: "Are you sure? This will reset all words.",
      swapInfo: "Click a word to swap, or click again to remove.",
      swapInfoPlaceholderToken: "This is a placeholder, click a word to swap.",
      disableAudio: "Can't use audio right now",

      //ButtonFeedback
      speak: "Speak",

      //ExerciseNavigation
      backToReading: "Back to Reading",
      goToReading: "Go to Reading",
      backToWords: "Back to Words",
      keepExercising: "Keep Practicing",
      startLearningNewWords: "Start Learning New Words",
      goToExercises: "Go to Exercises",

      //CongratulationsPage
      goodJob: "Good Job, ",
      correct: "You got the following words correct:",
      payMoreAttentionTo: "Pay more attention to these words:",
      wordsIncorrect: "Words you didn't get correct in exercises",
      wordsCorrect: "Words you got correct in exercises",

      //Settings
      //Settings categories
      myAccount: "My Account",

      accountManagement: "Account Management",

      //Settings main page nav options
      profileDetails: "Profile Details",
      languageSettings: "Language Settings",
      myClassrooms: "My Classrooms",
      exerciseTypePreferences: "Exercise Audio & Pronunciation",

      deleteAccount: "Delete Account",

      nativeLanguage: "I want translations in",
      yourCurrentClassIs: "Your current class is: ",
      changeClass: "Change Class",
      addClass: "Add Class",
      insertNewInviteCode: "Insert new invite code",
      insertInviteCode: "Insert invite code",
      checkIfInviteCodeIsValid: "Something went wrong. Please check that the invite code is valid and try again.",

      //CEFR_LEVELS
      beginner: "Beginner",
      elementary: "Elementary",
      intermediate: "Intermediate",
      upperIntermediate: "Upper Intermediate",
      advanced: "Advanced",
      proficiency: "Proficiency",
      beginnerDescription: "Can understand and use basic everyday expressions",
      elementaryDescription: "Can communicate in simple, routine situations",
      intermediateDescription: "Can handle most situations while travelling",
      upperIntermediateDescription: "Can interact fluently with native speakers",
      advancedDescription: "Can use language flexibly for social and professional purposes",
      proficiencyDescription: "Can understand virtually everything heard or read",

      //_ActivityInsightsRouter
      backTo: "Back to ",
      s_reading: "'s Reading",
      s_exercises: "'s Exercises",
      seeReading: "See Reading",
      seeExercises: "See Exercises",

      //AddTextOptionTypes
      articleFromZeeguuToClass: "Find an article in Zeeguu",
      copyPasteArticleToClass: "Copy/paste content or type your own text",
      urlUploadToClass: "Use a URL-address",

      //AddToCohortDialog
      chooseClass: "Choose one or more classes",
      saveChanges: "Save Changes",

      //AddURLDialog
      addTextFromWebpage: "Add text from a webpage",
      insertUrl: "Insert the url address of the text you wish to add",
      pleaseNote: "Please note: ",
      textNotExtracted: "Texts cannot be extracted from all webpages.",
      editTheSavedText: "So you might have to edit or delete the text, we save for you.",
      nothingInInputField: "You haven't typed in an URL-address in the input field.",
      saveAndEdit: "Save and edit",
      invalidUrl: "Something went wrong. The URL might be invalid.",

      //AllTexts
      addText: "Add Text",
      noTextAddedYet: "You have not added any texts of your own yet.",

      //AttemptIcons
      incorrectAttemptIconExplanation: "indicates that the student made an incorrect attempt at solving the exercise.",
      correctExerciseIconExplanation: "indicates that the student solved the exercise correctly.",
      hintInExerciseIconExplanation: "indicates that the student asked for a hint in the exercise.",
      askedForSolutionInExercise: "indicates that the student asked to see the solution to the exercise.",
      studentExerciseFeedback: "Too hard/Too easy/Bad example etc.",
      exerciseFeedbackFromStudent: "is feedback that the student has given on the exercise.",
      typeOfExerciseIconExplanation: "is the type of exercise the student has practised the word in.",
      pickTheWordOrMatchThreePairs: "Pick a word/Match 3 pairs etc.",
      tooHard: "too hard",
      badWord: "bad word",
      badExample: "bad example",
      dontShowAgain: "don't show again",
      starExplanation: "The asterisk next to the word indicates that the student has exercised the word at least once.",

      //CohortForm
      editClass: "Edit Class",
      createClass: "Create Class",
      classroomLanguage: "Classroom language",
      errorInviteCode: "Something went wrong. Maybe the invite code is already in use.",
      errorEmptyInputField: "You must fill out all the input fields.",

      //CohortFormInputFields
      chooseClassName: "Choose the class name (max. 20 characters)",
      classnameTooLong: "The class name is too long.",
      createInviteCode: "Create any invite code you like (max. 20 characters)",
      invitecodeTooLong: "The invite code is too long.",

      //CohortItemCard
      seeStudents: "See Students",
      teacher: "Teacher: ",
      teachers: "Teachers: ",
      addTeacher: "Add Teacher",

      //AddTeacherDialog
      addAnotherTeacherToTheClass: "Add another teacher to the class",
      addEmailOfColleague: "Add email of colleague",
      addTeacherWarningPartOne: "This adds the class to your colleague's list of classes.",
      addTeacherWarningPartTwo:
        "If you later delete this class, you also irreversibly delete the class from your colleague's list of classes.",
      youHaveToAddEmail: "You have to add the email of a teacher.",
      errorMsg:
        "Something went wrong. It can be that the email is not matching anyone in the system or a server error. Feel free to contact us if the error persists.",
      addColleague: "Add Colleague",

      //CohortList

      //DeleteCohortWarning
      dangerzone: "Danger Zone!",
      deleteCohortEnsurance: "Are you sure you want to delete this class? This cannot be undone.",
      cannotDeleteClassWithText:
        "Something went wrong. If you still share texts with this class, you cannot remove it from your list. Please, check that in 'My texts' and try again.",
      youAreSharingThisClassWarning:
        "You are sharing this class with at least one colleague. If you delete it here, you also irreversibly delete it from their list of classes.",

      //DeleteStudentWarning
      wishToDeleteStudent: "Do you wish to remove",
      fromTheClass: "from the class?",
      howStudentsRejoinClass: "Students can rejoin the class (in 'Settings') if you give them the invite code again.",
      remove: "Remove",

      //DeleteTextWarning
      deleteTextWarning: "You are about to delete your text",
      confirmDeleteText: "Please confirm that you wish to delete the text or press 'Cancel'.",

      //EditText
      editText: "Edit Text",
      saveText: "Save Text",

      //ShareTextWithColleagueDialog
      somethingWentWrongMostLikelyEmail:
        "Something went wrong. Most likely, the email is not registered in Zeeguu. Please, try a different one.",
      theConnectionFailed:
        "The connection to the server seems unstable at the moment. Please, let us know if this continues to happen.",
      enterEmailYourColleagueUse: "Enter the email, your colleague use for Zeeguu.",
      share: "Share",
      yourColleagueShouldHaveTheTextShortly:
        "Your colleague should be able to find the text under 'My Texts' in a moment.",
      ok: "OK",

      // New user created
      userCreated: "Welcome to Zeeguu",
      extensionDescription:
        "Here on zeeguu.org you can see your words, find article recommendation links, do exercises, see statistics, etc. You can also read, but only articles that were shared with you by your teacher, or articles that you have saved from the extension.",
      extensionFunctionality:
        "When you follow an article recommendation link, or you find an article on the net, you should activate the extension which:",
      extensionAdvantage1: "Offers you one-click translation and pronunciation",
      extensionAdvantage2: "Removes all excess clutter, like adverts, buttons, and videos from the article",
      extensionAdvantage3:
        "Generates personalized vocabulary exercises by using the original context in which you encountered words that you didn't understand.",

      //Extension installed
      goToZeeguuApp: "Go to Zeeguu",
      pinExtension: "Pin it to the toolbar to make it easy to access",
      congratulations: "Extension is installed!",

      //TooltipedButtons
      viewAsStudent: "View as Student",
      addToClass: "Share/unshare with class",
      saveTextBeforeViewAsStudent: "The text must be saved before you can view it as a student.",
      saveChangesBeforeViewAsStudent: "The changes must be saved before you can view the text as a student.",
      textMustBeSavedBeforeSharing: "The text must be saved before you can share it with your classes.",
      changesMustBeSavedBeforeSharing: "The changes must be saved before you can share the text with your classes.",

      //EditTextInputFields
      defineLanguage: "Language",
      pasteTitleHere: "Paste or type your title here...",
      clickToChangeTitle: "Title",
      pasteBodyHere: "Paste or type the body of your text here...",
      clickToChangeBody: "Content",

      //FormatedTime
      exactReadingTime: "Exact reading time:",
      exactExerciseTime: "Exact exercise time:",
      hours: "h ",

      //HowToAddStudentsInfo
      addStudents: "Add Students",
      shareInviteCode: "Share this code with your students to invite them to the class: ",
      invitecodeInformation:
        "Students will not appear in the class until they have signed up for Zeeguu and used the invite code (in their Settings) to join the class.",
      goToClass: "Go to Class",

      //LanguageSelector (both of them)
      chooseLanguage: "Choose a language...",
      german: "German",
      spanish: "Spanish",
      french: "French",
      dutch: "Dutch",
      english: "English",
      italian: "Italian",
      danish: "Danish",
      polish: "Polish",
      romanian: "Romanian",
      chinese: "Chinese",
      turkish: "Turkish",
      arabic: "Arabic",
      somali: "Somali",
      kurdish: "Kurdish",
      swedish: "Swedish",
      russian: "Russian",
      hungarian: "Hungarian",
      ukrainian: "Ukrainian",
      vietnamese: "Vietnamese",
      norwegian: "Norwegian",
      portuguese: "Portuguese",
      albanian: "Albanian",
      japanese: "Japanese",
      serbian: "Serbian",
      latvian: "Latvian",
      indonesian: "Indonesian",
      urdu: "Urdu",
      tamil: "Tamil",
      bengali: "Bengali",
      greek: "Greek",

      //NoStudents
      noStudentsInClass: "There are no students in this class yet.",
      shareTheInviteCode: "Share the invite code",
      shareInviteCodeContinued: "with them,",
      soTheStudentCanJoinClass: "so they can sign up and join the classroom.",

      //PractisedWordsCard
      practisedWords: "Practiced Words",
      timeSpendOnExercises: "Time spent on exercises",
      numberOfWords: "Number of words",
      solvedOnFirstAttempt: "Solved on 1st attempt",

      //PractisedWordsList
      noPractisedWordsYet: "The student has not practiced any words yet.",

      //StudentActivityDataCircleWrapper
      level: "level",
      lengthOnText: "length",
      time: "time",
      translated: "Translated",
      wordsWithLowercase: "words",
      readingTime: "Reading",

      //ReadingInsightAccordion
      readingDate: "Read: ",

      //StudentInfoLine
      textsRead: "texts read",
      exercisesCompleted: "exercises completed",
      avgText: "Avg. text",
      difficultyLowerCase: "difficulty",
      exercisesCorrectness: "Exercises correctness",
      textLengthExplanation: "Average length of the read texts",
      difficultyExplanation: "Average difficulty of the read texts",
      exercisesExplaination: "Exercises solved correctly on first attempt",

      //StudentInfoLineHeader
      textLevel: "level",
      studentName: "Student name",
      readingExerciseTime: "Reading/Exercise time",
      lengthOfText: "text length",
      levelOfText: "text level",
      exercisesCorrect: "Exercises correct ",
      onFirstAttempt: "on 1st attempt",

      //StudentReadingInsights
      studentHasRead: " has read ",
      textsInTheLastPeriod: " texts in the last ",
      studentHasNotReadAnyArticles: "The student hasn't read any articles in",

      //StudentsActivityOverview
      backToClasses: "Back to My Classes",

      //StudentsActivityOverviewContent
      customTextInTimeSelector: "This is the overview of the students' activities for the last",

      //StudentTextView
      viewText: "View Text",

      //StudentTranslations
      translatedWordsInSentence: "Translated words in the context of their sentences",
      translatedWordInText: "The student translated no words in this text.",

      //TeacherTextPreview
      shareTextWithClasses: "Remember to share this text with one or more classes.",
      addedTo: "Added to: ",

      //TimeSelector
      changeTimePeriod: "Change the time period",

      //TimeSelectorHelperMap
      oneWeek: "1 week",
      twoWeeks: "2 weeks",
      oneMonth: "1 month",
      sixMonths: "6 months",
      oneYear: "1 year",

      //Tutorials
      howToAddAndEditClass: "How to add a class",
      howToDeleteClass: "How to edit or delete a class",
      howToAddStudent: "How to add students",
      howToDeleteStudents: "How to delete students",
      howToAddTextUrl: "How to add a text using a URL",
      howToAddTextFromZeeguu: "How to add a text from Zeeguu",
      howToAddTextCopyPaste: "How to add a text by copy-pasting or writing text",
      howToEditAndDeleteText: "How to edit or delete a text",
      howToShareText: "How to share texts with your class/classes",
      howToExplainZeeguuData: "The data you can find in Zeeguu explained",
      howToUnderstandTextLevel: "How to understand the text level",

      //ViewMoreLessButton
      viewMoreBtn: "View more",
      viewLessBtn: "View less",

      //WordsDropDown
      wordsTranslatedButNotInZeeguu: "Words/sentences translated by the student but not studied in Zeeguu",
      wordsTranslatedAndLearned: "Words/sentences practiced correctly on four different days or tagged 'Too easy'",
      wordsTranslatedAndExercised: "Practiced words/sentences - translated and exercised by the student",

      //StudentExercisesInsights
      hasCompleted: " has completed ",
      exercisesInTheLast: " exercises in the last ",
      wordsNotStudiedInZeeguu: "Words Not Studied in Zeeguu",
      systemLanguage: "System Language",
    },

    da: {
      //Shared
      title: "Titel",
      words: "Ord",
      lengthWithCapital: "Længde",
      levelWithCapital: "Sværhed",
      articles: "Læs",
      text: "tekst",
      save: "Gem",
      settings: "Indstillinger",
      exercises: "Øv",
      dailyAudio: "Lyt",
      translate: "Oversæt",
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
      tooEasy: "for nem",
      shareWithColleague: "Del med kollega",
      colleagueEmailExample: "f.eks: 'kollega@arbejdsmail.dk'",

      //LoadingAnimation
      loadingMsg: "Loader...",

      //Sidebar
      teacherSite: "Lærersiden",
      studentSite: "Elevsiden",
      logout: "Log ud",
      userDashboard: "Statistik",

      //Progress Items
      iconTextWeeklyArticles: "Læste artikler pr. uge",
      iconTextWeeklyWordsTranslated: "Oversatte ord pr. uge",
      iconTextWeeklyExercises: "Øvelser pr. uge",
      iconTextDailyStreak: "Daglig streak",

      iconTextTotalArticles: "Læste artikler",
      iconTextTotalWordsTranslated: "Oversatte ord",
      iconTextTotalWordsPracticed: "Øvede ord",
      iconTextTotalWordsLearned: "Lærte ord",

      articlesReadTextStart: "Du har læst",
      articlesReadWeeklyTextEnd: "artikler i denne uge. Godt gået!",
      articlesReadTotalTextEnd: "siden du begyndte at bruge Zeeguu. Du klarer det godt!",

      wordsTranslatedTextStart: "Du har oversat",
      wordsPracticedTextStart: "Du har øvet",
      wordsLearnedTextStart: "Du har lært",
      exercisesTextStart: "Du har gennemført",
      exercisesTextEnd: "øvelser i denne uge.",
      exercisesTextEndSingle: "øvelse i denne uge.",

      wordsTextWeeklyEnd: "ord i denne uge. Du er godt i gang!",
      wordsTextTotalEnd: "siden du begyndte at bruge Zeeguu. Hvor er du god!",

      //Streak banner & milestones
      streakDay: "dag",
      streakStreak: "streak",
      streakDayStreak: "dages streak",
      streakMilestoneYear: "Et helt år med læring!",
      streakMilestoneTripleDigits: "Trecifret!",
      streakMilestoneHalfway: "Halvvejs til 100!",
      streakMilestoneMonth: "En hel måned!",
      streakMilestoneTwoWeeks: "To uger i træk!",
      streakMilestoneWeek: "En hel uge!",
      streakMilestoneAlmostWeek: "Næsten en uge!",
      streakMilestoneKeepGoing: "Bliv ved!",
      streakMilestoneGreatStart: "Flot start!",

      //CreateAccount
      nameIsRequired: "Vi mangler et navn.",
      learnedLanguageIsRequired: 'Udfyld feltet "Sprog, du vil lære"',
      languangeLevelIsRequired: "Angiv niveauet af det sprog, du gerne vil lære.",
      plsSelectBaseLanguage: "Angiv, dit base sprog.",
      passwordMustBeMsg: "Kodeordet skal være mindst fire karakterer",
      createAccount: "Opret konto",
      thankYouMsgPrefix: "Tak fordi du vil være beta-tester. Du er altid velkommen til at kontakte os på: ",
      thankYouMsgSuffix: ". Du kan også kontakte os, hvis du mangler en invitationskode.",
      inviteCode: "Invitationskode",
      levelOfLearnedLanguage: "Niveau på dit læringssprog",
      baseLanguage: "Basesprog",

      //PrivacyNotice
      privacyNotice: "Fortrolighedserklæring",
      zeeguuIsAResearchProject:
        "Zeeguu er et forskningsprojekt. Vores mål er at undersøge, hvordan man kan gøre det sjovere at lære et fremmedsprog.",
      the: "Den ",
      onlyPersonalInfo: "eneste personlige information",
      thatWeStore: ", vi gemmer om dig er ",
      nameAndEmail: "det navn og den email",
      restOfPersonalInfoMsg:
        " du giver os på denne side. Vi deler kun dit navn og din e-mail med din lærer. Vi har brug for din email til at kunne sende et nyt kodeord, vigtig information om Zeeguu samt muligvis en brugerundersøgelse på et tidspunkt.",
      weStore: "Vi gemmer ",
      anonymizedData: "anonymiseret data",
      aboutYour: " om din ",
      interaction: " interaktion med fremmedsprogsteksterne og ordforrådsøvelserne",
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
      weNeedTheEmailMsg: "Vi har brug for den email, du registrede hos os, for at nulstille kodeordet.",
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
      landingPage: "Forside",
      projectDescription_UltraShort:
        "Et forskningsprojekt på vej mod at tilpasse fremmedsprogslæsning og ordforrådstræning til den enkelte.",
      betaTester: "Bliv Betatester!",
      howDoesItWork: "Hvordan fungerer det?",
      personalizedRecommandations: "Personlige anbefalinger",
      personalizedRecommandationsEllaboration1:
        "Vores system søger løbende på nettet efter tekster baseret på dine personlige interesser. Vi mener, at personligt relevante tekster vil motivere dig til at studere mere.",
      personalizedRecommandationsEllaboration2:
        'Ydermere forsøger vi at finde tekster, der passer i sværhedsgrad. Det gør vi, fordi man lærer bedst, når materialet er udfordrende uden at være for svært. (Dette kaldes: "Læring i zonen for nærmeste udvikling").',
      easyTranslations: "Nem oversættelse og udtale",
      easyTranslationsEllaboration1:
        "Hvis en tekst er udfordrende, indeholder den også ord, du ikke forstår, eller ikke ved, hvordan man skal udtale.",
      easyTranslationsEllaboration2:
        "Gennem maskinoversættelse hjælper vores system dig med at få oversættelser med et simpelt museklik (eller en skærmberøring på touch-skærme).",
      easyTranslationsEllaboration3:
        "Systemet giver også mulighed for at få hjælp til udtalen. For nogle sprog - som f.eks, dansk - er dette ganske vigtigt.",
      personalizedPractise: "Personlig træning",
      personalizedPractiseEllaboration1:
        'Zeeguu genererer personligt tilpassede ordforråds- øvelser ved at bruge den originale kontekst af dine "ikke-umiddelbart-forståede ord". Dette gør vi, fordi der er større udbytte af kontekstuel læring.',
      personalizedMultipleExerciseTypes:
        "Forskellige typer øvelser medvirker desuden til, at du ikke kommer til at kede dig.",
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
      moreThan1000Frenchies:
        "🇫🇷 Mere end 1000 brugere har nu brugt Zeeguu til at studere fransk! Sammen har de interageret med mere end 10.000 artikler og oversat mere end 250.000 ord. Trés bien, nos amis! 🎉",
      newsEmmaAndFrida:
        "Emma og Frida, 👩‍🎓👩‍🎓, lancerer den seje nye browserudvidelse, der fjerner den visuelle støj på nyhedssider og lader læseren fokusere på teksten.",
      betaTesters200K: "Beta-testerne af Zeeguu har nået 200.000 oversættelser i deres fremmedsprogslæsning.",

      mirceaKeynoteAtEASEAI: "Mircea giver en keynote om Zeeguu på ",

      pernilleObtainsFundingPrefix:
        "Pernille Hvalsoe modtager bevillinger fra Styrelsen for International Rekruttering og Integration til et ",
      pernilleObtainsFundingLinkTitle: "projekt som bruger Zeeguu til at øge individualiseringen af materialer",
      pernilleObtainsFundingSuffix: " i de danske klasseværelser.",
      procrastinationPaper:
        "Udgivelse om at bruge Zeeguu til ordforrådsundervisning i online overspringshandlinger bliver godkendt på CHI 2021 ",
      rotterdamStarts: "Et gymnasium i Rotterdam begynder at bruge Zeeguu i deres sprogundervisning.",
      euroCall2020: "Workshop om Zeeguu på EuroCALL 2020.",
      betaTesters40K: "Beta-testerne af Zeeguu når op på 40.000 forskellige ord trænet i øvelserne.",
      betaTesters100K: "Beta-testerne af Zeeguu har nået 100.000 oversættelser i deres fremmedsprogslæsning.",
      amsterdamStarts: "Et gymnasium Amsterdam begynder at bruge Zeeguu i deres franskundervisning.",
      euroCall2019: "Mircea taler om Zeeguu på EuroCALL 2019.",
      asWeMayStudyPaper: "Udgivelse om Zeeguu bliver godkendt på CHI 2018 - en stor international conference om HCI ",
      groningenStarts:
        "Studerende på sprogcenteret ved Groningen Universitet begynder at bruge Zeeguu i deres undervisning i hollandsk.",
      gomarusStarts: "Studerende på Gomarus Universitet i Holland begynder at bruge Zeeguu i deres franskundervisning.",
      zeeguuIsReady: "Zeeguu er online og klar til betatestere.",

      //Contributors
      contributors: "Bidragsydere",

      //ArticleRouter
      homeTab: "Hjem",
      recommended: "Anbefalet",
      classroomTab: "Klasse",
      bookmarkedTab: "Bogmærker",
      saved: "Gemt",
      searches: "Mine Søgninger",

      //WordsRouter
      yourWordsHeadline: "Dine ord",
      activity: "Aktivitet",
      myArticles: "Mine artikler",
      myWords: "Mine ord",
      myActivity: "Min aktivitet",
      hidden: "Skjulte",
      noHiddenArticles: "Du har ingen skjulte artikler.",
      historyTab: "Historik",
      statisticsTab: "Statistik",
      starred: "Stjernemarkerede",
      translated: "Oversatte",
      learned: "Indlærte",

      //WordsHistory
      titleTranslationHistory: "Oversættelseshistorik",
      starAWordMsg:
        "Stjernemarkér et ord for at være sikker på, at det indgår i øvelserne. Delete ordet for at undgå øvelser med det. Grå ord vises ikke, medmindre de er stjernemarkerede.",

      //FindArticles
      findArticles: "Find artikler",

      //ArticleReader
      translateOnClick: "klik og oversæt",
      listenOnClick: "klik for udtale",
      reportBrokenArticle: "Rapportér ødelagt artikel",
      source: "kilde",
      helpUsMsg:
        "Hjælp os med at gøre Zeeguu endnu bedre ved at fortælle os, om du kunne lide at læse artiklen eller ej.",
      didYouEnjoyMsg: "Kunne du lide emnet i artiklen?",
      yes: "ja",
      no: "nej",
      reviewVocabulary: "Gennemse ordforråd",
      reviewVocabExplanation:
        "Gennemse dine oversatte ord nu for at sikre bedre læring. Husk at fortælle Zeeguu hvilke ord, du gerne vil prioritere i din træning.",
      backToEditing: "Tilbage til redigering",
      saveCopyToShare: "Gem kopi til deling",

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
      searchAllArticlesAndVideos: "Søg i alle artikler og videoer",

      //Search
      searching: "Søger...",
      youSearchedFor: "Du søgte på: ",

      //ClassroomArticles
      noArticlesInClassroom: "Der er ingen artikler i denne klasse.",

      noOwnArticles: "Der er ingen egen artikler.",

      //BookmarkedArticles
      noBookmarksYet: "Du har endnu ingen bogmærker.",

      //TagOfFilters
      addPersonalFilter: "Tilføj et personligt filter",

      //TagsOfInterests
      addPersonalInterest: "Tilføj en personlig interesse",

      //Learned
      titleLearnedWords: "Indlærte ord",
      learnedWordsAreMsg:
        "Lærte ord er ord, der har været trænet korrekt i øvelser på fire forskellige dage eller ord, der er blevet markeret som 'for nemme'.",
      numberOfLearnedWordsMsg: "Du har lært {0} ord indtil videre.",
      correctOn: "Korrekt på: ",

      //Starred
      titleStarredWords: "Stjernemarkerede ord",
      noStarredMsg: "Du har ikke markeret nogen ord med stjerne endnu.",

      //Top
      titleRankedWords: "Rangerede ord",
      rankedMsg: "De ord, du har oversat, er rangeret efter vigtighed.",

      //WordsOnDate
      open: "Åben",

      //WordEditAccordion
      done: "Færdig",
      rememberToSubmit: 'Husk at klikke på "Send" i hver del for at gemme ændringer.',
      translation: "Oversættelse",
      word: "Ordet",
      editWord: "Rediger dette ord",
      expression: "Udtryk",
      editExpression: "Rediger dette udtryk",
      context: "Sammenhængen",

      //WordsForArticle
      reviewTranslations: "Gennemse oversættelser til din øvelser ",
      from: "Fra: ",
      deleteTranslation: "Slet en oversættelse, hvis du ikke vil have den i øvelserne.",
      starTranslation: "Stjernemarkér en oversættelse for at prioritere den i øvelserne.",
      ifGreyedTranslation:
        "Hvis en oversættelse er grå, betyder det at Zeeguu finder den uegnet til øvelser; for at overskrive denne kendelse kan du stjernemarkere oversættelsen.",
      theWordsYouTranslate: "De ord, du oversætter i artiklen, vil blive vist til gennemgang her.",
      backToArticle: "Tilbage til artiklen",
      toExercises: "Til øvelserne",

      //EmptyArticles
      noArticles:
        "Vi har ikke indhentet artikler i det sprog, som du gerne vil studere. For at læse artikler med Zeeguu kan du i stedet browse på nettet og læse artikler ved hjælp af vores Chrome udvidelse. Du kan også tilføje artikler til “Egne Tekster” via “Save article to zeeguu.org” knappen inde i udvidelsen.",
      newssites: "Herunder finder du eksempler på nogle af de mest populære nyhedssider:",

      //ExerciseType
      matchThreePairs: " match 3 par",
      pickTheWord: "vælg ordet",
      typeTheWord: "skriv ordet",
      learnedOn: "Lært den:",
      studentFeedback: "Elevfeedback:",
      noType: "Ingen type",

      //Exercises
      wordSourceDefaultText: "din tidligere læsning",
      wordSourcePrefix: "Ord fra",
      noTranslatedWords: "Du har ingen oversatte ord.",
      goToTextsToTranslateWords: "Læs tekster og oversæt ord, som derefter kan bruges i øvelser.",
      goStarTranslations: "Gå tilbage og stjerne oversættelser, så Zeeguu kan inkludere dem i dine øvelser.",

      //LearnedWordsList
      studentHasNotLearnedWords: "Eleven har ikke lært nogen ord endnu.",

      //NonStudiedWordsList
      NoLoookedupWordsYet: "Eleven har ikke slået nogen ord op endnu.",

      //NonStudiedWordCard
      excludedByAlgorithm: "Udelukket af algoritmen",
      scheduledNotYetStudied: "Planlagt - endnu ikke øvet",

      //ExerciseHeadlines
      findTheWordInContextHeadline: "Find ordet i sammenhængen",
      findTheExpressionInContextHeadline: "Find udtrykket i sammenhængen",
      chooseTheWordFittingContextHeadline: "Vælg alternativet, der passer i sammenhængen",
      matchWordWithTranslation: "Match hvert ord med dets oversættelse",

      //FeedbackButtons
      giveFeedback: "Giv feedback",
      giveFeedbackAlert: "Indtast din feedback inden du sender.",
      selectWords: "Vælg ordet/ordene:",
      selectWordsAlert: "Vælg ordet/ordene, som du giver feedback til.",
      clickWords: "Klik på ordet/ordene, du forbedrer oversættelsen til:",
      otherFeedback: "Anden feedback:",
      sentFeedback1: "Feedback",
      sentFeedback2: "sendt!",
      undo: "FORTRYDE",

      //FeedbackOptions
      bookmarkTooEasy: "For nemt",
      bookmarkTooEasyTooltip: "Jeg ved det allerede! Jeg behøver ikke øve det mere.",
      iKnowThisWord: "Jeg kender dette ord",
      bookmarkTooHard: "For svært",
      bookmarkTooHardTooltip: "Dette er lidt for svært. Jeg vil hellere fokusere på enklere ord for nu.",
      dislike: "Tommelfinger ned",
      imNotsure: "Jeg er ikke sikker på dette... Og jeg vil hellere lade være med at øve noget, der føles forkert.",
      nb: "OBS:",
      youCanImprove: "Du kan forbedre oversættelsen efter at have fundet/set løsningen. Hvis du ønsker at gøre det, ",
      doNot: "skal du ikke",
      clickOnThisFeedbackButton: " klikke på denne feedback-knap.",
      badContext: "Dårlig kontekst",
      badContextTooltip: "Den givne kontekst er dårlig. Jeg kan ikke finde ud af løsningen med en så dårlig kontekst.",
      other: "Andet",
      otherTooltip: "Ingen af ​​de andre muligheder gælder. Jeg vil gerne indsende personlig feedback.",

      //ButtonInput
      reset: "Nulstil",
      check: "Tjek",
      hint: "Hint",
      showSolution: "Vis løsning",
      improveTranslation: "Forbedre oversættelse",

      //ButtonFeedback
      speak: "Udtale",
      next: "Næste",

      //ExerciseNavigation
      backToReading: "Tilbage til læsning",
      backToWords: "Tilbage til ord",
      keepExercising: "Øve dig videre",

      //CongratulationsPage
      goodJob: "Bravo, ",
      correct: "Det ser ud til, at du har styr på disse ord: ",
      payMoreAttentionTo: "Vær mere opmærksom på disse ord: ",

      //Settings
      nativeLanguage: "Modersmål",
      yourCurrentClassIs: "Din nuværende klasse er: ",
      changeClass: "Skift klasse",
      insertNewInviteCode: "Indsæt ny invitationskode",
      insertInviteCode: "Indsæt invitationskode",
      checkIfInviteCodeIsValid: "Noget gik galt. Tjek venligst at invitationskoden er korrekt og prøv igen.",

      //CEFR_LEVELS
      beginner: "Begynder",
      elementary: "Basis",
      intermediate: "Øvet",
      upperIntermediate: "Meget øvet",
      advanced: "Avanceret",
      proficiency: "Meget avanceret",
      beginnerDescription: "Kan forstå og bruge grundlæggende hverdagsudtryk",
      elementaryDescription: "Kan kommunikere i enkle og rutineprægede situationer",
      intermediateDescription: "Kan klare sig i de fleste situationer ved rejser",
      upperIntermediateDescription: "Kan interagere flydende med modersmålstalende",
      advancedDescription: "Kan bruge sproget fleksibelt til sociale og professionelle formål",
      proficiencyDescription: "Kan forstå næsten alt, der høres eller læses",

      //_ActivityInsightsRouter
      backTo: "Tilbage til ",
      s_reading: "s læsning",
      s_exercises: "s øvelser",
      seeReading: "Se læsning",
      seeExercises: "Se øvelser",

      //AddTextOptionTypes
      articleFromZeeguuToClass: "Find en artikel på Zeeguu",
      copyPasteArticleToClass: "Kopier/indsæt tekst, eller skriv din egen",
      urlUploadToClass: "Brug en URL-addresse",

      //AddToCohortDialog
      chooseClass: "Vælg en eller flere klasser",
      saveChanges: "Gem ændringer",

      //AddURLDialog
      addTextFromWebpage: "Tilføj tekst fra en hjemmeside",
      insertUrl: "Indsæt url-adressen på den tekst, du ønsker at tilføje",
      pleaseNote: "Bemærk venligst: ",
      textNotExtracted: "Det er ikke alle hjemmesider, hvorfra teksten kan udvindes.",
      editTheSavedText: "Så du bliver muligvis nødt til at redigere eller slette den tekst, vi gemmer til dig.",
      nothingInInputField: "Du mangler at indsætte en URL-adresse i feltet ovenfor.",
      saveAndEdit: "Gem og rediger",
      invalidUrl: "Noget gik galt. URL addressen er muligvis ugyldig.",

      //AllTexts
      addText: "Tilføj tekst",
      noTextAddedYet: "Du har ikke tilføjet nogle af dine egne tekster endnu.",

      //AttemptIcons
      incorrectAttemptIconExplanation: "indikerer, at eleven lavede et forkert forsøg på at løse øvelsen.",
      correctExerciseIconExplanation: "indikerer, at eleven løste øvelsen korrekt.",
      hintInExerciseIconExplanation: "indikerer, at eleven bad om et tip i løbet af øvelsen.",
      askedForSolutionInExercise: "indikerer, at eleven bad om at se løsningen på øvelsen.",
      studentExerciseFeedback: "For svær/For nem/Dårligt eksempel",
      exerciseFeedbackFromStudent: "er elevens feedback på øvelsen.",
      typeOfExerciseIconExplanation: "indikerer, hvilken type øvelse eleven har øvet ordet i.",
      pickTheWordOrMatchThreePairs: "Vælg ordet/Match 3 par osv.",
      tooHard: "for svær",
      badWord: "dårligt ord",
      badExample: "dårligt eksempel",
      dontShowAgain: "vis ikke igen",
      starExplanation: "Stjernen ved siden af ordet indikerer, at eleven har lavet mindst én øvelse med ordet.",

      //CohortForm
      editClass: "Rediger klasse",
      createClass: "Opret en klasse",
      classroomLanguage: "Sprog i klasse",
      errorInviteCode:
        "Noget gik galt. Måske er invitationskoden allerede i brug. DEV BEMÆRKNING: Kan ikke slette klasse, som indeholder tekster.",
      errorEmptyInputField: "Venligst udfyld alle felter.",

      //CohortFormInputFields
      chooseClassName: "Angiv navnet på denne klasse (maks. 20 tegn)",
      classnameTooLong: "Klassenavnet er desværre for langt.",
      createInviteCode: "Opret en invitationskode (maks. 20 tegn)",
      invitecodeTooLong: "Invitationskoden er desværre for lang.",

      //CohortItemCard
      seeStudents: "Se elever",
      teacher: "Lærer: ",
      teachers: "Lærere: ",
      addTeacher: "Tilfør lærer",

      //AddTeacherDialog
      addAnotherTeacherToTheClass: "Tilføj en lærer mere til klassen",
      addEmailOfColleague: "Tilføj kollegas email",
      addTeacherWarning:
        "Dette tilføje klassen til din kollegas liste af klasser. Hvis du senere sletter klassen her, bliver den også uigenkaldeligt slettet fra din kollegas list af klasser.",
      youHaveToAddEmail: "Du skal tilføje en lærers email.",
      errorMsg:
        "Noget gik galt. Måske matcher emailen ikke en bruger i systemet eller det kan være en serverfejl. Kontakt os gerne, hvis fejlen fortsætter.",
      addColleague: "Tilføj kollega",

      //CohortList
      addClass: "Tilføj klasse",

      //DeleteCohortWarning
      dangerzone: "Farezone!",
      deleteCohortEnsurance: "Er du sikker på, at du vil slette denne klasse? Du kan ikke fortryde.",
      cannotDeleteClassWithText:
        "Noget gik galt. Hvis du deler tekster med denne klasse, kan du ikke slette klassen. Fjern delte tekster med denne klasse i 'Mine tekster', og prøv igen.",
      youAreSharingThisClassWarning:
        "Du deler denne klasse med mindst én kollega. Hvis du sletter klassen her, bliver den også uigenkaldeligt slettet fra din kollegas list af klasser.",

      //DeleteStudentWarning
      wishToDeleteStudent: "Ønsker du at fjerne",
      fromTheClass: "fra klassen?",
      howStudentsRejoinClass:
        "Elever kan tilmelde sig til klassen igen (under 'Indstillinger'), hvis du giver dem invitationskoden.",
      remove: "Fjern",

      //DeleteTextWarning
      deleteTextWarning: "Du er igang med at slette din tekst",
      confirmDeleteText: "Bekræft venligst, at du vil slette teksten, eller tryk på 'Annuller'.",

      //EditText
      editText: "Rediger",
      saveText: "Gem tekst",

      //ShareTextWithColleagueDialog
      somethingWentWrongMostLikelyEmail:
        "Noget gik galt. Det kan være din kollega bruger en anden email til Zeeguu. Tjek venligst og prøv igen.",
      theConnectionFailed:
        "Forbindelsen til serveren virker ustabil. Giv os gerne besked, hvis dette problem fortsætter.",
      enterEmailYourColleagueUse: "Indsæt den email, din kollega bruger til Zeeguu",
      share: "Del",
      yourColleagueShouldHaveTheTextShortly: "Din kollega burde have teksten i 'Mine tekster' om et øjeblik.",
      ok: "OK",

      //TooltipedButtons
      viewAsStudent: "Se som elev",
      addToClass: "Del med/fjern fra klasse",
      saveTextBeforeViewAsStudent: "Teksten skal gemmes, før du kan se den som elev.",
      saveChangesBeforeViewAsStudent: "Ændingerne skal gemmes, før du kan se teksten som elev.",
      textMustBeSavedBeforeSharing: "Teksten skal gemmes, før du kan dele den med dine klasser",
      changesMustBeSavedBeforeSharing: "Ændringerne skal gemmes, før du kan dele teksten med dine klasser",

      //EditTextInputFields
      defineLanguage: "Sprog",
      pasteTitleHere: "Indsæt eller skriv tekstens titlen her...",
      clickToChangeTitle: "Titel",
      pasteBodyHere: "Indsæt eller skriv selv tekstens brødteksten her...",
      clickToChangeBody: "Indhold",

      //FormatedTime
      exactReadingTime: "Nøjagtig læsetid:",
      exactExerciseTime: "Nøjagtig øvelsestid:",
      hours: "t ",

      //HowToAddStudentsInfo
      addStudents: "Tilføj elever",
      shareInviteCode: "Del denne kode med dine elever for at invitere dem til klassen: ",
      invitecodeInformation:
        "Eleverne vil ikke blive vist i klassen før de har oprettet sig i Zeeguu og brugt invitationskoden (under Indstillinger) til at blive en del af klassen.",
      goToClass: "Bliv ført til klassen",

      //LanguageSelector
      chooseLanguage: "Vælg sprog...",
      german: "Tysk",
      spanish: "Spansk",
      french: "Fransk",
      dutch: "Hollandsk",
      english: "Engelsk",
      italian: "Italiensk",
      danish: "Dansk",
      polish: "Polsk",
      romanian: "Rumænsk",
      chinese: "Kinesisk",
      turkish: "Tyrkisk",
      arabic: "Arabisk",
      somali: "Somalisk",
      kurdish: "Kurdisk",
      swedish: "Svensk",
      russian: "Russisk",
      hungarian: "Ungarnsk",
      ukrainian: "Ukrainsk",
      vietnamese: "Vietnamesisk",
      norwegian: "Norsk",
      portughese: "Portugisisk",
      albanian: "Albansk",
      japanese: "Japansk",
      serbian: "Serbisk",
      latvian: "Lettisk",
      indonesian: "Indonesisk",
      urdu: "Urdu",
      tamil: "Tamil",
      bengali: "Bengali",
      greek: "Græsk",

      //NoStudents
      noStudentsInClass: "Der er ikke nogen elever i denne klasse endnu.",
      shareTheInviteCode: "Del invitationskoden",
      shareInviteCodeContinued: "med eleverne,",
      soTheStudentCanJoinClass: "så de kan oprette sig og blive en del af klassen.",

      //PractisedWordsCard
      practisedWords: "Øvede ord",
      timeSpendOnExercises: "Tid brugt på øvelser",
      numberOfWords: "Samlet antal ord",
      solvedOnFirstAttempt: "Løst ved 1. forsøg",

      //PractisedWordsList
      noPractisedWordsYet: "Eleven har ikke øvet nogen ord endnu.",

      //StudentActivityDataCircleWrapper
      level: "niveau",
      lengthOnText: "længde",
      time: "tid",
      wordsWithLowercase: "ord",
      readingTime: "læse",

      //ReadingInsightAccordion
      readingDate: "Læst: ",

      //StudentInfoLine
      textsRead: "læste tekster",
      exercisesCompleted: "gennemførte øvelser",
      avgText: "tekst",
      difficultyLowerCase: "sværhed",
      exercisesCorrectness: "korrekte øvelser",

      //StudentReadingInsights
      studentHasRead: " har læst ",
      textsInTheLastPeriod: " tekster i en periode på ",
      studentHasNotReadAnyArticles: "Eleven har endnu ikke læst nogle tekster i",
      textLengthExplanation: "Gennemsnitlig længde af de tekster eleven har læst",
      difficultyExplanation: "Gennemsnitlig sværhedsgrad af de tekster eleven har læst",
      exercisesExplaination: "Øvelser løst korrekt i først forsøg",

      //StudentInfoLineHeader
      textLevel: "grad",
      studentName: "Elevens navn",
      readingExerciseTime: "Læse/Øvelsestid",
      lengthOfText: "tekst længde",
      levelOfText: "sværheds",
      exercisesCorrect: "Korrekt ",
      onFirstAttempt: "ved 1. forsøg",

      //StudentsActivityOverview
      backToClasses: "Tilbage til 'Mine klasser'",

      //StudentsActivityOverviewContent
      customTextInTimeSelector: "Dette er en oversigt over elevernes aktiviteter i en periode på",

      //StudentTextView
      viewText: "Vis tekst",

      //StudentTranslations
      translatedWordsInSentence: "Oversatte ord i kontekst af den sætning ordet indgår",
      translatedWordInText: "Eleven oversatte ingen ord i denne tekst.",

      //TeacherTextPreview
      shareTextWithClasses: "Husk at tilføj denne tekst til en eller flere klasser.",
      addedTo: "Tilføjet til: ",

      //TimeSelector
      changeTimePeriod: "Skift tidsperiode",

      //TimeSelectorHelperMap
      oneWeek: "1 uge",
      twoWeeks: "2 uger",
      oneMonth: "1 måned",
      sixMonths: "6 måneder",
      oneYear: "1 år",

      //Tutorials
      howToAddAndEditClass: "Sådan tilføjes en klasse",
      howToDeleteClass: "Sådan redigeres eller slettes en klasse",
      howToAddStudent: "Sådan tilføjes elever",
      howToDeleteStudents: "Sådan slettes elever",
      howToAddTextUrl: "Sådan tilføjes en tekst ved hjælp af en URL",
      howToAddTextFromZeeguu: "Sådan tilføjes en tekst fra Zeeguu",
      howToAddTextCopyPaste: "Sådan tilføjes en tekst ved enten at kopiere eller selv skrive tekst",
      howToEditAndDeleteText: "Sådan redigeres eller slettes en tekst",
      howToShareText: "Sådan deler du tekster med din klasse / dine klasser",
      howToExplainZeeguuData: "De data, du kan finde i Zeeguu forklaret",
      howToUnderstandTextLevel: "Sådan skal tekst niveau forstås",

      //ViewMoreLessButton
      viewMoreBtn: "Vis mere",
      viewLessBtn: "Vis mindre",

      //WordsDropDown
      wordsTranslatedButNotInZeeguu: "Ord/sætninger oversat af eleven, men ikke inkluderet i øvelser",
      wordsTranslatedAndLearned: "Ord/sætninger øvet korrekt på fire forskellige dage eller markeret som 'for nemme'.",
      wordsTranslatedAndExercised: "Ord/sætninger - oversat og øvet af eleven",

      //StudentExercisesInsights
      hasCompleted: " har gennemført ",
      exercisesInTheLast: " øvelser i en periode på ",
      wordsNotStudiedInZeeguu: "Ord ikke øvet i Zeeguu",
      systemLanguage: "Interface sprog",
    },
  },
  {
    /* options */
  },
);

export default strings;
