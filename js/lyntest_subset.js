var LYNTEST = LYNTEST || {};

LYNTEST.SUBSET = LYNTEST.SUBSET || {};

LYNTEST.SUBSET.load = function( doRefreshFunction ) {

	var doRefreshCallback = doRefreshFunction;

	var testSuiteGuid = getParameterByName(LYNTEST.QUERYPARAMS.testSuiteId);

	var createTestSuite = function(suiteName, listOfTests) {
		var result = {};
		result.guid = 'TS-' + generateQuickGuid();
		result.name = suiteName;
		result.tests = listOfTests;
		result.executions = [];
		result.created = new Date();
		return result;
	};

	LYNTEST.SUBSET.justChangedCurrentTestStatus = false;

	LYNTEST.SUBSET.getTestSuite = function() {
		var testSuite = _.findWhere(LYNTEST.DAO.suites, {guid: testSuiteGuid});
		return testSuite;
	};

	LYNTEST.SUBSET.saveSubsetAs = function(newTestSuiteName, selectedTestsNameList) {

		if (isEmptyString(newTestSuiteName)) {
			alert('Enter a name for the test suite!');
			return;
		}
		if (LYNTEST.DAO.containsSuiteWithName(newTestSuiteName)) {
			alert('That name has already been used. Enter a different name.');
			return;
		}

		var originalTestSuite = _.findWhere(LYNTEST.DAO.suites, {guid: testSuiteGuid});
		var listOfTests = [];
		for (var i = 0; i < originalTestSuite.tests.length; i++) {
			var testIsSelected = (selectedTestsNameList.indexOf(originalTestSuite.tests[i].id) > -1);
			if (testIsSelected) {
				listOfTests.push(originalTestSuite.tests[i]);
			}
		}

		var newTestSuite = createTestSuite(newTestSuiteName, listOfTests);
		LYNTEST.DAO.addAndStoreTestSuite(newTestSuite);

		alert('New test suite created.');
	};

	LYNTEST.SUBSET.getCurrentTest = function() {
		var testExecution = LYNTEST.SUBSET.getTestExecution();
		return testExecution.tests[testExecution.currentTestIndex];
	};

	LYNTEST.SUBSET.getLinkToPreviousTest = function() {
		var testExecution = LYNTEST.SUBSET.getTestExecution();
		var linkHtml = "";
		if (testExecution.currentTestIndex > 0) {
			var prevTest = testExecution.tests[testExecution.currentTestIndex - 1];
			linkHtml = '<a href="#" onclick="LYNTEST.SUBSET.goToPrevious(); return false;"> &lt;&lt; ' + prevTest.test.id + '</a>';
		}
		return linkHtml;
	};

	LYNTEST.SUBSET.getLinkToNextTest = function() {
		var testExecution = LYNTEST.SUBSET.getTestExecution();
		var linkHtml = "";
		if (testExecution.currentTestIndex < testExecution.tests.length - 1) {
			var nextTest = testExecution.tests[testExecution.currentTestIndex + 1];
			linkHtml = '<a href="#" onclick="LYNTEST.SUBSET.goToNext(); return false;">' + nextTest.test.id + ' &gt;&gt;</a>';
		}
		return linkHtml;
	};
};