
//get the list from storage and display in popup
chrome.storage.sync.get(termConsts.termList, function(terms) {
    var termsListContainer = $("#ysk-list-of-terms");console.log("this won't work")
    var termsRootObject = terms[termConsts.termList];
    if (termsRootObject.length > 0) {
        for (var i = 0; i < termsRootObject.length; i++) {
            var count = i;
            var itemTerm = $("<tr>")
                .append(
                    $("<td>")
                    .html(termsRootObject[i].term)

            ).append(
                $("<td>")
                .html($("<button class='btn btn-"+((termsRootObject[i].desc == termConsts.notFound)?"warning":"success")+"'>")
                    .attr({
                        "data-termId": i
                    })
                    .html((termsRootObject[i].desc == termConsts.notFound)?"Lookup":"View")
                    .on("click", function() {
                        var desc = termsRootObject[$(this).attr("data-termId")].desc;
                       	if(desc == termConsts.notFound){
                       		window.open(sources.google+termsRootObject[$(this).attr("data-termId")].term)
                       	} else {
                       			debugger;
                       		var cleanDesc = addLineBreaks(desc,"\n\n");
                        	alert(cleanDesc);
                       	}
                        

                    }))

            );

            itemTerm.appendTo(termsListContainer);
        }

    }
});