var LYNTEST = LYNTEST || {};

LYNTEST.EXECUTION = LYNTEST.EXECUTION || {};

LYNTEST.EXECUTION.load = function( doRefreshFunction ) {

	var doRefreshCallback = doRefreshFunction;

	var testSuiteGuid = getParameterByName(LYNTEST.QUERYPARAMS.testSuiteId);
	var testExecutionGuid = getParameterByName(LYNTEST.QUERYPARAMS.testExecutionId);

	var createTestSuite = function(suiteName, listOfTests) {

	};

	var validateTestStatus = function(status) {
		return status === undefined || status === 'OK' || status === 'FAIL' || status === 'COULDNOTTEST';
	};

	var performSave= function(testExecution) {
		testExecution.updated = new Date();
		LYNTEST.DAO.saveCurrentStatus();
	};

	LYNTEST.EXECUTION.justChangedCurrentTestStatus = false;

	LYNTEST.EXECUTION.getTestExecution = function() {
		var testSuite = _.findWhere(LYNTEST.DAO.suites, {guid: testSuiteGuid});
		return _.findWhere(testSuite.executions, {guid: testExecutionGuid});
	};

	LYNTEST.EXECUTION.getCurrentTest = function() {
		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		return testExecution.tests[testExecution.currentTestIndex];
	};

	LYNTEST.EXECUTION.getLinkToPreviousTest = function() {
		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		var linkHtml = "";
		if (testExecution.currentTestIndex > 0) {
			var prevTest = testExecution.tests[testExecution.currentTestIndex - 1];
			linkHtml = '<a href="#" onclick="LYNTEST.EXECUTION.goToPrevious(); return false;"> &lt;&lt; ' + prevTest.test.id + '</a>';
		}
		return linkHtml;
	};

	LYNTEST.EXECUTION.getLinkToNextTest = function() {
		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		var linkHtml = "";
		if (testExecution.currentTestIndex < testExecution.tests.length - 1) {
			var nextTest = testExecution.tests[testExecution.currentTestIndex + 1];
			linkHtml = '<a href="#" onclick="LYNTEST.EXECUTION.goToNext(); return false;">' + nextTest.test.id + ' &gt;&gt;</a>';
		}
		return linkHtml;
	};

	LYNTEST.EXECUTION.goToPrevious = function() {
		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		testExecution.currentTestIndex -= 1;
		performSave(testExecution);
		LYNTEST.EXECUTION.justChangedCurrentTestStatus = false;
		doRefreshCallback();
	};

	LYNTEST.EXECUTION.goToNext = function() {
		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		testExecution.currentTestIndex += 1;
		performSave(testExecution);
		LYNTEST.EXECUTION.justChangedCurrentTestStatus = false;
		doRefreshCallback();
	};

	LYNTEST.EXECUTION.goToFirst = function() {
		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		testExecution.currentTestIndex = 0;
		performSave(testExecution);
		LYNTEST.EXECUTION.justChangedCurrentTestStatus = false;
		doRefreshCallback();
	};

	LYNTEST.EXECUTION.goToLast = function() {
		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		testExecution.currentTestIndex = testExecution.tests.length - 1;
		performSave(testExecution);
		LYNTEST.EXECUTION.justChangedCurrentTestStatus = false;
		doRefreshCallback();
	};

	LYNTEST.EXECUTION.setTestStatus = function(status) {
		if (!validateTestStatus(status)) {
			alert('setTestStatus: invalid status (' + status + ')');
			return;
		}

		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		var currentTest = LYNTEST.EXECUTION.getCurrentTest();
		currentTest.status = status;
		if (!status || status === "OK") {
			currentTest.comment = undefined;
		}
		performSave(testExecution);
		LYNTEST.EXECUTION.justChangedCurrentTestStatus = true;
		doRefreshCallback();
	};

	LYNTEST.EXECUTION.setTestErrorDescription = function(errorDescription) {
		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		var currentTest = LYNTEST.EXECUTION.getCurrentTest();
		currentTest.comment = errorDescription;
		performSave(testExecution);
	};

	LYNTEST.EXECUTION.getAmountOfOkFailed = function() {
		var amountByStatus = {};
		amountByStatus.ok = 0;
		amountByStatus.failed = 0;
		amountByStatus.couldNotTest = 0;
		amountByStatus.remaining = 0;
		amountByStatus.total = 0;

		var testExecution = LYNTEST.EXECUTION.getTestExecution();
		for (var i = 0; i < testExecution.tests.length; i++) {
			var status = testExecution.tests[i].status;
			amountByStatus.total += 1;
			switch (status) {
				case "OK":
					amountByStatus.ok += 1;
					break;
				case "FAIL":
					amountByStatus.failed += 1;
					break;
				case "COULDNOTTEST":
					amountByStatus.couldNotTest += 1;
					break;
			 	default:
			 		amountByStatus.remaining += 1;
			}
		}
		return amountByStatus;
	};
};