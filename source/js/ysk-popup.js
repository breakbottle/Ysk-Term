modifyTermList();
chrome.contextMenus.onClicked.addListener(knowTermSelectionCallback);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": "Know Term...",
        "contexts": ["selection"],
        "id": "context" + "selection"//todo: allow double click selection 
    });
});

//todo: udpate styles for popup.html 