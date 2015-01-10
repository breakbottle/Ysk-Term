//methods and variables
//todo: update options page
var termConsts = {
    notFound: "term not found",
    termList: 'termList',
    lineBreak:'LINEBREAK',
    closeWindowTimeout:100000
};
//sources to lookup term and phrases
var sources = {//todo:add more sources and conversion svc from sources object to this data format.
    wikipedia: 'http://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=',
    google: 'https://www.google.com/search?q=define+'
};
//modify the list of terms everytime a new term is found and on init
var list = []; //default empty list;
var modifyTermList = function(updateAndSave) {
    chrome.storage.sync.get(termConsts.termList, function(value) {
        if (updateAndSave) {//is object, todo:check to validate is object
            if(value[termConsts.termList]){
                if (value[termConsts.termList].length > 0) { //todo:the termsList needs to be a unique list
                    list = value[termConsts.termList];
                }
            }
            
            //console.log("about to save",updateAndSave)
            //add to list
            list.push({
                "term": updateAndSave.term,
                "desc": updateAndSave.desc
            });
            //update badge
            chrome.browserAction.setBadgeText({
                text: list.length.toString()
            });
            //save to list storage
            var setStorage = {};
            setStorage[termConsts.termList] = list;
            chrome.storage.sync.set(setStorage, function() {//todo: don't save to storage automatically, wait for button to sync description.
                //when set is complete.
            });
        } else if(value[termConsts.termList]) {
            chrome.browserAction.setBadgeText({
                text: value[termConsts.termList].length.toString()
            });
        } 
    });
}
//add line breaks in UI client mode & support alert mode
var addLineBreaks = function(str,lineBreaksString){
    var regx = new RegExp(termConsts.lineBreak,"g");
    return str.replace(regx, lineBreaksString);
}
//once you have the term send to server for results
var sendToServer = function(data, tabId) {

    $.ajax({
        url: sources.wikipedia + data,
        //contentType:'application/json',
        //data:JSON.stringify({more:data}),
        type: 'POST'
    }).done(function(a, b) {

        var description = termConsts.notFound;
        if (a[2].length > 0) {
            description = "";
            for (var i = 0; i < a[2].length; i++) {
                description += a[2][i] + termConsts.lineBreak;
            }
        }
        var linkToOtherOptions = "<a href='" + sources.google + data + "' target='_blank' class='btn btn-primary'>Search Google</a><hr>"; //todo:needs to be a list of other sources
        chrome.tabs.sendRequest(tabId, {//todo: add button to allow description found to be saved. also allow textarea for manually adding description found and save
            desc: addLineBreaks(description,"<hr />"),
            notFound: ((description == termConsts.notFound) ? true : false),
            otherOptions: ((description == termConsts.notFound) ? linkToOtherOptions : "")
        }, function(response) {
            //ui is response :todo: use respone to validate ui is complete.
        });
        
        //modify term list
        modifyTermList({term:data,desc:description});
    });
}
//once selected in the ui call this event Method
var knowTermSelectionCallback = function(info, tab) {
    sendToServer(info.selectionText, tab.id);

};

