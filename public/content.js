
/* Changes to current URL's DOM */
chrome.storage.local.get("isProbablyReaderable", function (data) {
  console.log(data);
  if (!data.isProbablyReaderable) {
    console.log("This content is not readable");
    alert("This content is not readable");
  } else {
    console.log("YES! This content is readable");
    var dataText;
    chrome.storage.local.get("article", function (data) {
      if (data.article == undefined) {
        console.log("No article is defined");
      } else {
        dataText = data.article;
        let cleanContent = cleanImages(dataText.content);
        let cleanSVG = removeSVG(cleanContent);
        let dialogWindow = document.createElement("dialog");
        let dialogContent = document.createElement("div");
        dialogContent.setAttribute("class", "modal-content");

        var xClose = document.createElement("span");
        xClose.setAttribute("id", "qtClose");
        xClose.setAttribute("role", "button");
        xClose.textContent = "X";

        let div = document.createElement("div");
        div.innerHTML = cleanSVG; //dataText.content;
        div.setAttribute("style", `width: 95%`);

        let h1 = document.createElement("h1");
        let headline = document.createTextNode(dataText.title);
        h1.appendChild(headline);

        let numChar = document.createElement("div");
        let num = document.createTextNode(dataText.length);
        numChar.appendChild(num);

        dialogWindow.setAttribute("id", "myDialog");
        dialogWindow.setAttribute("class", "modal");
        dialogWindow.setAttribute("data-backdrop", "true");
        dialogWindow.setAttribute("data-keyboard", "false");
        dialogWindow.setAttribute(
          "style",
          `
            font-size: 20px;
            height:90%;
            width: 70%;
            border: none;
            background-color:white;
            position: fixed;
            box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
            `
        );

        dialogWindow.appendChild(xClose);
        dialogWindow.appendChild(dialogContent);
        dialogContent.appendChild(h1);
        dialogContent.appendChild(div);
        dialogContent.appendChild(numChar);

        document.body.appendChild(dialogWindow);
        document.getElementById("myDialog").showModal();
        document.body.style.overflow = "hidden";

        let button = document.getElementById("qtClose");
        button.addEventListener("click", function () {
          document.body.style.overflow = "auto";
          document.getElementById("myDialog").close();
        });
      }
    });
  }
});


/* Event listeners */
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    document.body.style.overflow = "auto";
  }
});

/* Functions */
function cleanImages(content) {
  var div = document.createElement("div");
  div.innerHTML = content;
  var firstImage = div.getElementsByTagName("img")[0];
  if (firstImage != undefined) {
    firstImage.setAttribute("id", "zeeguuImage");
    var images = div.getElementsByTagName("img"),
      index;
    for (index = images.length - 1; index >= 0; index--) {
      if (index != 0) {
        images[index].parentNode.removeChild(images[index]);
      }
    }
    content = div.innerHTML;
  }
  return content;
}

function removeSVG(content) {
  var div = document.createElement("div");
  div.innerHTML = content;
  var allSVG = div.getElementsByTagName("svg");
  if (allSVG != undefined) {
    var svg = allSVG,
      index;
    for (index = svg.length - 1; index >= 0; index--) {
      svg[index].parentNode.removeChild(svg[index]);
    }
    content = div.innerHTML;
  }
  return content;
}
