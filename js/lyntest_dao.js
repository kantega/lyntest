var LYNTEST = LYNTEST || {};

LYNTEST.QUERYPARAMS = LYNTEST.QUERYPARAMS || {};

LYNTEST.QUERYPARAMS.testSuiteId = 'testSuiteId';
LYNTEST.QUERYPARAMS.testExecutionId = 'testExecId';

LYNTEST.DAO = LYNTEST.DAO || {};
LYNTEST.DAO.localstorageId = 'LYNTEST_TEST_SUITE';

LYNTEST.DAO.load = function() {

	LYNTEST.DAO.saveCurrentStatus = function() {
		localStorage.setItem(LYNTEST.DAO.localstorageId, JSON.stringify(LYNTEST.DAO.suites));
	};

	LYNTEST.DAO.containsSuiteWithName = function(testSuiteName) {
		for (var i=0; i<LYNTEST.DAO.suites.length; i++) {
			if (LYNTEST.DAO.suites[i].name === testSuiteName) {
				return true;
			}
		};
		return false;
	}

	LYNTEST.DAO.addAndStoreTestSuite = function(testSuite) {
		LYNTEST.DAO.suites.push(testSuite);
		LYNTEST.DAO.saveCurrentStatus();
	};

	LYNTEST.DAO.deleteTestSuite = function(testSuiteGuid) {

		var deleteThis = _.findWhere(LYNTEST.DAO.suites, {guid: testSuiteGuid});
		if (deleteThis) {
			var deletePosition = _.indexOf(LYNTEST.DAO.suites, deleteThis);
			LYNTEST.DAO.suites.splice(deletePosition, 1);
		}
		LYNTEST.DAO.saveCurrentStatus();
	};

	LYNTEST.DAO.createTestSuiteExecution = function(testSuiteGuid, newTestExecutionName) {

		// dette for aa sikre at endringer i andre faner blir med
		retrieveExistingSuites();

		if (isEmptyString(newTestExecutionName)) {
			alert('Name cannot be empty');
			return;
		}

		var testSuite = _.findWhere(LYNTEST.DAO.suites, {guid: testSuiteGuid});
		if (!testSuite) return false;

		if (testSuiteHasExecutionWithName(testSuite, newTestExecutionName)) {
			alert('That name has already been used. Enter a different name.');
			return;
		}

		var d = new Date();
		var testSuiteExecution = {};
		testSuiteExecution.guid = 'EXEC-' + generateQuickGuid();
		testSuiteExecution.testSuiteGuid = testSuite.guid;
		testSuiteExecution.name = newTestExecutionName;
		testSuiteExecution.tests = [];
		testSuiteExecution.currentTestIndex = 0;
		testSuiteExecution.completedTests = 0;
		testSuiteExecution.created = new Date();
		testSuiteExecution.updated = null;

		for (var i=0; i<testSuite.tests.length; i++) {
		   testSuiteExecution.tests.push(createSingleTestExecution(testSuite.tests[i]));
		};

		testSuite.executions.push(testSuiteExecution);
		LYNTEST.DAO.saveCurrentStatus();

		return true;
	};

	LYNTEST.DAO.deleteTestSuiteExecution = function(testSuiteGuid, testExecutionGuid) {

		// dette for aa sikre at endringer siden siste hentes fra siste lagrede versjon
		retrieveExistingSuites();

		var testSuite = _.findWhere(LYNTEST.DAO.suites, {guid: testSuiteGuid});
		if (!testSuite || !testSuite.executions) { alert('Could not delete'); return false; };

		var testExecution = _.findWhere(testSuite.executions, {guid: testExecutionGuid});
		var deletePosition = _.indexOf(testSuite.executions, testExecution);

		if (deletePosition < 0 || deletePosition >= testSuite.executions.length) { alert('Could not delete'); return false; };

		testSuite.executions.splice(deletePosition, 1);
		LYNTEST.DAO.saveCurrentStatus();
		return true;
	};

	var testSuiteHasExecutionWithName = function(testSuite, newTestSuiteName) {
		if (!testSuite) return false;

		var executionsInTestSuite = testSuite.executions;
		for (var i=0; i < executionsInTestSuite.length; i++) {
			if (newTestSuiteName === executionsInTestSuite[i].name) {
				return true;
			}
		};
		return false;
	};

	var createSingleTestExecution = function(testFromSuite) {
		var singleTestExecution = {};
		singleTestExecution.test = testFromSuite;
		singleTestExecution.status = undefined;
		singleTestExecution.comment = undefined;
		return singleTestExecution;
	};

	var retrieveExistingSuites = function() {
		var stringyfiedSuites = localStorage.getItem(LYNTEST.DAO.localstorageId);
		if (!stringyfiedSuites) {
			alert('No suites found in local storage');
		}
		LYNTEST.DAO.suites = JSON.parse(stringyfiedSuites) || [];
	};

	retrieveExistingSuites();

};