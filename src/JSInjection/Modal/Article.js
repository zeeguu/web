import {getSourceAsDOM} from "../../popup/functions"
import { Readability} from "@mozilla/readability";


export async function Article(currentTabURL){
    const documentFromTab = getSourceAsDOM(currentTabURL);
    console.log("tab", documentFromTab)
    const documentClone = documentFromTab.cloneNode(true);
    console.log("clone", documentClone)
    const article = new Readability(documentClone).parse();
    console.log(article.content)
    return article
}