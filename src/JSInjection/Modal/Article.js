import { getSourceAsDOM } from "../../popup/functions";
import { Readability } from "@mozilla/readability";
import { cleanDocumentClone } from "../Cleaning/pageSpecificClean";

export async function Article(currentTabURL) {
  const documentFromTab = getSourceAsDOM(currentTabURL);
  const documentClone = documentFromTab.cloneNode(true);
  console.log("clone", documentClone)
  const cleanedDocumentClone = cleanDocumentClone(documentClone, currentTabURL);
  const article = new Readability(cleanedDocumentClone).parse();
  return article;
}