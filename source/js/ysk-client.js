//todo: update ui styles

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        //close popup window fancy
        var closeWindow = function(windowBox) {
            windowBox.animate({
                top: 0,
                right: 0,
                height: 0,
                width: 0,
                left: $(window).width(),
                "min-height": 0

            }, 500, function() {
                windowBox.remove()
            });
            
        }
        //get the selected text to find position on page then setup the ui popup and position on page.
        s = window.getSelection();
        oRange = s.getRangeAt(0); //get the text range
        oRect = oRange.getBoundingClientRect();
        var uniqueId = ("mrt-id" + Math.random()).replace(".", "-");
        var putDesc = $("<div class='ysk-term-box'>").html("<div class='ysk-terms-container'><div style='float:left' class='ysk-term-display'><b>" + s.toString() + "</b></div><div class='ysk-close' style='float:right'>x</div></div><div style='clear:both'></div><hr><div>" + ((request.notFound == true)?request.desc+"<br>"+request.otherOptions:request.desc)  + "</div><div style='float:right'>wikipedia - <a href='http://en.wikipedia.org/wiki/Special:Search?search=" + s.toString() + "&go=Go' target='_blank'>view more >></a></div>");
        var domFocusNode = $(s.focusNode.parentNode);
        var position = domFocusNode.position();
        var zIndex = 999999999;
        if (request.notFound == false) {
            domFocusNode.html(domFocusNode.html().replace(s.toString(), "<span class='ysk-term' >" + s.toString() + "</span>"));
            position = $(".ysk-term", domFocusNode).position();
        }
        var leftPostion = (position.left - oRect.width);
        putDesc.css({
            left: ((leftPostion <= 0 )?0:leftPostion), //oRect.left + 85,
            top: (position.top + oRect.height) + 10,
            zIndex: (zIndex + 1)
        }).prop({
            id: uniqueId
        });

        putDesc.appendTo("body"); //s.focusNode.parentNode
        $(".ysk-close", putDesc).on("click", function() {
            closeWindow(putDesc);
        });

        //if end user don't close popup window automatically close the window
        //todo: add this timeout in options
        setTimeout(function() {
            closeWindow(putDesc);
        }, termsConsts.closeWindowTimeout);

        //if the window changes size the positioning of the popup will be off, let's close all open popups
        window.onresize = function() {
            if ($(".ysk-terms-container").length > 0) {
                closeWindow(putDesc);
            }
        }
        //once we display the popup bring into focus
        $('html, body').animate({
            scrollTop: $("#" + uniqueId).offset().top
        }, 2000);
        //good practice to send response back to backend scripts
        sendResponse({
            farewell: "goodbye"
        });
    });