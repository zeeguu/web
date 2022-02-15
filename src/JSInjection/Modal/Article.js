import {getSourceAsDOM} from "../../popup/functions"
import { Readability} from "@mozilla/readability";


export async function Article(currentTabURL){
    const documentFromTab = getSourceAsDOM(currentTabURL);
    console.log(documentFromTab)
    const documentClone = documentFromTab.cloneNode(true);
    const article = new Readability(documentClone).parse();
    return article
}