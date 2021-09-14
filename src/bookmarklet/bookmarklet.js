// Inspired from: https://stackoverflow.com/a/6261563/1200070
// To test it
// 1. Paste the code below in https://chriszarate.github.io/bookmarkleter/
// 2. Follow the instructions and add the bookmarklet
// 3. Try it on a page with
function post_to_url(path, params, method) {
  method = method || "post";
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);
  form.setAttribute("accept-charset", "UTF-8");
  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
}

post_to_url(
  "https://api.zeeguu.com/post_user_article",
  {
    withKeywords: "true",
    sumSize: 5,
    return_type: "list",
    title: document.title,
    url: location.href,
    page_content: document.documentElement.innerHTML,
  },
  "post"
);
