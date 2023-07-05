import moment from "moment";

class Filters {
  constructor() {
    this.articlesList = [];
    this.currentFilter = null;
  }
  setArticlesList = (articlesList) => {
    this.articlesList = articlesList;
  };

  getArticlesList = () => {
    return this.articlesList;
  };

  setCurrentFilter = (currentFilter) => {
    this.currentFilter = currentFilter;
  };

  getCurrentFilter = () => {
    return this.currentFilter;
  };

  filterByDate = () => {
    return this.articlesList.filter(({ published }) => {
      const currentDate = moment();
      const publishedDate = moment(published);

      switch (this.currentFilter.value.type) {
        case "hour":
          return currentDate.diff(publishedDate, "hours") <= 1;
        case "today":
          return currentDate.diff(publishedDate, "hours") <= 24;
        case "week":
          return currentDate.diff(publishedDate, "days") <= 7;
        case "month":
          return currentDate.diff(publishedDate, "months") <= 1;
        case "year":
          return currentDate.diff(publishedDate, "years") <= 1;
      }
    });
  };

  filterByType = () => {
    return this.articlesList.filter(({ video }) =>
      this.currentFilter.value.type === "video" ? video !== 0 : video === 0
    );
  };

  filterByDuration = () => {
    return this.articlesList.filter(({ metrics: { word_count } }) => {
      const readingTime = Math.round(word_count / 80);

      switch (this.currentFilter.value.type) {
        case "under 4 min":
          return readingTime < 4;
        case "4-20 min":
          return 4 <= readingTime && readingTime <= 20;
        case "over 20 min":
          return readingTime > 20;
      }
    });
  };

  filterByLevel = () => {
    return this.articlesList.filter(({ metrics: { difficulty } }) => {
      const difficultyLevel = Math.round(difficulty * 100) / 10;

      switch (this.currentFilter.value.type) {
        case "easy":
          return difficultyLevel >= 0 && difficultyLevel < 4;
        case "fair":
          return difficultyLevel >= 4 && difficultyLevel < 8;
        case "challenging":
          return difficultyLevel >= 8;
      }
    });
  };

  sortBy = () => {
    switch (this.currentFilter.value.type) {
      case "relevance":
        return this.articlesList; //TODO: add sorting by relevance
      case "date":
        return [...this.articlesList].sort((a, b) => {
          const aDate = moment(a.published).unix();
          const bDate = moment(b.published).unix();

          return aDate + bDate;
        });
      case "length":
        return [...this.articlesList].sort(
          (a, b) => b.metrics.word_count - a.metrics.word_count
        );
      case "level":
        return [...this.articlesList].sort(
          (a, b) => b.metrics.difficulty - a.metrics.difficulty
        );
    }
  };

  getByInterests = (arrayTopics) => {
    if (!arrayTopics.length) return this.articlesList;
    return this.articlesList.filter((article) => {
      const articleTopics = article?.topics
        ?.split(" ")
        .filter((topic) => topic !== "");

      let isContain = false;
      arrayTopics.map(({ name }) => {
        if (articleTopics.indexOf(name) !== -1) return (isContain = true);
      });
      return isContain;
    });
  };
}

export default new Filters();
