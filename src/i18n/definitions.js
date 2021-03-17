import LocalizedStrings from "localized-strings";

let strings = new LocalizedStrings(
  {
    en: {
      //Shared
      words: "Words",
      //Sidebar
      articles: "Texts",
      exercises: "Exercises",
      teacherSite: "Teacher site",
      settings: "Settings",
      logout: "Logout",

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
    },

    da: {
      //Shared
      words: "Ord",
      articles: "Tekster",

      //Sidebar
      exercises: "Øvelser",
      teacherSite: "Lærersiden",
      settings: "Indstillinger",
      logout: "Log ud",

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
    },
  },
  {
    /* options */
  }
);

export default strings;
