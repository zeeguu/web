export const lemondeRegex = /(http|https):\/\/(www.lemonde.fr).*/;

export function removeListElementsHeaders(content) {
    const div = document.createElement("div");
    div.innerHTML = content;
    console.dir( "readablity:" + div);
    let list = Array.from(div.querySelectorAll("UL"));
    console.dir("list:" + list)
    for (let i = 0; i < list.length; i++) {
        let li = list[i].children[0];
        let ul = list[i];
        if (li.nodeName === "LI") {
            const element = li.children[0];
            if (element.nodeName === "H2") {
                let siblingToUl = list[i].nextSibling;
                let parent = list[i].parentNode;
                let newH = element;
                let frag = document.createDocumentFragment();
                frag.appendChild(newH);
                parent.removeChild(ul);
                siblingToUl.parentNode.insertBefore(frag, siblingToUl);
            }
        }

    }
    return div.innerHTML;
}

export function removeInjectedContent() {
    //remove services header and everything below
}