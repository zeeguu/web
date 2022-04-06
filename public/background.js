
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    console.log("Received message from " + sender + ": ", request);
    sendResponse("hi there" + sender + request); //respond however you like
});

//chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//    console.log({ request })
//});

//chrome.runtime.onMessageExternal.addListener(
//    function(request, sender, sendResponse) {
//        console.log(request)
//        if (request) {
//           
//                    sendResponse("i am an zeeguu extension");
//            
//        }
//        return true;
//    });

