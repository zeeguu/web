import { getSourceAsDOM } from "../../popup/functions";
import { Readability } from "@mozilla/readability";
import { cleanDocumentClone } from "../Cleaning/pageSpecificClean";
import { displayEntireArticle, fazRegex } from "../Cleaning/Pages/faz";

export async function Article(currentTabURL) {
  //if a paginated article on faz:
  if(currentTabURL.match(fazRegex)){
    currentTabURL = displayEntireArticle(currentTabURL)
  }
  const documentFromTab = getSourceAsDOM(currentTabURL);
  const documentClone = documentFromTab.cloneNode(true);
  const cleanedDocumentClone = cleanDocumentClone(documentClone, currentTabURL);
  const article = new Readability(cleanedDocumentClone).parse();
  return article;
}