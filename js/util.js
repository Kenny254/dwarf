function scsmsg(msg) {
    $(".alert-success").show(300);
    $(".alert-success .message-content").append(msg + "<br>");
}

function infmsg(msg) {
    $(".alert-info").show(300);
    $(".alert-info .message-content").append(msg + "<br>");
    setTimeout(function() {
        $(".alert-info").hide(300);
    }, 5000);
}

function wrnmsg(msg) {
    $(".alert-warning").show(300);
    $(".alert-warning .message-content").append(msg + "<br>");
}

function errmsg(msg) {
    $(".alert-danger").show(300);
    $(".alert-danger .message-content").append(msg + "<br>");
}

var clsmsg = function() {
	var $allAlerts = $(".alert-success .message-content, .alert-info .message-content, "
	    + ".alert-warning .message-content, .alert-danger .message-content");
    $allAlerts.html("");
    $allAlerts.hide(500);
}

function jsonToString(jsonObj) {
    return JSON.stringify(jsonObj, null, 2);
}

function json(jsonObj) {
    $(".json-content").show();
    $(".json-content").append( jsonToString(jsonObj) + "\n");
}

var $mainLoading = $("#mainLoading");

function beginl($loader, $replace) {
    if (typeof $replace !== "undefined") {
    	$replace.hide();
    }
    if (typeof $loader !== "undefined") {
    	$loader.show();
    } else {
    	$mainLoading.show();
    }
}

function endl($loader, $replace) {
    if (typeof $replace !== "undefined") {
        $replace.show();
    }
    if (typeof $loader !== "undefined") {
        $loader.hide();
    } else {
        $mainLoading.hide();
    }
}

function beginr($elm) {
    $elm.find(".fa").addClass("fa-refresh fa-spin");
}

function endr($elm) {
    $elm.find(".fa").removeClass("fa-refresh fa-spin");
}

function beginc($elm) {
    $elm.find(".fa").addClass("fa-cog fa-spin");
}

function endc($elm) {
    $elm.find(".fa").removeClass("fa-cog fa-spin");
}