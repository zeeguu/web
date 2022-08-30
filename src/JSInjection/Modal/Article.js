import { getSourceAsDOM } from "../../popup/functions";
import { Readability } from "@mozilla/readability";
import { cleanBeforeArray, individualClean } from "../Cleaning/pageSpecificClean";
import { displayEntireArticleFaz, fazRegex } from "../Cleaning/Pages/faz";

export async function Article(currentTabURL) {
  //if a paginated article on faz:
  if(currentTabURL.match(fazRegex)){
    currentTabURL = displayEntireArticleFaz(currentTabURL)
  }
  const documentFromTab = getSourceAsDOM(currentTabURL);
  const documentClone = documentFromTab.cloneNode(true);
  const cleanedDocumentClone = individualClean(documentClone, currentTabURL, cleanBeforeArray);
  const article = new Readability(cleanedDocumentClone).parse();
  return article;
}