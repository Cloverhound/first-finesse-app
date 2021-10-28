var finesse = finesse || {};
finesse.modules = finesse.modules || {};
finesse.modules.DantestGadget = (function ($) {
    var gadget_name = "Dantestapp";
    var finn;
    var gadgetBodyHidden;
    
    function init() {
        finn = new Finn(gadget_name);
        finn.load(function(err, agent) {
            console.log(gadget_name + ": agent loaded.");
            var height = finn.container.getParameter("height") || "100";
            finn.log("Setting gadget height to: '" + height + "'");
            window.gadgets.window.adjustHeight(height);
            if (err) {
                console.error(gadget_name + ': Error loading Finesse User.');
                return;
            }
        

            showGadgetBody();

            // Resizing gadget on tab active
            finn.container.onTabActiveCallback = function() { resizeGadget(); };

            // Toggling gadget show/hide on title bar click
            finn.container.getGadgetTitleElement().on("click", function() { debugger; handleShowHideClicked(); });

            // Setting on-click listeners
            $("#openURL").on("click", function() { handleButtonClick(); });
            $("#errorCloseIcon").on("click", function() { handleErrorCloseClicked(); });

            // Listening for enter key in search bar
            $("#accountInput").on("keydown", function(event) { debugger; handleKeydown(event.key); });

            window._finn = finn; //debugger;
            window.backdoor = backdoor; // debugger;
        });
    }
    
    function  handleButtonClick(){
        openURL()
    }

    function openURL(){
        //use getParameter along with finn.
        console.log("URL im trying to open!: ", finn.container.getParameter("url"))
        window.open(finn.container.getParameter("url"), '_blank')
    }

    function handleShowHideClicked() {
        if (gadgetBodyHidden) {
            showGadgetBody();
        } else {
            hideGadgetBody();
        }
    }

    function showGadgetBody() {
        finn.log("Showing gadget body.");
        gadgets.window.adjustHeight();
        gadgetBodyHidden = false;
    }

    function hideGadgetBody() {
        finn.log("Hiding gadget body.");
        gadgets.window.adjustHeight(0);
        gadgetBodyHidden = true;
    }

    return {
        init: init,
        debug: function() {
            return {
                finn: finn
            }
        }
    };

}(jQuery));


// Helper functions
window._getParameter = function(name, uri) {
    var url, param;
    if (!uri) {
        if (url = _getParameter("url", location.search)) {
            url = url.replace(";", "&");
            return _getParameter(name, url);
        }
    } else if (name == "baseUrl") {
        param = new RegExp("(http.+/).+?xml").exec(uri)[1];
        if (param && param.includes("localhost")) {
            var urlWithLocalhost = decodeURIComponent(param)
            var extServerHost = decodeURIComponent(_getParameter("up_externalServerHost", location.search));
            var localhost = new RegExp("(http.+?:.+?)/").exec(urlWithLocalhost)[1];
            param = urlWithLocalhost.replace(localhost, extServerHost);
        }
        return decodeURIComponent(param);
    } else if (param = (new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)")).exec(uri)) {
        return decodeURIComponent(param[1]);
    }
}

/**
 * https://developer.cisco.com/docs/finesse/#!handling-special-characters-in-css/handling-special-characters-in-css
 * Injects css or js files into DOM dynamically.
 * This is to bypass gadget container's restriction for special chars in CSS 3 files.
 * E.g. @Keyframes
 */
 window.injectResource = function(url) {
    var node = null;
    // url null? do nothing
    if (!url) {
        return;
    } else if(url.lastIndexOf('.js') === url.length-3) { // creates script node for .js files
        node = document.createElement("script");
        node.async = false;
        node.setAttribute('src', url);
    } else if (url.lastIndexOf('.css') == url.length-4) { // creates link node for css files
        node = document.createElement("link");
        node.setAttribute('href', url);
        node.setAttribute('rel', 'stylesheet');
    }
    // inserts the node into dom
    if (node) {
        document.getElementsByTagName('head')[0].appendChild(node);
    }
}
