var LYNTEST = LYNTEST || {};

LYNTEST.FILIMPORT = LYNTEST.FILIMPORT || {};

LYNTEST.FILIMPORT.load = function( onFileImportValidatedOkFunction, onFileImportSavedOkFunction ) {

	var onFileImportValidatedOkCallback = onFileImportValidatedOkFunction;
	var onFileImportSavedOkCallback = onFileImportSavedOkFunction;

	var justImportedFromFile = null;

	LYNTEST.FILIMPORT.saveImportedFile = function(newTestSuiteName) {
		if (isEmptyString(newTestSuiteName)) {
			alert('Enter a name for the test suite!');
			return;
		}
		if (LYNTEST.DAO.containsSuiteWithName(newTestSuiteName)) {
			alert('That name has already been used. Enter a different name.');
			return;
		}

		justImportedFromFile.name = newTestSuiteName;
		LYNTEST.DAO.addAndStoreTestSuite(justImportedFromFile);
		onFileImportSavedOkCallback();
	};

	var createTestSuite = function(suiteName, listOfTests) {
		var result = {};
		result.guid = 'TS-' + generateQuickGuid();
		result.name = suiteName;
		result.tests = listOfTests;
		result.executions = [];
		result.created = new Date();
		return result;
	};

	var createTest = function(testId, testName, testDefinitionUrl) {
		var result = {};
		result.guid = 'TEST-' + generateQuickGuid();
		result.id = testId;
		result.name = testName;
		result.url = testDefinitionUrl;
		return result;
	};


	var processImportedTextFile = function(allText) {
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var testList = [];

		for (var i=0; i<allTextLines.length; i++) {
			var splittedLine = allTextLines[i].split(';');
			var testDescriptionUrl = splittedLine[1];
			var splittedFirstPart = splittedLine[0].split(':');
			var testId = splittedFirstPart[0];
			var testName = splittedFirstPart[1];

			console.log("===========");
			console.log(testId);
			console.log(testName);
			console.log(testDescriptionUrl);

			testList.push(createTest(testId, testName, testDescriptionUrl));
		}

		return testList;
	};

	var processImportedHtmlFile = function(allText) {
		var htmlContainer = $('<div>' + allText + '</div>');
		var allLinks = $(htmlContainer).find('a');
		var testList = [];
		for (var i=0; i < allLinks.length; i++) {
			var linkText = allLinks[i].innerText;
			if (linkText.indexOf(':') > -1) {
				var linkUrl = allLinks[i].href;
				var idAndName = linkText.split(':');
				testList.push(createTest(idAndName[0], idAndName[1], linkUrl));
			}
		}
	    return testList;
	};


	var processImportedFile = function(allText) {
		if (allText.indexOf('a href') > -1) {
			return processImportedHtmlFile(allText)
		} else {
			return processImportedTextFile(allText);
		}
	};

	var fileDropArea = document.getElementById('fileDropArea');

		if (typeof window.FileReader === 'undefined') {
		  alert("Drag and drop is not supported by this browser");
		}

		fileDropArea.ondragover = function () { this.className = 'hover'; return false; };
		fileDropArea.ondragend = function () { this.className = ''; return false; };
		fileDropArea.ondrop = function (e) {
		file = e.dataTransfer.files[0]
	      reader = new FileReader();

		reader.onload = function (event) {
			 console.log(event.target);
			 var contents = event.target.result;

			 var testList = processImportedFile(contents);
			 justImportedFromFile = createTestSuite(file.name, testList);
			 onFileImportValidatedOkFunction(justImportedFromFile);
		};
		console.log(file);
		reader.readAsText(file);

		return false;
	};
};