var getParameterByName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

var getProgressBarSectionStyle = function(count, totalCount) {
	if (totalCount == 0) return "";

	var percentage = Math.round(count * 100 / totalCount);
	return "width: " + percentage + "%";
};

var numberOrBlankIfZero = function(number) {
	return number == 0 ? "" : number;
};

var clipText = function(text, maxChars) {
	if (!text || text.length == 0) {
		return "[empty]";
	}
	if (text && text.length > maxChars) {
		return text.substring(0, maxChars) + "...";
	}
	return text;
};

var isEmptyString = function(strValue) {
	return strValue === undefined || strValue === null || strValue === "";
};

var formattedDate = function(dateValue) {
	return dateValue ? dateValue.toLocaleString().substring(0,16).replace('T', ' ') : "";
};

var isCompletedExecution = function(testExecution) {
	if (!testExecution || !testExecution.tests) return false;

	var remainingTestsFound = false;
	for (var i = 0; i < testExecution.tests.length; i++) {
		var status = testExecution.tests[i].status;
		switch (status) {
			case "OK": break;
			case "FAIL": break;
			case "COULDNOTTEST": break;
			default: remainingTestsFound = true;
		}
	}
	return !remainingTestsFound;
};

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
};